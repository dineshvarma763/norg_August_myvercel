import { LanguageSite } from "../interfaces/LanguageSite";
import { getLogger } from "./logging/LogConfig";

const log = getLogger("headless.services.components.urlService");

export function processURLForNavigation(url: string, languageSite: LanguageSite) {
    if (url?.startsWith('http'))
	return url;
    url = stripSiteLanguagePrefix(url, languageSite);
    
    if (languageSite?.specialSlugPrefix) {
        const valueToRemove = languageSite.specialSlugPrefix.replace(/\/+/g, '');
        log.debug("languageSite.specialSlugPrefix value", valueToRemove, url);
        url = url.replace(valueToRemove, '');
    }

    if (languageSite?.shouldLanguageCodeBeAddedToNav) {
        url = `/${languageSite.countryCode}${url}`;
    }
    return url;
}

export function stripSiteLanguagePrefix(url: string, languageSite: LanguageSite) {

    if(!languageSite || !url){
        return url;
    }

    url = url.replace(languageSite.homepageSlugPrefix, '');
    url = url.replace("/"+languageSite.countryCode, '');
    
    return url;
}