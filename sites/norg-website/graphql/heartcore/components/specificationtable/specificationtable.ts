import {
    variablesMultiSiteByIdentifier,
    variablesMultiSiteSlug,
} from "@/ui-base/lib/cms/_base/tools/common/multiSite"
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { getMatchingResultBySortOrder } from "@/ui-base/lib/util/filterTools"

const log = getLogger("headless.graphql.heartcore.components.specificationstable")

export function specificationtable(slug: string) {
    return `   
    query GetSpecificationsTableComponent($slug: String!) {
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
                              node {
                                  __typename
                                  url
                                  contentTypeAlias
                                  name
                                  level   
                                  sortOrder      
                                  updateDate                       
                                  ... on SpecificationTable{
                                      selectableVariant
                                      align
                                      sortOrder
                                      updateDate
                                      specifications{
                                          content{
                                              contentTypeAlias
                                              __typename
                                              ... on ProductSpecificationTableEntryCOMP{
                                                  category
                                                  title
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
    return specificationtable
}

export function mapSpecificationTableData(data, pageIdentifier: PageIdentifier, languageSite: LanguageSite, sortOrder: number) {

    let matchingData:any = getMatchingResultBySortOrder(data.content.children.edges, "SpecificationTable", sortOrder);

    if (!matchingData) {
        matchingData = {}
    }

    matchingData.componentDocumentation = getComponentDocumentation();
    matchingData.youtubeVideo = getYoutubeDocumentation();
  
    return matchingData;
  }
  
  function getComponentDocumentation() {
    return "/library/19-specifications-table";
  }
  
  function getYoutubeDocumentation() {
    return "https://youtu.be/W38R-pbiq38";
  }