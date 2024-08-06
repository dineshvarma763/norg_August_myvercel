import { GetCMS } from "@/ui-base/lib/services/cmsContextService";
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig";
import { GetSite } from "@/ui-base/lib/services/siteContextService";
import { CmsVariants, CountryCode } from "../../constants";
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier";
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite";

const log = getLogger("headless.hearcore.tools.urlTools");

export function GetMultiSiteSlugByIdentifier(pageIdentifier:PageIdentifier, languageSite:LanguageSite){   
    return processSlug(pageIdentifier.backEndSlug, languageSite);
}

export function GetMultiSiteSlug(slug:string, languageSite:LanguageSite){
    return processSlug(slug, languageSite);
}

export async function GetLanguageSiteByCode(code:CountryCode):Promise<LanguageSite>{
    const cmsVariant = GetCMS();
    const match = (await GetSite()).siteSettings.languageSites.filter((x) => x.countryCode === code);
    if(match.length > 0){
        return match[0] as LanguageSite;
    }
    return undefined;
}

export async function GetMainSiteLanguage():Promise<CountryCode>{
    const cmsVariant = GetCMS();
    return (await GetSite()).siteSettings.mainSiteLanguage as CountryCode;
}

export function GetHomepageVariant():PageIdentifier{
    const cmsVariant = GetCMS();
    const cmsVariantSelected = CmsVariants.variants[cmsVariant];
    const pageIdentifier = cmsVariantSelected.pageTypes[
      "home"
    ] as PageIdentifier;
    return pageIdentifier;
}

function processSlug(slug: string, languageSite:LanguageSite) {
    const prefix = languageSite.homepageSlugPrefix;
    let originalSlug = slug;
    //console.log("process ----------", slug, originalSlug, prefix);
    slug = prefix + "/" + slug;
    slug = slug.replace(/\/+/g, '/');

    // If the prefix is not empty, and the slug is equal to languageSite control slug, then we are on the country homepage
    if(prefix && prefix != "" && originalSlug == languageSite.countryCode){
        slug = prefix;
        //console.log("process 1 ----------", slug, originalSlug, prefix);
    } else if(prefix && prefix != "" && originalSlug !== languageSite.countryCode){ // We are on a sub page.  
        //console.log("process 2 ---------- before", slug, originalSlug, prefix);
        if(slug.startsWith(prefix+prefix))
        {    
            //console.log("scenario one");
            slug = slug.replace(prefix+prefix, prefix); // Example. Before: /au-homepage/au-homepage/for-home-owners/sectional-door-openers/tempo ->  After: /au-homepage/for-home-owners/sectional-door-openers/tempo
        }else {
            slug = slug.replace(prefix+'/'+languageSite.countryCode, prefix); // Example. Before: /au-homepage/au/search ->  After: /au-homepage/search
        }
        //console.log("process ---------- after", slug);
    }
    
    if(GetCMS() == "heartcore" && typeof(languageSite?.specialSlugPrefix) != "undefined"){
        //console.log("heartcore only ----- ", slug); 
        slug = `${languageSite?.specialSlugPrefix}/${slug}`;
    }

    slug = slug.replace(/\/+/g, '/');
    return slug;
}

  export function isGuid(value) {
    const guidRegexWithHyphens = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const guidRegexWithoutHyphens = /^[0-9a-f]{32}$/i;
    return guidRegexWithHyphens.test(value) || guidRegexWithoutHyphens.test(value);
}

export function stripPTags(input: string): string {
    return input.replace(/<p>|<\/p>/g, '');
}