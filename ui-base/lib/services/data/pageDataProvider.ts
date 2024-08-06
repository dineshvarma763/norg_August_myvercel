import { LanguageSite } from "../../interfaces/LanguageSite";
import { getPageTypeBySlug } from "../model/getPageTypeBySlug";
import { buildPageData } from "./buildPageData";
import { GetLanguageSiteByURL } from "../languageService";
import { getLogger } from "../logging/LogConfig";
import { collectSitemapNavigationStructure } from "./collectSitemapNavigationStructure";
import { notFound } from "next/navigation";

const log = getLogger("headless.pageDataProvider");

export async function collectDynamicPageData(params, slug) {
      
    let { cmsUrl, languageSite }: { cmsUrl: any; languageSite: LanguageSite; } = await browserUrlToCmsUrlConverter(slug);
    
    const pageTypeResult = (await getPageTypeBySlug(cmsUrl, languageSite));

    // Handle 404 if no page type is found
    if(!pageTypeResult || !pageTypeResult.contentTypeAlias){
      log.error("collectDynamicPageData > pageTypeResult or pageTypeResult.contentTypeAlias is undefined >> ", slug);
      notFound();
    }

    const pageType = pageTypeResult?.contentTypeAlias;
    log.debug("collectDynamicPageData > pageType > ", pageType);
    const pageData = await buildPageData(pageType, true, languageSite, {slug: cmsUrl}); 

    return { pageData, cmsUrl};
}

// This function accepts the path segment of the Browser URL. 
// It will return the correct slug for the CMS and the language site.
// browserSlug:  Is the browser URL not the CMS Url
// Please Read: https://expiadev.atlassian.net/wiki/spaces/HP/pages/3692363790/Language+Sites+and+URL+Construction
export async function browserUrlToCmsUrlConverter(browserSlug: any) {

  let languageSite: LanguageSite = await GetLanguageSiteByURL(browserSlug);

  const sitemapStructure = await collectSitemapNavigationStructure(languageSite);
  const match = sitemapStructure.find(
    (page) => page.superAlias === "/" + browserSlug || page.url === "/" + browserSlug
  );

  if (typeof (match) !== 'undefined') { // We have a super alias match
    browserSlug = match.slug;
  }
  return { cmsUrl: browserSlug, languageSite };
}

export function GetPageComponentData(data, field){
  
  // Test is the data is of tpe array and search the array for a matching field called __typename that equals fieldName
  if(Array.isArray(data)){
    const result = data.find((item) => item.__typename === field);
    if(result){
      return result;
    }
  }
  
  const fieldName = field.toLowerCase();
  if(data?.data?.pageComponentData && data?.data?.pageComponentData.hasOwnProperty(fieldName) && data?.data?.pageComponentData[field]){
      return data?.data?.pageComponentData[field];
  }else if(data?.pageComponentData && data?.pageComponentData.hasOwnProperty(fieldName) && data?.pageComponentData[field]){
    return data?.pageComponentData[field];
  } 
}