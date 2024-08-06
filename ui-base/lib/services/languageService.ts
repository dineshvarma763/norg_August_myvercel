import { GetLanguageSiteByCode, GetMainSiteLanguage } from "../cms/heartcore/tools/urlTools";
import { LanguageSite } from "../interfaces/LanguageSite";
import { getLogger } from "./logging/LogConfig";
import { GetSite } from "./siteContextService";

const log = getLogger("headless.services.languageService");

// Please Read: https://expiadev.atlassian.net/wiki/spaces/HP/pages/3692363790/Language+Sites+and+URL+Construction
// This function processes slugs that come directly from the CMS to identify a path. 
// For instance in an Umbraco language site setup, the slug will be prefixed with the language site prefix:
// example:  
//          /us-homepage/for-home-owners/rolling-door-operators/dominator-easyroller-14/
//          /au-homepage/remotes-accessories/remotes-keypads/securacode/
// The function detects the prefix being used and will return the LanguageSite object that matches the prefix.
export async function GetLanguageSiteByURL(cmsSlug:string):Promise<LanguageSite>{

    if(!cmsSlug){
      return await GetLanguageSiteByCode(await GetMainSiteLanguage());
    }

    let languageSite;
    log.trace('GetLanguageSiteByURL cmsSlug', cmsSlug);
    let languages = (await GetSite()).siteSettings.languageSites;
    if(languages.findIndex(x => cmsSlug.startsWith(x.countryCode) || cmsSlug.startsWith('/'+x.countryCode)) > -1){
      languageSite = languages.find(x => cmsSlug.startsWith(x.countryCode)  || cmsSlug.startsWith('/'+x.countryCode));
      cmsSlug = cmsSlug.replace(languageSite.homepageSlugPrefix, '/').replace(languageSite.countryCode, '');
    }else {
      languageSite = await GetLanguageSiteByCode(await GetMainSiteLanguage());
    } 

    log.trace('GetLanguageSiteByURL ', languageSite, cmsSlug);
    return languageSite;
}