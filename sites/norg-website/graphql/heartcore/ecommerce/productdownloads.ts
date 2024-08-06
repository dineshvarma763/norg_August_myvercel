import {
    variablesMultiSiteByIdentifier,
    variablesMultiSiteSlug,
} from "@/ui-base/lib/cms/_base/tools/common/multiSite"
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { filterFirstSubComponentData, getMatchingResultBySortOrder } from "@/ui-base/lib/util/filterTools"

const log = getLogger("headless.graphql.heartcore.components.productdownloads")

export function productdownloads(slug: string) {
    return `
    query ProductDownloadsByLink($slug: String!) {
        productPage(url: $slug) {
           id
           url
           contentTypeAlias
           name
           __typename   
           updateDate    
           children(where: { contentTypeAlias_ends_with: "dataFolder" }) {
            edges {
              node {
                __typename
                contentTypeAlias
                name
                updateDate
                      children(where: { contentTypeAlias_ends_with: "ProductDownloads" }) {
                          edges
                          {
                              node{
                                  name
                                  contentTypeAlias
                                  __typename    
                                  updateDate                        
                                  ... on ProductDownloads{
                                      order  
                                      sortOrder    
                                      align
                                      backgroundColour  
                                      updateDate
                                      productPicker{
                                          name
                                          updateDate
                                          ... on ProductPage
                                          {
                                            downloads{
                                                content{
                                                    __typename
                                                    contentTypeAlias
                                                    ... on HeadingImageMediaButtonComponentCOMP{
                                                        buttonText
                                                        contentTypeAlias
                                                        heading
                                                        image{
                                                            url
                                                            media{                                                   
                                                                ... on Image{
                                                                        altText
                                                                        updateDate
                                                                      }
                                                              }
                                                        }
                                                        media{
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

export default function GetVideoSectionQuery() {
    return productdownloads
}

export function mapProductDownloadsData(data, pageIdentifier: PageIdentifier, languageSite: LanguageSite, sortOrder: number) {

    if(!data?.productPage?.children?.edges){
        return {}
    }

    let matchingData:any = getMatchingResultBySortOrder(data?.productPage?.children?.edges, "ProductDownloads", sortOrder);

    if (!matchingData) {
        matchingData = {}
    }

    matchingData.componentDocumentation = getComponentDocumentation();
    matchingData.youtubeVideo = getYoutubeDocumentation();
  
    return matchingData;
  }
  
  function getComponentDocumentation() {
    return "/library/21-product-downloads";
  }
  
  function getYoutubeDocumentation() {
    return "https://www.youtube.com/watch?v=...";
  }
