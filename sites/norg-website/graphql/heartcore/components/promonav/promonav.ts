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

const log = getLogger("ata.headless.graphql.heartcore.components.promonav")

export function promonav(slug: string) {
    return `query GetPromoNavContents($slug: String!) {
  content(url: $slug) {
    url
    contentTypeAlias
    name
    id
    updateDate
    sortOrder
    children {
      edges {
        node {
          __typename
          name
          updateDate
          sortOrder
          children {
            edges {
              node {
                __typename
                name
                level
                updateDate
                sortOrder
                ... on PromoNav {
                  url
                  header
                  contentTypeAlias
                  name
                  backgroundColour
                  sortOrder
                  selectableVariant
                  order
                  align
                  maxItemsPerRow
                  colReverse
                  topRounded
                  bottomRounded
                  components {
                    content {
                      contentTypeAlias
                      ... on PromonavComponentCOMP {
                        title
                        contentTypeAlias
                        component {
                          content {
                            contentTypeAlias
                            __typename
                            ... on CaseStudyBlock {
                              contentTypeAlias
                              casestudyTitle
                              casestudyType
                              casestudyImage {
                                url
                                media {
                                  name
                                  updateDate
                                  mediaTypeAlias
                                  ... on Image {
                                    updateDate
                                    altText
                                  }
                                }
                              }
                              casestudyDescription
                              casestudyAnalysis {
                                content {
                                  __typename
                                  ... on CasestudystaticscomponentCOMP {
                                    casestudydigitTitle
                                    casestudydigits
                                  }
                                }
                              }
                              buttons {
                                content {
                                  __typename
                                  ... on CasestudyherobuttonscomponentCOMP {
                                    buttonText
                                    buttonsURL {
                                      target
                                      name
                                      url
                                      type
                                      udi
                                    }
                                  }
                                }
                              }
                            }
                            ... on ShowcaseBlock {
                              __typename
                              showcaseTitle
                              showcaseDescription
                              showcaseImage {
                                url
                              }
                              showcaseType
                              showcaseTestimonials {
                                content {
                                  contentTypeAlias
                                  __typename
                                  ... on TestimonialComponentCOMP {
                                    authorName
                                    testimonialMessage
                                    testimonialTimestamp
                                    testimonialAvatar {
                                      url
                                    }
                                  }
                                }
                              }

                              showcaseCTAList {
                                content {
                                  ... on CtaComponentCOMP {
                                    __typename
                                    heading
                                    link {
                                      url
                                      target
                                      name
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

export default function GetPromoNavQuery() {
  return promonav;
}

export async function mapPromoNavData(data, pageIdentifier: PageIdentifier, languageSite: LanguageSite, sortOrder: number) {
  log.trace("data.content.children.edges > ", data?.content?.children?.edges);

  if (!data?.content?.children?.edges) {
    return null;
  }

  const edges = data.content.children.edges;
  let matchingDataArray = filterSubComponentData(edges, 'PromoNav');
  let matchingResult: any = null;

  // If this call is a recursive call, then the data is structured slightly differently.
  // A recursive call would load the global datasource. the following code handles that case.
  if (matchingDataArray.length === 0 && data.content.contentTypeAlias === 'PromoNav') {
    return await urlToFriendly(data.content, languageSite);
  } else if (matchingDataArray.length > 0) {
    // filter by matching sortOrder, take the first result
    const filteredBySortOrder = matchingDataArray.filter((item) => item?.sortOrder === sortOrder);
    if (filteredBySortOrder.length === 1) {
      matchingResult = filteredBySortOrder[0];
    }
  }

  if (matchingResult) {
    matchingResult.componentDocumentation = getComponentDocumentation();
    matchingResult.youtubeVideo = getYoutubeDocumentation();
  }

  return await urlToFriendly(matchingResult, languageSite);
}

async function urlToFriendly(matchingDataArray, languageSite) {
  if (matchingDataArray) {
    await processRawUrlsOnServer(matchingDataArray, languageSite);
  }
  return matchingDataArray;
}

function getComponentDocumentation() {
  return "/library/22-promo-nav";
}

function getYoutubeDocumentation() {
  return "https://youtu.be/KfJ2zzdEgTA";
}
