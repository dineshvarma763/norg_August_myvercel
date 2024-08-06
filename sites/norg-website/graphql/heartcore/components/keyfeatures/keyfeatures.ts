import {
  variablesMultiSiteByIdentifier,
  variablesMultiSiteSlug,
} from "@/ui-base/lib/cms/_base/tools/common/multiSite"
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { getMatchingResultBySortOrder } from "@/ui-base/lib/util/filterTools"

const log = getLogger("headless.graphql.heartcore.components.keyfeatures")

export function keyfeatures(slug: string) {
  return `     
  query GetKeyFeaturesComponent($slug: String!) {
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
                              contentTypeAlias
                              name
                              level       
                              updateDate                         
                              ... on KeyFeatures{
                                  heading
                                  text
                                  backgroundColour
                                  sortOrder
                                  selectableVariant
                                  topRounded
                                  bottomRounded
                                  align
                                  updateDate
                                  keyFeatures{
                                      content{
                                          __typename
                                          contentTypeAlias
                                          ... on HeadingImageRichTextCOMP{
                                              contentTypeAlias
                                              description
                                              heading                                              
                                              image{
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

export default function GetKeyFeaturesQuery() {
  return keyfeatures
}

export function mapKeyFeaturesData(data, pageIdentifier: PageIdentifier, languageSite: LanguageSite, sortOrder: number) {
  log.trace("variables heartcore mapGalleryData > ", JSON.stringify(data))
  log.trace("mapGalleryData data.content.children.edges > ", data.content.children.edges);

  let matchingData:any = getMatchingResultBySortOrder(data.content.children.edges, "KeyFeatures", sortOrder)

  if (!matchingData) {
    matchingData = {}
  }

  matchingData.componentDocumentation = getComponentDocumentation();
  matchingData.youtubeVideo = getYoutubeDocumentation();

  return matchingData;
}

function getComponentDocumentation() {
  return "/library/8-key-features";
}

function getYoutubeDocumentation() {
  return "https://youtu.be/HB6sQDLLAJc";
}
