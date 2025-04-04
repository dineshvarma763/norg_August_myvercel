import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite";
import { variablesMultiSiteSlug } from "../../../_base/tools/common/multiSite";
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier";

export function subComponentContent() {
  return `
  query GetSubComponentContent($slug: String!) {
      navigationItem_All(where: { _seo : { urlPath : {eq : $slug }} }, limit: 1){
          items{
              ... on NavigationItem{
                  content{
                      __typename
                  }
              }            
              _system_{
                  id
                  type{
                      _system_{
                          codename
                          name
                      }
                  }
              }
              label
              _seo{
                  urlPath
              }            
          }
      }
  }
  
  `
}

export function variables(urlPath: string, languageSite:LanguageSite) {
  return variablesMultiSiteSlug(urlPath, languageSite);
}

export default function GetSubComponentContentQuery() {
  return subComponentContent
}

export function mapSubComponentContentData(data, pageIdentifier:PageIdentifier, languageSite:LanguageSite) {
  if(data?.navigationItem_All?.items[0]?.content){
    return data?.navigationItem_All?.items[0]?.content;
  }else {
    return {};
  }
}
