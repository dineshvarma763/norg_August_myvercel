import {
  variablesMultiSiteByIdentifier,
  variablesMultiSiteSlug,
} from "@/ui-base/lib/cms/_base/tools/common/multiSite"
import { processRawUrlsOnServer } from "@/ui-base/lib/cms/heartcore/tools/processRawUrlsOnServer"
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"

const log = getLogger("headless.graphql.heartcore.product.productList")

export function productList(slug: string) {
  return `
  query ProductListingBySlug($slug: String!) {
    subComponentsPage(url: $slug) {
      url
      contentTypeAlias
      name
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
                              ... on ProductList{
                                  useChildren
                              }
                              ... on ProductPage{
                                  id
                                  url
                                  productDescription    
                                  updateDate  
                                  productFeature                  
                                  productPhoto {
                                      url
                                      media{
                                        name
                                        updateDate
                                        mediaTypeAlias
                                        ... on Image{altText}
                                        }
                                  }
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
                                                    mediaTypeAlias
                                                    updateDate
                                                    ... on Image{altText}
                                                    }
                                              }
                                              description
                                          }
                                      }
                                  }



                              }
                          }
                      }
                  }
                  ... on ProductPage{
                      id
                      url
                      productDescription       
                      productFeature  
                      updateDate
                      productPhoto {
                          url
                          media{
                            name
                            updateDate
                            mediaTypeAlias
                            ... on Image{altText}
                            }
                      }
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
  let variables = {}

  if (typeof pageIdentifierOrSlug === "string") {
    variables = variablesMultiSiteSlug(pageIdentifierOrSlug, languageSite)
  } else {
    variables = variablesMultiSiteByIdentifier(
      pageIdentifierOrSlug,
      languageSite
    )
  }

  log.debug("variables heartcore productList > ", variables)
  return variables
}

export default function GetModelQuery() {
  return productList
}

export async function mapProductListData(data, pageIdentifier: PageIdentifier, languageSite: LanguageSite, sortOrder: number) {
  log.debug("variables heartcore mapProductListData > ", JSON.stringify(data));
  const productsData = data?.subComponentsPage?.children?.edges;

  if (productsData) {
    await processRawUrlsOnServer(productsData, languageSite);
  }

  // Perform a deeper search for ProductPage matches
  const products = findProductPages(productsData) || [];

  const resultingProducts = products.map((product:any) => ({
    id: product.id,
    url: product.url,
    name: product.name,
    imageUrl: product?.productPhoto?.url ?? "",
    altText: product?.productPhoto?.media?.altText != "" ?  product?.productPhoto?.media?.altText :  product?.productPhoto?.media?.name != "" ?  product?.productPhoto?.media?.name : product.name,
    description: product.productDescription || "",
    feature: product.productFeature || "",    
    features: product?.features?.map((feature) => feature?.content) || []
  }));
  return resultingProducts;
}


  // Helper function to recursively search for ProductPage nodes
  const findProductPages = (nodes) => {
    let productPages:any = [];

    if(!nodes || nodes.length === 0) return productPages;

    nodes.forEach((item:any) => {
      if (item.node.__typename === "ProductPage") {
        productPages.push(item.node);
      }
      if (item.node.children?.edges) {
        productPages = productPages.concat(findProductPages(item.node.children.edges));
      }
    });
    return productPages;
  };