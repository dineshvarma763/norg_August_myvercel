import { NorgFixedLayouts, NorgSiteComponentDataLocations, NorgSiteSettings } from "@/sites/norg-website/NorgSiteConstants";
// import { MultiSiteConstants, MultiSiteFixedLayouts, MultisiteSiteSettings } from "@/sites/multisite/MultiSiteConstants";
// import { ShowcaseFixedLayouts, ShowcaseSiteComponentDataLocations, ShowcaseSiteSettings } from "@/sites/showcase/ShowcaseSiteConstants";
import { BaseSiteConfig } from "@/ui-base/config/site";
import { SiteConstants } from "../cms/SiteConstants";

export function GetSite(){
    // if(process.env.NEXT_PUBLIC_SITE_NAME == "multisite"){
    //     return new SiteConstants("multisite", MultiSiteFixedLayouts, MultiSiteConstants, MultisiteSiteSettings);
    // }else
    if(process.env.NEXT_PUBLIC_SITE_NAME == "norg-website"){
        return new SiteConstants("norg-website", NorgFixedLayouts, NorgSiteComponentDataLocations, NorgSiteSettings);
    }
    // else if(process.env.NEXT_PUBLIC_SITE_NAME == "showcase"){
    //     return new SiteConstants("showcase", ShowcaseFixedLayouts, ShowcaseSiteComponentDataLocations, ShowcaseSiteSettings);
    // }
    return new SiteConstants("norg-website", NorgFixedLayouts, NorgSiteComponentDataLocations, NorgSiteSettings);
}

export async function GetSiteConfig(): Promise<BaseSiteConfig> {
  const site = await GetSite();
  return site.getSiteSettings().siteConfig;
}
