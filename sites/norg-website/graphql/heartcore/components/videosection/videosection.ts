import {
    variablesMultiSiteByIdentifier,
    variablesMultiSiteSlug,
} from "@/ui-base/lib/cms/_base/tools/common/multiSite"
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { filterFirstSubComponentData, getMatchingResultBySortOrder } from "@/ui-base/lib/util/filterTools"

const log = getLogger("headless.graphql.heartcore.components.videosection")

export function videosection(slug: string) {
    return `
    query VideoSectionComponentsBySlug($slug: String!) {
      content(url: $slug) {
        url
        id
        contentTypeAlias
        name
        updateDate
        children{
            edges{
                node{
                    __typename
                    name
                    updateDate
                    children(where: { contentTypeAlias_ends_with: "VideoSection" }) {
                        edges{
                            node {
                                __typename
                                contentTypeAlias
                                name
                                level
                                updateDate
                                ... on VideoSection{
                                    title
                                    id
                                    description
                                    backgroundColour
                                    sortOrder
                                    selectableVariant
                                    topRounded
                                    bottomRounded
                                    align
                                    updateDate
                                    videoLink {
                                        url
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

    // log.debug("variables heartcore videosection > ", variables)
    return variables
}

export default function GetVideoSectionQuery() {
    return videosection
}

export function mapVideoSectionData(data, pageIdentifier: PageIdentifier, languageSite: LanguageSite, sortOrder: number) {
    // log.trace("variables videosection mapVideoSectionData > ", JSON.stringify(data))
    // log.debug("data.content.children.edges > ", data.content.children.edges);

    let matchingData:any = getMatchingResultBySortOrder(data.content.children.edges, "VideoSection", sortOrder);

    if (!matchingData) {
        matchingData = {}
    }

    matchingData.componentDocumentation = getComponentDocumentation();
    matchingData.youtubeVideo = getYoutubeDocumentation();
  
    return matchingData;
  }
  
  function getComponentDocumentation() {
    return "/library/18-video-section";
  }
  
  function getYoutubeDocumentation() {
    return "https://www.youtube.com/watch?v=y7Y5pbfUj5o";
  }
