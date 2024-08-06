import {
  variablesMultiSiteByIdentifier,
  variablesMultiSiteSlug,
} from "@/ui-base/lib/cms/_base/tools/common/multiSite"
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { filterFirstSubComponentData, getMatchingResultBySortOrder } from "@/ui-base/lib/util/filterTools"

const log = getLogger("headless.graphql.heartcore.components.featurethreeImages")

export function featurethreeImages(slug: string) {
  return `query FeatureThreeImagesComponentsBySlug($slug: String!) {
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
                         sortOrder
                         updateDate                                                       
                         ... on FeatureThreeImagesSection{   
                          __typename
                             url    
                             align
                             sortOrder  
                             backgroundColour
                             contentTypeAlias
                             updateDate                                    
                            featureThreeImagesSectionListing{  
                               content
                               {
                                ... on FeaturethreeimagessectioncomponentCOMP{
                                       featureImage
                                       {
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
                     featureDescription                            
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

  log.trace("variables heartcore featurethreeImages > ", variables)
  return variables
}

export default function GetFeaturethreeImagesQuery() {
  return featurethreeImages
}

export function mapFeaturethreeImagesData(data, pageIdentifier: PageIdentifier, languageSite: LanguageSite, sortOrder: number) {
  log.trace("variables heartcore mapFeaturethreeImagesData > ", JSON.stringify(data))
  log.trace("data.content.children.edges > ", data.content.children.edges);

  let matchingData:any = getMatchingResultBySortOrder(data.content.children.edges, "FeatureThreeImagesSection", sortOrder);

  if (!matchingData) {
    matchingData = {}
  }

  matchingData.componentDocumentation = getComponentDocumentation()
  matchingData.youtubeVideo = getYoutubeDocumentation()

  return matchingData;
}

function getComponentDocumentation() {
  return "/library/11-feature-three-images";
}

function getYoutubeDocumentation() {
  return "https://www.youtube.com/watch?v=QIHgqTAtqEw";
}
