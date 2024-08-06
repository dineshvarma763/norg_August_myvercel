import { getLogger } from "@/ui-base/lib/services/logging/LogConfig";
import { processURLForNavigation } from "@/ui-base/lib/services/urlService";
import { variablesNavigationBase } from "../../../_base/tools/navigation/navigation";
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier";
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite";

const log = getLogger("headless.navigation");

export function navigation(pageIdentifier:PageIdentifier)
{
  return `
  query NavigationByParent($slug: String!) {
    homepage(url: $slug) {
          name
          id
          updateDate
          children{
            items{
              name
              id
              level
              url
              updateDate
              ... on Homepage {
                prefetch
                superAlias
                showInNavigation
                showAsButton
                updateDate
              }
              ... on SubComponentsPage {
                prefetch
                superAlias
                showInNavigation
                showAsButton
                updateDate
                externalLink{
                    target
                    url
                }
              }
                            
              ... on ProductPage{
                prefetch
                superAlias
                showInNavigation
                showAsButton
                updateDate
                externalLink{
                    target
                    url
                }
              } 
            }
          }
    }
}
 `
};

export default function GetNavQuery() {
  return navigation;
}

export function variables(pageIdentifier: PageIdentifier, languageSite:LanguageSite)
{
  return variablesNavigationBase(pageIdentifier, languageSite); 
};

export function mapNavigationData(data : any, pageIdentifier:PageIdentifier, languageSite:LanguageSite) {
  
  let mappedNav = [];

  let filteredChildren = data?.homepage?.children?.items?.filter((x) => !(x.name.indexOf('_') > -1));

  if(filteredChildren?.length > 0){
    mappedNav = filteredChildren?.map((x) => {          
      return processNavItem(x, languageSite);
    });
  }

  mappedNav = mappedNav.filter((x) => !(x.name.indexOf('_') > -1));

  return mappedNav;
}

export function processNavItem(x: any, languageSite: LanguageSite) {
  x.name = x.name.replace('/', '');
  x.slug = x.name;
  x.target = "_self";
  if(x.superAlias && x.superAlias !== ''){
    x.url = x.superAlias;
  }else if (x.externalLink){
    x.url = x.externalLink?.url;
    x.target = x.externalLink?.target;
  }else {
      x.url = processURLForNavigation(x.url, languageSite);
  }
  return x;
}
