import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite";
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier";
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig";
import { variablesMultiSiteByIdentifier } from "../../../_base/tools/common/multiSite";

const log = getLogger("headless.graphql.heartcore.seo.seo");

export function seo(pageIdentifier:PageIdentifier)
{
  
  let query= `
  query PageBySlug($slug: String!) {
    ${pageIdentifier.cmsType}(url: $slug) {
      name
      id
      slug:url
      contentTypeAlias        
      sEOTitle   
      sEODescription     
      ogDescription
      updateDate
      ogImage{
          url
      }    
      canonicalURLAbsolute
      canonicalURLContentItem{
          url
      }
      structuredData
      noIndexPage
      alternateMultiURLs
      {
        url
        name
        target
        type
        udi
      }
    }
  }`
  return query;
};

export function variables(pageIdentifier: PageIdentifier, languageSite:LanguageSite)
{
  const variables = variablesMultiSiteByIdentifier(pageIdentifier, languageSite);
  log.trace("heartcore seo variables", variables);
  return variables;
};

export default function GetSeoQuery() {
  return seo;
}

export function mapSeoData(data, pageIdentifier:PageIdentifier, languageSite:LanguageSite) {
  log.trace("heartcore mapSeoData", JSON.stringify(data));
  const result = data[pageIdentifier.cmsType];
  const seoResult = {  
    name: result?.name,
    seoTitle: result?.sEOTitle, 
    seoDescription: result?.sEODescription,
    ogDescription: result?.ogDescription,
    ogImage: result?.ogImage,
    canonicalURLAbsolute: result?.canonicalURLAbsolute,
    canonicalURLContentItem: result?.canonicalURLContentItem,
    structuredData: result?.structuredData,
    noIndexPage: result?.noIndexPage,
    alternateMultiURLs:result?.alternateMultiURLs
  };
  return seoResult;
}