import { processRawUrlsOnServer } from '@/ui-base/lib/cms/heartcore/tools/processRawUrlsOnServer';
import { GetLanguageSiteByCode } from '@/ui-base/lib/cms/heartcore/tools/urlTools';
import { getSearchHeaders } from '@/ui-base/lib/services/search/searchRenderService';
import applyRateLimit from '@/applyRateLimit';
// Taken from https://www.npmjs.com/package/xss-clean as the library
// is deprecated
var _xssFilters = require('xss-filters');
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function clean(...args) {
  var data = args.length > 0 && args[0] !== undefined ? args[0] : '';

  var isObject = false;
  if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
    data = JSON.stringify(data);
    isObject = true;
  }

  data = (0, _xssFilters.inHTMLData)(data).trim();
  if (isObject) data = JSON.parse(data);

  return data;
}

export default async function handler(req, res) {
    try {
	await applyRateLimit(req, res)
    } catch {
	// console.log("Too many requests...rate limiting in effect")
	return res.status(429).send('Too many requests')
    }

    const query = clean(req?.query?.q);
    const language = clean(req?.query?.language);

    const countryCode = await GetLanguageSiteByCode(language);
    const slugPrefix = countryCode?.homepageSlugPrefix;
    const resultsToReturn = 15;
    try {
	const filteredData = await fetchFilteredContent(slugPrefix, query, resultsToReturn)
        if (filteredData) {
            await processRawUrlsOnServer(filteredData, countryCode, 'en-us');
        }

	// Check and limit the filteredData to a maximum of 15 items
	filteredData._embedded.content = filteredData._embedded.content.slice(0, resultsToReturn);
	filteredData._totalItems = filteredData._embedded.content.length;
	filteredData._totalPages = Math.ceil(filteredData._totalItems / filteredData._pageSize);

        res.status(200).json(filteredData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching search results' });
    }
}

async function fetchFilteredContent(slugPrefix: string, query: string, resultsToReturn:number = 50,
				    pageSize:number = 50, page:number = 1 , allContent:any[] = []) {
    const headers = getSearchHeaders();
    const url = `https://cdn.umbraco.io/content/search?term=${query}&pageSize=${pageSize}&page=${page}`;
    const response = await fetch(url, { method: 'GET', headers: headers });
    const data = await response.json();
    const totalPages = data?._totalPages;
    const currentPage :number = data?._page;
    const filteredContent = data._embedded.content ? data._embedded.content.filter(item => !item._url.includes('_components') && item._url.startsWith(slugPrefix)) : '';

    // add filtered content to the accumulated content array
    allContent.push(...filteredContent);
    if (allContent.length < resultsToReturn && currentPage < totalPages) {
	// console.log("Fetching more data")

	// fetch next
	return fetchFilteredContent(slugPrefix, query, resultsToReturn, pageSize, page + 1, allContent);
    } else{
	// Update JSON variables and return all the accumulated content
	data._totalItems = allContent.length;
	data._totalPages = Math.ceil(allContent.length / data._pageSize);
	// console.log(`Total Items: ${allContent.length}, Total Pages: ${data._totalPages}`);
	data._embedded.content = allContent;

	return data;
    }
}
