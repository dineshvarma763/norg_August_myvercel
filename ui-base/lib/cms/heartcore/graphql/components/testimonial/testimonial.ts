lib => cms => heartcore => graphql => componets => testimonial => testimonial.ts
import {
  variablesMultiSiteByIdentifier,
  variablesMultiSiteSlug,
} from "@/ui-base/lib/cms/_base/tools/common/multiSite"
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { filterFirstSubComponentData, getMatchingResultBySortOrder } from "@/ui-base/lib/util/filterTools"

const log = getLogger("headless.graphql.heartcore.components.testimonial")

export function testimonial(slug: string) {
  return `
  query TestimonialComponentsBySlug($slug: String!) {      
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
                            updateDate                           
                            ... on Testimonials{
                               		url	
                                  sortOrder
                                  order
                                  backgroundColour
                                  updateDate
                                 pageTestimonial{
                                   content{							
                                             ... on TestimonialComponentCOMP
                                            {
                                                testimonialTitle
                                                testimonialDescription
                                                authorName
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

  log.trace("variables heartcore testimonial > ", variables)
  return variables
}

export default function GetTestimonialQuery() {
  return testimonial
}

export function mapTestimonialData(data, pageIdentifier: PageIdentifier, languageSite: LanguageSite, sortOrder: number) {
  log.trace("variables heartcore mapTestimonialData > ", JSON.stringify(data))
  log.trace("data.content.children.edges > ", data.content.children.edges);

  let matchingData = getMatchingResultBySortOrder(data.content.children.edges, "Testimonials", sortOrder);
 
  if (!matchingData) {
    matchingData = {}
  }

  matchingData.componentDocumentation = getComponentDocumentation();
  matchingData.youtubeVideo = getYoutubeDocumentation();

  return matchingData;
}

function getComponentDocumentation() {
  return "/library/4-highlight";  
}

function getYoutubeDocumentation() {
  return "https://youtu.be/19yxAmuLVKc";
}