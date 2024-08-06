import {
  variablesMultiSiteByIdentifier,
  variablesMultiSiteSlug,
} from "@/ui-base/lib/cms/_base/tools/common/multiSite"
import { processRawUrlsOnServer } from "@/ui-base/lib/cms/heartcore/tools/processRawUrlsOnServer"
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"

const log = getLogger("headless.graphql.heartcore.product.productCategoryList")

export function productCategoryList(slug: string) {
  return `
  query ProductCategoryListingBySlug($slug: String!) {
    subComponentsPage(url: $slug) {
       url
       contentTypeAlias
       name
       ogDescription
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
                               ... on ProductCategoryList{
                                   contentTypeAlias
                                   variant
                                   productCategories{
                                       id
                                       level
                                       url
                                       name
                                       updateDate
                                       children{
                                           edges{
                                               node
                                               {
                                                   __typename
                                                   updateDate
                                                   ... on ProductPage{
                                                       name
                                                       url
                                                       updateDate
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
                                                       productName
                                                       productDescription
                                                       productFeature
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
  let variables = {}

  if (typeof pageIdentifierOrSlug === "string") {
    variables = variablesMultiSiteSlug(pageIdentifierOrSlug, languageSite)
  } else {
    variables = variablesMultiSiteByIdentifier(
      pageIdentifierOrSlug,
      languageSite
    )
  }

  log.trace("variables heartcore productCategoryList > ", variables)
  return variables
}

export default function GetModelQuery() {
  return productCategoryList;
}

export async function mapProductCategoryListData(data, pageIdentifier: PageIdentifier, languageSite: LanguageSite, sortOrder: number) {
  log.trace("variables heartcore mapProductCategoryListData > ", JSON.stringify(data))
  const edges = data.subComponentsPage.children.edges;

  if (edges) {
    await processRawUrlsOnServer(edges, languageSite);
  } 
  
  for (const edge of edges) {
    const childrenEdges = edge.node.children.edges;

    for (const childEdge of childrenEdges) {
      if (childEdge.node.__typename === "ProductCategoryList") {
        const result = childEdge.node;
        result.category = {name: data.subComponentsPage.name, url: data.subComponentsPage.url, description: data.subComponentsPage.ogDescription};
        return childEdge.node;
      }
    }
  }

  return null;
}