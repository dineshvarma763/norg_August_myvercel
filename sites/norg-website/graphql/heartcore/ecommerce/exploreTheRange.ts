import {
  variablesMultiSiteByIdentifier,
  variablesMultiSiteSlug,
} from "@/ui-base/lib/cms/_base/tools/common/multiSite"
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier"
import { extractUmbracoGuid } from "@/ui-base/lib/cms/heartcore/tools/extractUmbracoGuid"
import { loadSingleComponentGraphQLData } from "@/ui-base/lib/services/components/pageSubComponentDataService"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { stripSiteLanguagePrefixAsync } from "@/ui-base/lib/services/stripSiteLanguagePrefixAsync"
import { getMatchingResultBySortOrder } from "@/ui-base/lib/util/filterTools"
import { processRawUrlsOnServer } from "@/ui-base/lib/cms/heartcore/tools/processRawUrlsOnServer"

const log = getLogger("headless.graphql.heartcore.product.exploretherange")

export function exploreTheRange(slug: string) {
  return `
  query ProductCategoryListingBySlug($slug: String!) {
    subComponentsPage(url: $slug) {
       url
       contentTypeAlias
       name
       ogDescription
       updateDate
       children{
           edges{
               node{
                   __typename
                   name
                   updateDate
                   children{
                       edges{
                           node {
                               __typename
                               name
                               level
                               sortOrder
                               updateDate
                               ... on Exploretherange{
                                  align
                                   __typename
                                   contentTypeAlias
                                   updateDate
                                   explore{
                                       content
                                       {
                                           __typename
                                           contentTypeAlias
                                           ... on ProductListCategoryCOMP{
                                               backgroundColour
                                               fullSectionBackgroundColour
                                               button{
                                                   name
                                                   target
                                                   type
                                                   url
                                                   udi
                                               }
                                               contentTypeAlias
                                               heading
                                               introductionText                                               
                                           }
                                       }
                                   }
                               }
                           }
                       }
                   }
               }
           }
       }
    }
}
  `
}

export function variables(
  pageIdentifierOrSlug: PageIdentifier | string,
  languageSite: LanguageSite
) {
  let variables = {};

  if (typeof pageIdentifierOrSlug === "string") {
    variables = variablesMultiSiteSlug(pageIdentifierOrSlug, languageSite)
  } else {
    variables = variablesMultiSiteByIdentifier(pageIdentifierOrSlug, languageSite)
  }

  log.trace("variables heartcore productList > ", variables)
  return variables
}

export default function GetExploreQuery() {
  return exploreTheRange;
}

export async function mapExploreTheRangeData(data, pageIdentifier: PageIdentifier, languageSite: LanguageSite, sortOrder: number) {
  log.trace("variables heartcore mapExploreTheRangeData > ", JSON.stringify(data));
  const edges = data.subComponentsPage.children.edges;
  log.trace("data.content.children.edges > ", edges);

  let matchingData:any = getMatchingResultBySortOrder(edges, "Exploretherange", sortOrder);
  
  if (!matchingData) {
    matchingData = {}
  }

  matchingData.componentDocumentation = getComponentDocumentation();
  matchingData.youtubeVideo = getYoutubeDocumentation();

  await retrieveProductDetails(matchingData, pageIdentifier, languageSite);
  validateChildrenProducts(matchingData);

  if (matchingData) {
    await processRawUrlsOnServer(matchingData, languageSite);
  } 

  return matchingData;
}

export async function retrieveProductDetails(matchingResult: any, pageIdentifier: PageIdentifier, languageSite: LanguageSite) {
  if (matchingResult && matchingResult.explore) {
    // map each item to a Promise
    const itemPromises = matchingResult?.explore?.map(async ({content: item}) => {
      try {
        if (!item || !item.button) {
          log.info('retrieveProductDetails item?.button is null > ', item);
          return null; // If item or item.button is not available, return null
        }

        const udi = item.button.udi;
        const slug = await stripSiteLanguagePrefixAsync(item.button.url);
        if(!slug){
          log.info('retrieveProductDetails slug is null > ', slug);
          return null; // If slug is not available, return null
        }

        const dataItem = {url: slug, id: extractUmbracoGuid(udi), __typename: 'page'};
        const data = await loadSingleComponentGraphQLData(dataItem, slug, 'productList', languageSite);

        if (data && data.componentData && data.componentData.length > 0) {
          item.childrenProducts = data.componentData;
        } else {
          //log.warn('retrieveProductDetails error > item.childrenProducts is not set > ', item.url, slug);
          return null; // If data is not available, return null
        }

        return item; // If everything is successful, return the item

      } catch (error) {
        log.error('Error in retrieveProductDetails for item > ', item.url, ' Error: ', error);
        return null; // In case of error, return null
      }
    });

    // wait for all Promises to resolve
    const items = await Promise.all(itemPromises);
    return items.filter(item => item !== null); // Filter out any null results
  } else {
    log.info('retrieveProductDetails matchingResult is null or does not contain explore property > ', matchingResult);
    return [];
  }
}

export function validateChildrenProducts(matchingResult: any) {
  if (matchingResult && matchingResult.explore) {
    for (const {content: item} of matchingResult.explore) {
      if (!item?.childrenProducts || item?.childrenProducts?.length === 0) {
        // log.trace('Validation error > item.childrenProducts is not set or empty > ', item.url, matchingResult.url);
      }
    }
  } else {
    // log.info('Validation function called with invalid matchingResult, it is null or does not contain explore property > ', matchingResult.url);
  }
}

function getComponentDocumentation() {
  return "/library/7-explore-the-range";
}

function getYoutubeDocumentation() {
  return "https://youtu.be/Mm-zdAYohTE";
}