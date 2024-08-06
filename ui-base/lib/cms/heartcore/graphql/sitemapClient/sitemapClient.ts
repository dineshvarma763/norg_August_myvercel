import { getLogger } from "@/ui-base/lib/services/logging/LogConfig";
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier";
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite";
import { processURLForNavigation } from "@/ui-base/lib/services/urlService";
import { GetLanguageSiteByURL } from "@/ui-base/lib/services/languageService";

const log = getLogger("headless.graphql.heartcore.common.multiSite");

const sitemapClient = `
query {
  allContent(where: {    
    AND:[{level_any:[1,2]}]    
      OR: [
          { contentTypeAlias_ends_with: "Page" },
          { contentTypeAlias_ends_with: "page" }           
      ]
  })
   {
     edges{
         node {
             id
             level
             name
             url
             parent{
                 id
             }
             sortOrder
             updateDate
                   ... on Homepage{
             showInSitemap
             showInNavigation
             superAlias
             updateDate
           } 
            ... on ProductPage{
             showInSitemap
             showInNavigation
             superAlias
             updateDate
           } 
           ... on SubComponentsPage{
             showInSitemap
             showInNavigation
             superAlias
             updateDate
           } 
      children(where: {
           AND:[{level_any:[3,4,5,6,7,8,9,10]}] 
      OR: [
          { contentTypeAlias_ends_with: "Page" },
          { contentTypeAlias_ends_with: "page" }
      ]
  }){
      edges{
              node {
             id
             level
             name
             url
             parent{
                 id
             }
             sortOrder
             updateDate
                   ... on Homepage{
             showInSitemap
             showInNavigation
             superAlias
             updateDate
           } 
            ... on ProductPage{
             showInSitemap
             showInNavigation
             superAlias
             updateDate
           } 
           ... on SubComponentsPage{
             showInSitemap
             showInNavigation
             superAlias
             updateDate
           } 
      children(where: {
           AND:[{level_any:[3,4,5,6,7,8,9,10]}] 
      OR: [
          { contentTypeAlias_ends_with: "Page" },
          { contentTypeAlias_ends_with: "page" }
      ]
  }){
      edges{
               node {
             id
             level
             name
             url
             parent{
                 id
             }
             sortOrder
             updateDate
                   ... on Homepage{
             showInSitemap
             showInNavigation
             superAlias
             updateDate
           } 
            ... on ProductPage{
             showInSitemap
             showInNavigation
             superAlias
             updateDate
           } 
           ... on SubComponentsPage{
             showInSitemap
             showInNavigation
             superAlias
             updateDate
           } 
      children(where: {
           AND:[{level_any:[3,4,5,6,7,8,9,10]}] 
      OR: [
          { contentTypeAlias_ends_with: "Page" },
          { contentTypeAlias_ends_with: "page" }
      ]
  }){
      edges{
                node {
             id
             level
             name
             url
             parent{
                 id
             }
             sortOrder
             updateDate
                   ... on Homepage{
             showInSitemap
             showInNavigation
             superAlias
             updateDate
           } 
            ... on ProductPage{
             showInSitemap
             showInNavigation
             superAlias
             updateDate
           } 
           ... on SubComponentsPage{
             showInSitemap
             showInNavigation
             superAlias
             updateDate
           } 
      children(where: {
           AND:[{level_any:[3,4,5,6,7,8,9,10]}] 
      OR: [
          { contentTypeAlias_ends_with: "Page" },
          { contentTypeAlias_ends_with: "page" }
      ]
  }){
      edges{
              node
              {
                  name
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
           }
  }
         }
     }
  }
}
`;

export {sitemapClient};

export default function GetSitemapClientQuery() {
  return sitemapClient;
}

export function mapSitemapClientData(data : any, pageIdentifier:PageIdentifier, languageSite:LanguageSite) {
  let nodes = data.allContent.edges.map((x) => x.node); 
  
  // Filter out the nodes based on matching the language site prefix in the url
  if(typeof(languageSite) !== 'undefined' && languageSite !== null && languageSite.homepageSlugPrefix !== null && languageSite.homepageSlugPrefix !== '')
  {;
    nodes = nodes.filter((x) => x.url.indexOf(languageSite.homepageSlugPrefix) > -1);
  }else {
    log.debug("mapSitemapData > no language set", nodes.length);
  }

  nodes.map(async (x) => {
    const languageSite = await GetLanguageSiteByURL(x.url);

    let beforeFrieldyUrl = x.url;
    if(x.superAlias && x.superAlias !== ''){
      beforeFrieldyUrl = x.superAlias;
    }
    
    const friendlyUrl = processURLForNavigation(beforeFrieldyUrl, languageSite);
    x.name = x.name.replace('/', '');
    x.slug = x.url; // The slug is the unprocessed URL with 'us-homepage' at the start
    x.url = friendlyUrl; // The url is process to remove that
    x.haschildren = x.children.edges.length > 0  ? true : false;  
    x.children = x.children.edges;
    x.parentId = x.parent?.id;    
  });
  nodes = nodes.filter((x) => (!(x.name.indexOf("_") > -1)));
  return nodes;
}