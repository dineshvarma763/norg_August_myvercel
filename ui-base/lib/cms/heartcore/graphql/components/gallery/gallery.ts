import {
  variablesMultiSiteByIdentifier,
  variablesMultiSiteSlug,
} from "@/ui-base/lib/cms/_base/tools/common/multiSite"
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { filterFirstSubComponentData, getMatchingResultBySortOrder } from "@/ui-base/lib/util/filterTools"

const log = getLogger("headless.graphql.heartcore.product.productList")

export function gallery(slug: string) {
  return `    
 
  query GetGalleryComponent($slug: String!) {
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
                              url
                              name
                              level
                              updateDate
                              ... on Gallery{
                                  sortOrder
                                  order
                                  heading
                                  updateDate
                                  images{
                                      url
                                      media{
                                        name
                                        updateDate
                                        mediaTypeAlias
                                        ... on Image{
                                          updateDate
                                          altText}
                                        }
                                  }
                                  selectableVariant
                                  align
                                  backgroundColour
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

export default function GetGalleryQuery() {
  return gallery
}

export function mapGalleryData(data, pageIdentifier: PageIdentifier, languageSite: LanguageSite, sortOrder: number) {
  log.trace("variables heartcore mapGalleryData > ", JSON.stringify(data))
  log.trace("mapGalleryData data.content.children.edges > ", data.content.children.edges);

  let matchingData = getMatchingResultBySortOrder(data.content.children.edges, "Gallery", sortOrder)

  if (!matchingData) {
    matchingData = {}
  }

  matchingData.componentDocumentation = getComponentDocumentation();
  matchingData.youtubeVideo = getYoutubeDocumentation();

  return matchingData;
}

function getComponentDocumentation() {
  return "/library/6-gallery";
}

function getYoutubeDocumentation() {
  return "https://youtu.be/0LYpxTW8dX0";
}