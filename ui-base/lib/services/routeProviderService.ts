import { LanguageSite } from "../interfaces/LanguageSite";
import { getLogger } from "./logging/LogConfig";
import { collectSitemapNavigationStructure } from "./data/collectSitemapNavigationStructure";

const log = getLogger("headless.services.components.routeProviderService");

export async function collectAllRoutes(languageSite:LanguageSite) {
      
  const data = await collectSitemapNavigationStructure(languageSite);  
  let paths = [];
  data.map((page) => {
    if(page.superAlias && page.superAlias != '')
    {
      let parts = page.superAlias.split('/');   
      parts = parts.filter((x) => x != '');
      paths.push({slug: parts });
    }else {
      if(page.url){
        let parts = page.url.split('/');    
        parts = parts.filter((x) => x != '');
        if(parts.length > 0){
          if(parts[0] !== 'global-settings'){   
            paths.push({slug: parts });
          }
        }
      }
    }
  });  
  
    log.trace("collectAllRoutes > paths > ", paths);  
  
    paths = await filterOutDataOrComponentFolders(paths);

    log.trace("collectAllRoutes > paths > after filtering ", paths);

    return paths;
  }

  export async function filterOutDataOrComponentFolders(paths) {
      // Remove empty slugs as they conflict with the homepage. Also remove any _data folders, as the are not renderable pages
      paths = paths.filter((x) => {
        if(x.slug.length > 0){
          const slugLength = x.slug.length;
          if(slugLength > 0){
            log.trace("collectAllRoutes > paths > slugLength > ", slugLength, x.slug);
            // check is the slug array has an entry that starts with an underscore
            const containsUnderscores = x.slug.some((slug) => slug.startsWith('_'));
            if(containsUnderscores){
              return false;
            } else {
              return true;
            }
          }
        } 
      }
    );
    return paths;
  }
  