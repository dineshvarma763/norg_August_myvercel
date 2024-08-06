import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier";
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite";
import { variablesById } from "../../../_base/tools/navigation/navigation";
import { processNavItem } from "../navigation/navigation";

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
                superAlias
                showInNavigation
                updateDate
              }
              ... on SubComponentsPage {
                superAlias
                showInNavigation
                updateDate
                externalLink{
                    target
                    url
                }
              }
              ... on ProductPage {
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
                      updateDate
                      name
                      mediaTypeAlias
                      ... on Image
                      {
                        updateDate
                        altText
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

export default function GetNavQuery() {
  return navigationChildren;
}

export function variables(id: string, languageSite:LanguageSite)
{
  return variablesById(id); 
};

export function mapNavigationData(data : any, pageIdentifier:PageIdentifier, languageSite:LanguageSite) {
  
  let mappedNav = [];

  if(data?.content?.children?.items?.length > 0){
    mappedNav = data.content.children.items.map((x) => {    
      return processNavItem(x, languageSite);
    });
  }

  mappedNav = mappedNav.filter((x) => !(x.name.indexOf('_') > -1));

  return mappedNav;
}