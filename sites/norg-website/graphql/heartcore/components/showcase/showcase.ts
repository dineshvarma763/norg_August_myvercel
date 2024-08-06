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

const log = getLogger("headless.graphql.heartcore.components.showcase")

export function showcase(slug: string) {
  return `query GetCaseStudyList($slug: String!) {
    content(url: $slug) {
      url
      contentTypeAlias
      name
      id
      updateDate
      sortOrder
       children{
          edges{
              node{
                 __typename
                  name
                  updateDate
                  sortOrder
                  children{
                      edges{
                          node {
                              __typename
                              url
                              name
                              level
                              updateDate
                              sortOrder
                                ... on Showcase {
                                      sortOrder
                                      selectableVariant
                                      order
                                      align
                                      maxItemsPerRow
                                      colReverse
                                      topRounded
                                      bottomRounded
                                     showcaseTitle
                                     showcaseDescription
                                     showcaseImage {
                                        url
                                     }
                                     showcaseType
                                     showcaseTestimonials {
                                        content {
                                            ... on TestimonialComponentCOMP {
                                                    authorName
                                                    testimonialTimestamp
                                                    testimonialAvatar {
                                                        url
                                                    }
                                                    testimonialMessage
                                                }
                                        }
                                     }
                                     showcaseCTAList {
                                        content {
                                          ... on CtaComponentCOMP {
                                            contentTypeAlias
                                            backgroundColour
                                            heading
                                            link {
                                                name
                                                target
                                                url
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

export default function GetShowcaseListQuery() {
  return showcase;
}

export async function mapShowcaseData(data, pageIdentifier: PageIdentifier, languageSite: LanguageSite, sortOrder: number) {
  log.trace("data.content.children.edges > ", data?.content?.children?.edges);

  let matchingData:any = getMatchingResultBySortOrder(data.content.children.edges, "Showcase", sortOrder);
 
  if (!matchingData) {
    matchingData = {}
  }

  matchingData.componentDocumentation = getComponentDocumentation();
  matchingData.youtubeVideo = getYoutubeDocumentation();

  return matchingData;
}


function getComponentDocumentation() {
  return "/library/22-showcase";
}

function getYoutubeDocumentation() {
  return "https://youtu.be/KfJ2zzdEgTA";
}