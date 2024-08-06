import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite";
import { variablesMultiSiteSlug } from "../../../_base/tools/common/multiSite";
import { mapBreadcrumbStructure } from "../../tools/urlTools";
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier";

export function breadcrumb()
{
  return `     
    query ParentPageTypeBySlug($slug: String!) {
      pageCollection(where: { urlPath : $slug }, limit: 1) {
          items{   
              __typename     
              updateDate    
              ... on Page{
                  navigationTitle
                  urlPath
                  updateDate
                  parent{
                      ... on Page{
                          navigationTitle
                          urlPath
                          updateDate
                          parent{
                              ... on Page{
                                  navigationTitle
                                  urlPath
                                  updateDate
                                  parent{
                                      ... on Page{
                                          navigationTitle
                                          urlPath     
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
  `
};

// export function variables(urlPath:string)
// {
//   const result = {'urlPath': `/${urlPath}`};
//   return result;
// };

export function variables(urlPath: string, languageSite: LanguageSite) {
  return variablesMultiSiteSlug(urlPath, languageSite);
};

export default function GetBreadcrumbQuery() {
  return breadcrumb;
}

export function mapBreadcrumbData(data, pageIdentifier:PageIdentifier, languageSite:LanguageSite) {
    
  return mapBreadcrumbStructure(data.pageCollection.items[0]);

  // let nodes = [];

  // addNode();

  // const breadcrumb = {
  //   heading: "Breadcrumb : Default",
  //   links: []
  // };

  
  // function addNode(content) {
  //   nodes.push(cleanupSingleLevel(content));
  //   if (content.parent) {
  //     addNode(content.parent);
  //   }
  // }
    
  // for(var i=nodes.length-1; i>-1; i--){
  //   let current = nodes[i];
  //   let link = current.urlPath;
  //   breadcrumb.links.push({
  //     href: link,
  //     text: current.name
  //   });
  // }

  // return breadcrumb;
}

// export function cleanupSingleLevel(data) {  
//   data.name = data.navigationTitle;
//   data.slug = data.urlPath;
//   return data;
// }