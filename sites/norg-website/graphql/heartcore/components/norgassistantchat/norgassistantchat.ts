import {
    variablesMultiSiteByIdentifier,
    variablesMultiSiteSlug,
  } from "@/ui-base/lib/cms/_base/tools/common/multiSite"
  import { processRawUrlsOnServer } from "@/ui-base/lib/cms/heartcore/tools/processRawUrlsOnServer"
  import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"
  import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier"
  import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
  import { filterFirstSubComponentData, filterSubComponentData, getMatchingResultBySortOrder } from "@/ui-base/lib/util/filterTools"
  
  const log = getLogger("headless.graphql.heartcore.norgassistantchat")
  
  export function norgassistantchat(slug: string) {
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
                                                                  
                             ... on NorgAssistantChat{   
                              variation_style   
                              client_match            
                              primary_color
                              secondary_color
                              chatbot_position
                              chatbot_mode
                              mode
                              visible_on_page
                              chatbot_element_ids
                              chatbot_location
                              text
                              user_label
                              assistant_label
                              family
                              src             
                              sortOrder
                              email
                              phone
                              followup
                              followup_prompt
                              followup_idle
                              followup_max
                              question_1
                              question_2
                              question_3
                              backgroundColour
                              height
                              width
                              imageEndpoint
                                                                            
                              assistant_avatar_url{
                                  url
                                  media{
                                    name
                                    mediaTypeAlias
                                    updateDate
                                    ... on Image{
                                            altText
                                            updateDate
                                          }
                                  }
                              }

                                                                            
                              user_avatar_url{
                                  url
                                  media{
                                    name
                                    mediaTypeAlias
                                    updateDate
                                    ... on Image{
                                            altText
                                            updateDate
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
  
    return variables
  }
  
  export default function GetNorgAssistantChatQuery() {
    return norgassistantchat
  }
  
  export async function mapNorgAssistantChatData(data, pageIdentifier: PageIdentifier, languageSite: LanguageSite, sortOrder: number) {
    log.trace("variables heartcore mapHeroData > ", JSON.stringify(data));
    const edges = data.content.children.edges;
    log.trace("data.content.children.edges > ", edges);
  
    let matchingData:any = getMatchingResultBySortOrder(edges, "NorgAssistantChat", sortOrder);
    
    log.trace("mapNorgAssistantChatData matchingData", matchingData);

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
  