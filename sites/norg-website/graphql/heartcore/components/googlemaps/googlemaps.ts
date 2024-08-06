import {
    variablesMultiSiteByIdentifier,
    variablesMultiSiteSlug,
} from "@/ui-base/lib/cms/_base/tools/common/multiSite"
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { filterFirstSubComponentData, getMatchingResultBySortOrder } from "@/ui-base/lib/util/filterTools"

const log = getLogger("headless.graphql.heartcore.components.googlemaps")

export function googlemaps(slug: string) {
    return `query GoogleMapsComponentsBySlug($slug: String!) {
    content(url: $slug) {
        url
        contentTypeAlias
        name
        updateDate
        ... on GoogleMaps {
            iframeCode
            sortOrder
            updateDate
            datasource {
                __typename
                updateDate
                ... on GoogleMaps {
                    sortOrder
                    iframeCode
                    updateDate
                }
            }
        }
        children{
            edges{
                node{
                    __typename
                    name
                    url
                    updateDate
                    children{
                        edges{
                            node {
                                __typename
                                sortOrder
                                updateDate
                                ... on GoogleMaps {
                                    iframeCode
                                    updateDate
                                    datasource {
                                        __typename
                                        updateDate
                                        sortOrder
                                        ... on GoogleMaps{
                                            iframeCode
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

    log.trace("variables heartcore googlemaps > ", variables)
    return variables
}

export default function GetGooglemapsQuery() {
    return googlemaps
}

export function mapGooglemapsData(data, pageIdentifier: PageIdentifier, languageSite: LanguageSite, sortOrder: number) {
    log.trace("variables heartcore mapGooglemapsData > ", JSON.stringify(data))
    log.trace("data.content.children.edges > ", data.content.children.edges);

    let matchingData:any = getMatchingResultBySortOrder(data.content.children.edges, "GoogleMaps", sortOrder);
    // log.info(">>>>> Matching Data mapGooglemapsData <<<<<<<< ", JSON.stringify(data))

    if (!matchingData) {
        matchingData = {}
    }

    matchingData.componentDocumentation = getComponentDocumentation();
    matchingData.youtubeVideo = getYoutubeDocumentation();

    return matchingData;
}

function getComponentDocumentation() {
    return "/library/16-google-maps";
}

function getYoutubeDocumentation() {
    return "https://www.youtube.com/watch?v=y7Y5pbfUj5o";
}
