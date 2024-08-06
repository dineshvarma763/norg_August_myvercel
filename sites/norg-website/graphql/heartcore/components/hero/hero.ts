import {
  variablesMultiSiteByIdentifier,
  variablesMultiSiteSlug,
} from "@/ui-base/lib/cms/_base/tools/common/multiSite"
import { processRawUrlsOnServer } from "@/ui-base/lib/cms/heartcore/tools/processRawUrlsOnServer"
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { filterFirstSubComponentData, filterSubComponentData, getMatchingResultBySortOrder } from "@/ui-base/lib/util/filterTools"

const log = getLogger("headless.graphql.heartcore.product.productList")

export function hero(slug: string) {
  return `    
  query GetHeroComponent($slug: String!) {
    content(url: $slug) {
      url
      contentTypeAlias
      name
      sortOrder
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
                              url
                              ... on Hero{
                                  image{
                                    url
                                    media{
                                      updateDate
                                      name
                                      mediaTypeAlias
                                      ... on Image
                                          {
                                            altText
                                          }
                                      }
                                  }
                                  pageSectionListing{
                                    content
                                    {
                                        ...on PageSectionTextComponentCOMP
                                        {
                                              pageSectionTitle,
                                              pageSectionURL                 
                                        }
                                    }
                                }
                                  sortOrder
                                  heading                               
                                heroButtonUrls
                                {
                                 content
                                 {
                                    __typename
                                    ... on HerobuttonscomponentCOMP
                                    {
                                         buttonText
                                         buttonsURL{
                                                        target
                                                        name
                                                        url
                                                        type
                                                        udi
                                                    }
                                         buttonBackgroundColour,
                                         buttonFontColour
                                    }
                                 }
                                }
                                  description
                                  hideBreadcrumbs
                                  selectableVariant
                                  backgroundColour
                                  align                                  
                                  fontSize
                                  fontWeight
                                  lineHeight                            
                                  updateDate
                                  topRounded
                                  bottomRounded
                              }
                          }
                      }
                  }
                  ... on ProductPage{
                      id
                      productDescription
                      updateDate
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

export default function GetHeroQuery() {
  return hero
}

export async function mapHeroData(data, pageIdentifier: PageIdentifier, languageSite: LanguageSite, sortOrder: number) {
  log.trace("variables heartcore mapHeroData > ", JSON.stringify(data));
  const edges = data.content.children.edges;
  log.trace("data.content.children.edges > ", edges);

  let matchingData:any = getMatchingResultBySortOrder(edges, "Hero", sortOrder);
  
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
