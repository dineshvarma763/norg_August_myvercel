import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite";
import { variablesMultiSiteSlug } from "../../../_base/tools/common/multiSite";
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier";

export function subComponentContent() {
  return `
  query GetPageByLongSlug($slug: String!) {
      pageCollection(where: { urlPath : $slug }, limit: 1) {
          items{   
              __typename         
              ... on Page{
                  seoTitle
              }
          }
      }
  }`
}

export function variables(urlPath: string, languageSite:LanguageSite) {
  return variablesMultiSiteSlug(urlPath, languageSite);
}

export default function GetSubComponentContentQuery() {
  return subComponentContent
}

export function mapSubComponentContentData(data: any, pageIdentifier:PageIdentifier, languageSite:LanguageSite) {
 return data?.pageCollection?.items[0];
}
