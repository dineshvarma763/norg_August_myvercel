
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier";
import { variablesById } from "@/ui-base/lib/cms/_base/tools/common/multiSite";
import { processNavItem } from "@/ui-base/lib/cms/heartcore/graphql/navigation/navigation";

export function navigationChildren(pageIdentifier:PageIdentifier)
{
  return `
  query GetNavigationChildrenById($id: ID!) {
    content(id: $id) {
          name
          id
          updateDate
          children{
            items{
              name
              id
              level
              url
              sortOrder
              updateDate
              ... on Homepage {
                prefetch
                superAlias
                showInNavigation
                updateDate
              }
              ... on SubComponentsPage {
                prefetch
                superAlias
                showInNavigation
                updateDate
                externalLink{
                    target
                    url
                }
              }
              ... on ProductPage {
                prefetch
                superAlias
                showInNavigation
                updateDate
                externalLink{
                    target
                    url
                }
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
              }
            }
          }
    }
}
 `
};

export default function GetNavQuery() {
  return navigationChildren;
}

export function variables(id: string, languageSite:LanguageSite)
{
  return variablesById(id); 
};

export async function mapNavigationData(data : any, pageIdentifier:PageIdentifier, languageSite:LanguageSite) {
  
  let mappedNav = [];

  if(data?.content?.children?.items?.length > 0){
    mappedNav = data.content.children.items.map((x) => {    
      return processNavItem(x, languageSite);
    });
  }

  mappedNav = mappedNav.filter((x:any) => !(x.name.indexOf('_') > -1));

  return mappedNav;
}