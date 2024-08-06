import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier";
import { variablesMultiSiteByIdentifier, variablesMultiSiteSlug } from "@/ui-base/lib/cms/_base/tools/common/multiSite";
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig";

const log = getLogger("headless.graphql.heartcore.product.productDetails");

export function productDetails(slug:string)
{
  return `
  query ProductBySlug($slug: String!) {
    productPage(url: $slug) {
       id
       url
       updateDate
       contentTypeAlias
       name
       __typename
       productDescription
       productFeature
       images{
           url
           media{
            name
            updateDate
            mediaTypeAlias
            ... on Image{altText}
            }
       }
       productName
       productPhoto
       {
           url
           media{
            name
            updateDate
            mediaTypeAlias
            ... on Image{altText}
            }
       }
       productVideos{
           url
       }
       showStandardProductBody
       features{
            content{
                __typename
                contentTypeAlias
                ... on HeadingImageRichTextCOMP{
                    contentTypeAlias
                    heading
                    image{
                        url
                        media{
                            name
                            updateDate
                            mediaTypeAlias
                            ... on Image{altText}
                            }
                    }
                    description
                }
            }
        }


       specifications{
           content{
               __typename
               contentTypeAlias
               ... on ProductSpecificationTableEntryCOMP{
                   category
                   title
                   value
               }
           }
       }
       turnOnAdvancedProductSpecificationTable
       rows
       {
            content{
                     __typename
                       contentTypeAlias
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


        imageSectionContent{
            content{
                __typename
                contentTypeAlias
                ... on HeadingTextComponentCOMP{
                    heading
                    text
                }
                ... on ImageAndHeadingComponentCOMP{
                    heading
                    image
                    {
                        url
                        media{
                            name
                            updateDate
                            mediaTypeAlias
                            ... on Image{altText}
                            }
                    }
                }
            }
        }
        warranty
        frequentlyAskedQuestions
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
                            name
                            updateDate
                            mediaTypeAlias
                            ... on Image{altText}
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
  `
};

export function variables(pageIdentifier:PageIdentifier, languageSite:LanguageSite) {
  let variables = variablesMultiSiteByIdentifier(pageIdentifier, languageSite);
  log.debug("variables heartcore productDetails > ", variables);
  return variables;
}

export default function GetModelQuery() {
  return productDetails;
}

export function mapProductData(data, pageIdentifier: PageIdentifier, languageSite: LanguageSite, sortOrder: number) {
  log.trace("variables heartcore mapProductData > ", JSON.stringify(data));
  return data?.productPage;
}