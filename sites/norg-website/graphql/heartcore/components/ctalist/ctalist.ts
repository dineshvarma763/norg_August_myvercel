import {
  variablesMultiSiteByIdentifier,
  variablesMultiSiteSlug,
} from "@/ui-base/lib/cms/_base/tools/common/multiSite"
import { processRawUrlsOnServer } from "@/ui-base/lib/cms/heartcore/tools/processRawUrlsOnServer"
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier"
import { loadSingleComponentGraphQLData } from "@/ui-base/lib/services/components/pageSubComponentDataService"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { filterSubComponentData } from "@/ui-base/lib/util/filterTools"

const log = getLogger("ata.headless.graphql.heartcore.components.ctalist")

export function ctalist(slug: string) {
  return `
  query GetCtaList($slug: String!) {
    content(url: $slug) {
      url
      contentTypeAlias
      name
      id
      updateDate
      ... on CTAList{
          url
          selectableVariant
          maxItemsPerRow
          colReverse
          heading
          text
          sortOrder
          order
          align
          backgroundColour
          topRounded
          bottomRounded
          updateDate
          callToActionItems{
            content{
                __typename
                contentTypeAlias
                ... on CtaComponentCOMP{
                    backgroundColour
                    contentTypeAlias
                    heading
                    icon{
                        url
                        media{
                          name
                          mediaTypeAlias
                          updateDate
                          ... on Image{
                                    altText
                                    name
                                    updateDate
                           }
                           ... on UmbracoMediaVectorGraphics{
                            altText
                            name
                            updateDate
                          }
                        }
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
      }
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
                              updateDate
                              ... on CTAList{
                                updateDate
                                  text
                                  heading
                                  selectableVariant
                                  maxItemsPerRow
                                  colReverse
                                  align
                                  sortOrder
                                  order
                                  topRounded
                                  bottomRounded
                                  backgroundColour
                                  updateDate
                                  datasource{
                                      id
                                      url                                      
                                      name
                                      __typename
                                      updateDate
                                  }
                                  callToActionItems{
                                      content{
                                          __typename
                                          contentTypeAlias
                                          ... on CtaComponentCOMP{
                                              backgroundColour
                                              imageDropShadow
                                              contentTypeAlias
                                              heading
                                              icon{
                                                  url
                                                  media{
                                                    name
                                                    updateDate
                                                    mediaTypeAlias
                                                    ... on Image{
                                                              altText
                                                              name
                                                              updateDate
                                                     }
                                                  }
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
  return variables;
}

export default function GetctaListQuery() {
  return ctalist;
}

// export function mapCtaListData(data, pageIdentifier: PageIdentifier) {
//   log.trace("data.content.children.edges > ", data.content.children.edges);
//   const edges = data.content.children.edges;
//   let matchingData = filterSubComponentData(edges, 'CTAList');
//   return matchingData;
// }

export async function mapCtaListData(data, pageIdentifier: PageIdentifier, languageSite: LanguageSite, sortOrder: number) {
  log.trace("data.content.children.edges > ", data?.content?.children?.edges);

  if(!data?.content?.children?.edges){
    return null;
  }

  const edges = data.content.children.edges;
  let matchingDataArray = filterSubComponentData(edges, 'CTAList');

  let matchingResult:any = null;

  // If this call is a recursive call, then the data is structured slightly differently.
  // A recursive call would load the global datasource. the following code handles that case.
  if(matchingDataArray.length === 0 && data.content.contentTypeAlias === 'cTAList'){
    return await urlToFriendly(data.content, languageSite);
  }else if(matchingDataArray.length > 0){
    // filter by matching sortOrder, take the first result
    const filteredBySortOrder = matchingDataArray.filter((item) => item?.sortOrder === sortOrder);
    if(filteredBySortOrder.length === 1){
      matchingResult = filteredBySortOrder[0];
    }
  }

  if (matchingResult && matchingResult.datasource && matchingResult.datasource.url) {
    try {
      const dataItem = {id: matchingResult.datasource.id, name : matchingResult.datasource.name, url: matchingResult.datasource.url, __typename: 'ctalist'};
      const data = await loadSingleComponentGraphQLData(dataItem, matchingResult.datasource.url, 'ctalist', languageSite);
      if(!data){
        return null;
      }
      const globalItems = data.componentData;      
      if(globalItems){
        globalItems.sortOrder = matchingResult?.sortOrder;
        globalItems.order = matchingResult?.order;
        globalItems.componentDocumentation = getComponentDocumentation();
        globalItems.youtubeVideo = getYoutubeDocumentation();
        return await urlToFriendly(globalItems, languageSite);
      }
    } catch (err) {
      log.error(`Failed to fetch data from external source: ${err}`, matchingResult?.datasource?.url, err?.stack);
      // handle error
    }
  }

  if(matchingResult){
    matchingResult.componentDocumentation = getComponentDocumentation(); 
    matchingResult.youtubeVideo = getYoutubeDocumentation();
  }
  
  return await urlToFriendly(matchingResult, languageSite);
}

async function urlToFriendly(matchingDataArray, languageSite){
  if (matchingDataArray) {
    await processRawUrlsOnServer(matchingDataArray, languageSite);
  }
  return matchingDataArray;
}

function getMetaData() {
  return {  
    componentDocumentation: getComponentDocumentation(), 
    youtubeVideo:getYoutubeDocumentation()
  }
}

function getComponentDocumentation() {
  return "/library/5-cta-lists-and-sections";
}

function getYoutubeDocumentation() {
  return "https://youtu.be/KfJ2zzdEgTA";
}
