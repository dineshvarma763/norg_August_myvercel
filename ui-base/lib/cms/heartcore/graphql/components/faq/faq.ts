import {
  variablesMultiSiteByIdentifier,
  variablesMultiSiteSlug,
} from "@/ui-base/lib/cms/_base/tools/common/multiSite"
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier"
import { loadSingleComponentGraphQLData } from "@/ui-base/lib/services/components/pageSubComponentDataService"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { filterSubComponentData } from "@/ui-base/lib/util/filterTools"

const log = getLogger("base.headless.graphql.heartcore.components.faq")

export function faq(slug: string) {
  return `query FaqComponentsBySlug($slug: String!) {
    content(url: $slug) {
      url
      contentTypeAlias
      name
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
                              ... on Faq{   
                                  url	
                                  backgroundColour
                                  updateDate
                                  datasource
                                  {
                                    id
                                    url
                                    name
                                    __typename
                                    updateDate
                                    ... on Faq
                                    {
                                        updateDate
                                        faqsList{
                                            content{							
                                               ... on HeadingTextComponentCOMP
                                              {
                                                 heading
                                                 text
                                              }
                                            }   
                                        }

                                    }
                                  }
                                   faqsList{
                                      content{							
                                               ... on HeadingTextComponentCOMP
                                              {
                                                 heading
                                                 text
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
        ... on Faq{
            updateDate
            faqsList{
          content{							
                  ... on HeadingTextComponentCOMP
                  {
                      heading
                      text
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

  log.trace("variables heartcore faq > ", variables)
  return variables
}

export default function GetFaqQuery() {
  return faq
}

export async function mapFaqData(data, pageIdentifier: PageIdentifier, languageSite: LanguageSite, sortOrder: number) {
  log.trace("variables heartcore mapFaqData > ", JSON.stringify(data))
  log.trace("data.content.children.edges > ", data.content.children.edges);
  const edges = data.content.children.edges;
  let matchingDataArray = filterSubComponentData(edges, 'Faq');

  let matchingResult = null;

  // If this call is a recursive call, then the data is structured slightly differently.
  // A recursive call would load the global datasource. the following code handles that case.
  if (matchingDataArray.length === 0 && data.content.contentTypeAlias === 'faq') {
    return data.content;
  } else if (matchingDataArray.length > 0) {
    // filter by matching sortOrder, take the first result
    const filteredBySortOrder = matchingDataArray.filter((item) => item.sortOrder === sortOrder);
    if (filteredBySortOrder.length === 1) {
      matchingResult = filteredBySortOrder[0];
    }
  }


  if (matchingResult && matchingResult.datasource && matchingResult.datasource.url) {
    try {
      const dataItem = { id: matchingResult.datasource.id, name: matchingResult.datasource.name, url: matchingResult.datasource.url, __typename: 'Faq' };
      const data = await loadSingleComponentGraphQLData(dataItem, matchingResult.datasource.url, 'Faq', languageSite);
      if (!data) {
        return null;
      }
      const globalItems = data.componentData;
      if(globalItems){
        globalItems.sortOrder = matchingResult.sortOrder;
        globalItems.componentDocumentation = getComponentDocumentation();
        globalItems.youtubeVideo = getYoutubeDocumentation();
      }
      return globalItems;
    } catch (err) {
      log.error(`faq - Failed to fetch data from external source: ${err}`, matchingResult?.datasource?.url, err?.stack);
      // handle error
    }
  }

  if(matchingResult){
    matchingResult.componentDocumentation = getComponentDocumentation();
    matchingResult.youtubeVideo = getYoutubeDocumentation();
  }

  return matchingResult;
}

function getComponentDocumentation() {
  return "/library/13-faqs";
}

function getYoutubeDocumentation() {
  return "https://youtu.be/_ofHDwsTCEw";
}