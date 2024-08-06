import {
    variablesMultiSiteByIdentifier,
    variablesMultiSiteSlug,
  } from "@/ui-base/lib/cms/_base/tools/common/multiSite"
  import { processRawUrlsOnServer } from "@/ui-base/lib/cms/heartcore/tools/processRawUrlsOnServer"
  import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"
  import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier"
  import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
  import { filterFirstSubComponentData, filterSubComponentData, getMatchingResultBySortOrder } from "@/ui-base/lib/util/filterTools"
  
  const log = getLogger("headless.graphql.heartcore.norgdemocreation")
  
  export function norgdemocreation(slug: string) {
    return `    
    query ChatComponentsBySlug($slug: String!) {
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
                    node{
                             __typename
                             name
                             level
                             updateDate   
                                                                  
                             ... on NorgDemoCreation{   
                              labelOne
                              backgroundColour
                              align
                              buttonTextOne
                              buttonTextTwo
                              fieldPlaceholderOne
                              fieldPlaceholderTwo
                              sortOrder
                              heading
                              subHeading
                      
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
  
    return variables
  }
  
  export default function GetNorgAssistantChatQuery() {
    return norgdemocreation
  }
  
  export async function mapNorgDemoCreationData(data, pageIdentifier: PageIdentifier, languageSite: LanguageSite, sortOrder: number) {
    log.trace("variables heartcore mapNorgDemoCreationData > ", JSON.stringify(data));
    const edges = data.content.children.edges;
    log.trace("data.content.children.edges > ", edges);
  
    let matchingData:any = getMatchingResultBySortOrder(edges, "NorgDemoCreation", sortOrder);
    
    log.trace("mapNorgDemoCreationData matchingData", matchingData);

    if (!matchingData) {
      matchingData = {}
    }
  
    matchingData.componentDocumentation = getComponentDocumentation();
    matchingData.youtubeVideo = getYoutubeDocumentation();
  
    if (matchingData) {
      await processRawUrlsOnServer(matchingData, languageSite);
    }
    return matchingData;
  }
  
  function getComponentDocumentation() {
    return "/library/3-hero-component";
  }
  
  function getYoutubeDocumentation() {
    return "https://www.youtube.com/watch?v=QjRs6QA8y6Q";
  }
  