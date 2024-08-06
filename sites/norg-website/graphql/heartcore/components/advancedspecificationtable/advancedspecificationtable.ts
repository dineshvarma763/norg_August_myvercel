import {
    variablesMultiSiteByIdentifier,
    variablesMultiSiteSlug,
} from "@/ui-base/lib/cms/_base/tools/common/multiSite"
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { getMatchingResultBySortOrder } from "@/ui-base/lib/util/filterTools"

const log = getLogger("headless.graphql.heartcore.components.advancedspecificationtable")

export function advancedspecificationtable(slug: string) {
    return `     
    query GetAdvSpecTableComponent($slug: String!) {
        content(url: $slug) {
          url
          contentTypeAlias
          name
          updateDate
          children{
              edges{
                  node{
                      __typename
                      url
                      name
                      updateDate
                      children{
                          edges{
                              node{
                                 __typename
                                contentTypeAlias
                                name
                                level      
                                sortOrder
                                updateDate                          
                                ... on AdvancedSpecificationTable{
                                    rows{
                                        content{
                                            ... on ProductSpecificationTableRow{
                                                values{
                                                    content{
                                                        ... on SpecificationTableColumn{
                                                            isHeading
                                                            columnSpan
                                                            value
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

    return variables
}

export default function GetSpecificationsTableQuery() {
    return advancedspecificationtable
}

export function mapAdvancedSpecificationTableData(data, pageIdentifier: PageIdentifier, languageSite: LanguageSite, sortOrder: number) {

    let matchingData:any = getMatchingResultBySortOrder(data.content.children.edges, "AdvancedSpecificationTable", sortOrder);

    if (!matchingData) {
        matchingData = {}
    }

    matchingData.componentDocumentation = getComponentDocumentation();
    matchingData.youtubeVideo = getYoutubeDocumentation();
  
    return matchingData;
  }
  
  function getComponentDocumentation() {
    return "/library/20-advanced-specifications-table";
  }
  
  function getYoutubeDocumentation() {
    return "https://youtu.be/W38R-pbiq38";
  }