import { LanguageSite } from "../interfaces/LanguageSite";
import { getLogger } from "./logging/LogConfig";
import { stripSiteLanguagePrefix } from './urlService';
import { GetDataLocation } from "./components/pageComponentDataLocationService";
import { getDynamicCmsDataViaCmsSelector as getDynamicCmsDataViaCmsSelector } from "./data/graphqlDataService";

const log = getLogger("headless.services.components.urlService");

// Please Read: https://expiadev.atlassian.net/wiki/spaces/HP/pages/3692363790/Language+Sites+and+URL+Construction
// This function accepts the CMS URL unprocessed.
export async function processURLForNavigationServer(url: string, languageSite: LanguageSite, processRichText: boolean = false) {

    // Do not process external links
    if (url.startsWith('http') || url.startsWith('tel'))
	return url;
    url = stripSiteLanguagePrefix(url, languageSite);

    if (languageSite?.specialSlugPrefix) {
        const valueToRemove = languageSite.specialSlugPrefix.replace(/\/+/g, '');
        log.debug("languageSite.specialSlugPrefix value", valueToRemove, url);
        url = url.replace(valueToRemove, '');
    }

    if (languageSite?.shouldLanguageCodeBeAddedToNav && !url.startsWith("/" + languageSite.countryCode)) {
        url = `/${languageSite.countryCode}${url}`;
    }

  if (processRichText) {
    // replace _component with #
    url = url.replace(/\/_components\//, "#");
    // Remove trailing slash
    url = url.replace(/\/$/, "");
  }
  const aliasResult = await findAliasMatch(url, languageSite);

  if(aliasResult){
    url = aliasResult;
  }
  return url;
}

export async function findAliasMatch(url: string, languageSite: LanguageSite) {

    const location = await GetDataLocation("alias");
    let aliasResult =
      await getDynamicCmsDataViaCmsSelector(
        location.componentLocation,
        undefined,
        url, // Slug is undefined, as we are doing the lookup based on page type
        languageSite,
        location.isSiteComponent,
        undefined,
        true
      );
  
      const alias = aliasResult.result || undefined;
    
    return alias;
}