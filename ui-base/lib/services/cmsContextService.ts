import { CmsVariant, CmsVariants } from "../cms/constants";
import { LanguageSite } from "../interfaces/LanguageSite";
import { PageIdentifier } from "../interfaces/PageIdentifier";
import { browserUrlToCmsUrlConverter } from "./data/pageDataProvider";
import { GetLanguageSiteByURL } from "./languageService";
import { getLogger } from "./logging/LogConfig";
import { getPageTypeBySlug } from "./model/getPageTypeBySlug";
import { GetSite } from "./siteContextService";

const log = getLogger("headless.cmsContextService");

export function GetCMS(){
    const cmsVariant = process.env.NEXT_PUBLIC_CMS_VARIANT as CmsVariant;
    return cmsVariant;
}

export function GetCMSVariant(){
    return CmsVariants.variants[GetCMS()];
}

export async function GetPageIdentifier(pageVariant: string): Promise<PageIdentifier | null> {
    try {
        const CMSVariant = await GetCMSVariant();

        if (!CMSVariant || !CMSVariant.pageTypes) {
            log.debug('Invalid CMS Variant or no pageTypes found');
            return null;
        }

        const pageIdentifier = CMSVariant.pageTypes[pageVariant] as PageIdentifier;

        if (!pageIdentifier) {
            log.debug(`GetPageIdentifier > pageIdentifier not found for variant: ${pageVariant}`);
            const site = await GetSite();

            if (!site || !site.siteSettings || !site.siteSettings.extraPageTypes) {
                log.debug('Invalid site or settings, or no extraPageTypes found');
                return null;
            }

            const matches = site.siteSettings.extraPageTypes.filter((x) => x.pageVariant === pageVariant);
            if(matches.length > 0){
                // console.log(`Match found in extraPageTypes for variant: ${pageVariant}`);
                return matches[0] as PageIdentifier;
            } else {
                // console.log(`No match found in extraPageTypes for variant: ${pageVariant}`);
                return null;
            }
	}

        // console.log(`GetPageIdentifier > pageIdentifier: ${JSON.stringify(pageIdentifier)} for variant: ${pageVariant}`);

        // Returns a deep copy of pageIdentifier using JSON parse/stringify to avoid mutation
	return JSON.parse(JSON.stringify(pageIdentifier));
    } catch (error) {
        log.error(`An error occurred: ${error.message}`);
        return null;
    }
}

export async function getPageIdentifierBySlug(slug: any) {

    let { cmsUrl, languageSite }: { cmsUrl: any; languageSite: LanguageSite; } = await browserUrlToCmsUrlConverter(slug);

    // subComponentPage, ProductPag, etc
    var resultPage = await getPageTypeBySlug(cmsUrl, languageSite);

    const pageIdentifier = await GetPageIdentifier(resultPage?.contentTypeAlias);
    
    if(cmsUrl === undefined){
        log.error("getPageIdentifierBySlug > cmsUrl > ", cmsUrl, slug);
    }

    if(!pageIdentifier){
        log.error("getPageIdentifierBySlug > pageIdentifier is null ", cmsUrl, slug);
    }

    if(pageIdentifier && !(pageIdentifier.backEndSlug))
    {
        pageIdentifier.backEndSlug = cmsUrl;
    }    

    return { pageIdentifier, cmsUrl, languageSite };
}