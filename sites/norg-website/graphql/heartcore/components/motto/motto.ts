import {
  variablesMultiSiteByIdentifier,
  variablesMultiSiteSlug,
} from "@/ui-base/lib/cms/_base/tools/common/multiSite"
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { filterFirstSubComponentData, getMatchingResultBySortOrder } from "@/ui-base/lib/util/filterTools"

const log = getLogger("headless.graphql.heartcore.components.motto")

export function motto(slug: string) {
  return `    
  
  query GetMottoComponent($slug: String!) {
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
                              sortOrder
                              updateDate
                              ... on Motto{
                                  words 
                                  selectableVariant
                                  topRounded
                                  bottomRounded
                                  align
                                  updateDate
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
  return motto
}

export function mapMottoData(data, pageIdentifier: PageIdentifier, languageSite: LanguageSite, sortOrder: number) {
  log.trace("variables heartcore mapMottoData > ", JSON.stringify(data))
  log.trace("data.content.children.edges > ", data.content.children.edges);

  if(!data.content.children.edges){
    return {};
  }

  let matchingData:any = getMatchingResultBySortOrder(data.content.children.edges, "Motto", sortOrder);
 
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
  return "https://www.youtube.com/watch?v=ZVJFeeKO3RQ";
}
