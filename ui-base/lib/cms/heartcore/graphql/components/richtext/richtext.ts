import {
    variablesMultiSiteByIdentifier,
    variablesMultiSiteSlug,
  } from "@/ui-base/lib/cms/_base/tools/common/multiSite"
  import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier"
  import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
  import { getMatchingResultBySortOrder } from "@/ui-base/lib/util/filterTools"
import { filterAndUpdateClassServer } from "../../../filterAndUpdateServer"
  
  const log = getLogger("headless.graphql.heartcore.components.richtext")
  
  export function richtext(slug: string) {
    return `    
    query GetRichTextComponent($slug: String!) {
        content(url: $slug) {
          url
          contentTypeAlias
          name
          sortOrder  
          updateDate                       
          ... on Richtext{
              body
              order  
              sortOrder    
              align
              backgroundColour
              updateDate
              topRounded
              bottomRounded
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
                                  name
                                  level  
                                  url    
                                  sortOrder 
                                  updateDate                        
                                  ... on Richtext{
                                      body
                                      order  
                                      sortOrder    
                                      align
                                      backgroundColour
                                      updateDate
                                      topRounded
                                      bottomRounded
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
  
  export default function GetRichTextQuery() {
    return richtext
  }
  
  export async function mapRichTextData(data, pageIdentifier: PageIdentifier, languageSite: LanguageSite, sortOrder: number) {
    log.trace("variables heartcore mapRichTextData > ", JSON.stringify(data))
    
    let matchingData:any = getMetaData();

    // This is a special case to handle for Accordion and Grid Sub-Components
    if(data?.content?.contentTypeAlias == 'richtext'){ 
      matchingData = data?.content;
      matchingData.processedBody = await processRichBody(matchingData?.body, languageSite);
      matchingData.lastUpdated = data?.content?.updateDate ? data?.content?.updateDate : '';

    // This is the main case of handling rich text as page Sub-Components
    }else {
      log.trace("mapRichTextData data.content.children.edges > ", data.content.children.edges);
      matchingData = getMatchingResultBySortOrder(data.content.children.edges, "Richtext", sortOrder);
      matchingData.processedBody = await processRichBody(matchingData?.body, languageSite);
      matchingData = {...matchingData, ...getMetaData(matchingData?.updateDate)};
    }

    if (!matchingData) {
      matchingData = getMetaData();
    }   

    return matchingData;
  }

function getMetaData(lastUpdate?: string) {
  return {  
    componentDocumentation: getComponentDocumentation(), 
    youtubeVideo: getYoutubeDocumentation(),
    lastUpdated: lastUpdate
  }
}

function getComponentDocumentation() {
  return "/library/1-rich-text-simple";
}

function getYoutubeDocumentation() {
  return "https://www.youtube.com/watch?v=y7Y5pbfUj5o";
}

async function processRichBody(body: any, languageSite: LanguageSite) {
  return await filterAndUpdateClassServer(body, languageSite, true);
}
