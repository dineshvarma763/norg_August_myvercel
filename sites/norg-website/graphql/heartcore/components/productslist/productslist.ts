import {
  variablesMultiSiteByIdentifier,
  variablesMultiSiteSlug,
} from "@/ui-base/lib/cms/_base/tools/common/multiSite"
import { processRawUrlsOnServer } from "@/ui-base/lib/cms/heartcore/tools/processRawUrlsOnServer"
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier"
import { loadSingleComponentGraphQLData } from "@/ui-base/lib/services/components/pageSubComponentDataService"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { filterSubComponentData, getMatchingResultBySortOrder } from "@/ui-base/lib/util/filterTools"

const log = getLogger("ata.headless.graphql.heartcore.components.productslist")

export function productslist(slug: string) {
  return `query ProductsListingBySlug($slug: String!){
    subComponentsPage(url: $slug) {
      url
      contentTypeAlias
      name
      sortOrder
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
                              url
                              name
                              level
                              sortOrder
                              updateDate
                              ... on ProductsList{
                                      createDate
                                      updateDate
                                      sortOrder
                                       selectableVariant
                                       topRounded
                                       bottomRounded
                                       backgroundColour
                                       align
                                      maxItemsPerRow
                                      colReverse
                                      productListCommonImage
                                      {
                                          url
                    media{
                    name
                    updateDate
                    mediaTypeAlias
                    ... on Image{altText}
                    }
                                      }
                                      productListHeading
                                      productListLinks{
                                      content
                   {
                    __typename
                    ... on HerobuttonscomponentCOMP
                    {
                       buttonText
                       buttonsURL{
                              target
                              name
                              url
                              type
                              udi
                            }
                       buttonBackgroundColour,
                       buttonFontColour			
                                           }
                                      }                                      
                }
                                  products
                                  {
                                      content
                                      {
                                          __typename
                                          ... on ProductDetailsComponentCOMP{
                                            productImage
                                            {
                                              url
                                              media{
                                              name
                                              updateDate
                                              mediaTypeAlias
                                              ... on Image{altText}
                                              }
                                          }
                                              productTitle
                                              productDescription
                                              productCTAList
                                              {
                                                  content
                                                  {
                                                      __typename
                                                      ... on CtaComponentCOMP{
                                                        backgroundColour
                                                        contentTypeAlias
                                                        heading
                                                        icon{
                                                          url
                                                        }
                                                        link{
                                                          target
                                                          name
                                                          url
                                                          type
                                                          udi
                                                        }
                                                        text
                                                      }
                                                  }
                                        }                       	
                      productButtons
                      {
                       content
                       {
                        __typename
                        ... on HerobuttonscomponentCOMP
                        {
                           buttonText
                           buttonsURL{
                                  target
                                  name
                                  url
                                  type
                                  udi
                                }
                           buttonBackgroundColour,
                           buttonFontColour
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
      }     
  }
}`
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
  return variables;
}

export default function GetProductListQuery() {
  return productslist;
}

export async function mapProductListData(data, pageIdentifier: PageIdentifier, languageSite: LanguageSite, sortOrder: number) {
  log.trace("data.subComponentsPage.children.edges > ", data?.subComponentsPage?.children?.edges);


  if (!data?.subComponentsPage?.children?.edges) {
    return null;
  }

  const edges = data.subComponentsPage.children.edges;
  let matchingDataArray = filterSubComponentData(edges, 'ProductsList');
  let matchingResult: any = null;

  // If this call is a recursive call, then the data is structured slightly differently.
  // A recursive call would load the global datasource. the following code handles that case.
  if (matchingDataArray.length === 0 && data.subComponentsPage.contentTypeAlias === 'ProductsList') {
    return await urlToFriendly(data.subComponentsPage, languageSite);
  } else if (matchingDataArray.length > 0) {
    // filter by matching sortOrder, take the first result
    const filteredBySortOrder = matchingDataArray.filter((item) => item?.sortOrder === sortOrder);
    if (filteredBySortOrder.length === 1) {
      matchingResult = filteredBySortOrder[0];
    }
  }

  if (matchingResult) {
    matchingResult.componentDocumentation = getComponentDocumentation();
    matchingResult.youtubeVideo = getYoutubeDocumentation();
  }

  return await urlToFriendly(matchingResult, languageSite);
}

async function urlToFriendly(matchingDataArray, languageSite) {
  if (matchingDataArray) {
    await processRawUrlsOnServer(matchingDataArray, languageSite);
  }
  return matchingDataArray;
}

function getComponentDocumentation() {
  return "/library/24-products";
}

function getYoutubeDocumentation() {
  return "https://youtu.be/KfJ2zzdEgTA";
}