import {
  variablesMultiSiteByIdentifier,
  variablesMultiSiteSlug,
} from "@/ui-base/lib/cms/_base/tools/common/multiSite"
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { getMatchingResultBySortOrder } from "@/ui-base/lib/util/filterTools"

const log = getLogger("headless.graphql.heartcore.forms")

export function form(slug: string) {
  return `    
  query formComponentsBySlug($slug: String!) {
    content(url: $slug) {
      url
      contentTypeAlias
      name
      sortOrder   
      updateDate                                   
      ... on Form{
          formCode
          backgroundColour
          updateDate
          thankyouPage{
             updateDate
              url
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
                              name
                              level
                              sortOrder  
                              contentTypeAlias        
                              updateDate                     
                              ... on Form{
                                  formCode
                                  backgroundColour
                                  updateDate
                                  thankyouPage{
                                      url
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

export default function GetGalleryQuery() {
  return form;
}

export function mapFormData(data, pageIdentifier: PageIdentifier, languageSite: LanguageSite, sortOrder: number) {
  log.trace("variables heartcore mapFormData > ", JSON.stringify(data))
  log.trace("mapFormData data.content.children.edges > ", data.content.children.edges);

  let matchingData = null;

   // This is a special case to handle for Accordion and Grid Sub-Components
   if(data?.content?.contentTypeAlias == 'form'){ 
    matchingData = data.content;

  // This is the main case of handling rich text as page Sub-Components
  }else {
    log.trace("mapRichTextData data.content.children.edges > ", data.content.children.edges);
    matchingData = getMatchingResultBySortOrder(data.content.children.edges, "Form", sortOrder);
  }

  if (!matchingData) {
    matchingData = {}
  }

  matchingData.componentDocumentation = getComponentDocumentation();
  matchingData.youtubeVideo = getYoutubeDocumentation();

  return matchingData;
}

function getComponentDocumentation() {
  return "/library/14-forms";
}

function getYoutubeDocumentation() {
  return "https://youtu.be/IOvO1KYW1fU";
}