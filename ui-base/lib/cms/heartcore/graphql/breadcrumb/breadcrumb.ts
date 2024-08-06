import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite";
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier";
import { CmsVariants } from "../../../constants";
import { variablesMultiSiteSlug } from "../../../_base/tools/common/multiSite";
import { GetMultiSiteSlug } from "../../tools/urlTools";
import { processURLForNavigationServer } from "@/ui-base/lib/services/urlServiceServer";

export function breadcrumb()
{
  return `  
  query ParentPageTypeBySlug($slug: String!) {
    content(url: $slug) {
      url
      contentTypeAlias
      name
      updateDate
      ... on SubComponentsPage {
        prefetch
        updateDate
      }
      parent {
        url
        contentTypeAlias
        name
        updateDate
        ... on SubComponentsPage {
          prefetch
          updateDate
        }
        parent {
          url
          contentTypeAlias
          name
          updateDate
          ... on SubComponentsPage {
            prefetch
            updateDate
          }
          parent {
            url
            contentTypeAlias
            name
            updateDate
            ... on SubComponentsPage {
              prefetch
              updateDate
            }
          }
        }
      }
    }
  }
   
  `
};

export function variables(slug:string, languageSite:LanguageSite)
{
  return variablesMultiSiteSlug(slug, languageSite);
};

export default function GetBreadcrumbQuery() {
  return breadcrumb;
}

export async function mapBreadcrumbData(data, pageIdentifier: PageIdentifier, languageSite: LanguageSite, sortOrder: number) {
    
  return await mapBreadcrumbStructure(data.content, languageSite);
}

export async function mapBreadcrumbStructure(data, languageSite:LanguageSite) {
    
  let nodes = [];

  addNode(data);

  const breadcrumb = {
    heading: "Breadcrumb : Default",
    links: []
  };
  
  function addNode(content) {
    nodes.push(cleanupName(content));
    if (content.parent) {
      addNode(content.parent);
    }
  }
  for(var i=nodes.length-1; i>-1; i--){
    let current = nodes[i];
    let cmsUrl = current.url;
    const friendlyUrl = await processURLForNavigationServer(cmsUrl, languageSite);
    breadcrumb.links.push({
      href: friendlyUrl,
      text: current.name,
      prefetch: current.prefetch
    });
  }

  return breadcrumb;
}

export function cleanupName(data) {  
  
  if(data.name){
    data.name = data.name.replace('/', '');
  }else if(data.navigationTitle){
    data.name = data.navigationTitle;
  }else if(data.labal){
    data.name = data.labal;
  }

  return data;
}