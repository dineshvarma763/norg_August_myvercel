import { CmsVariants } from "../../cms/constants";
import { LanguageSite } from "../../interfaces/LanguageSite";
import { GetCMS } from "../cmsContextService";
import { GetDataLocation } from "../components/pageComponentDataLocationService";
import { getDynamicCmsDataViaCmsSelector } from "./graphqlDataService";


export async function collectSitemapNavigationStructure(languageSite: LanguageSite | null) {

  const cmsVariant = GetCMS();
  const cmsVariantSelected = CmsVariants.variants[cmsVariant];
  const location = await GetDataLocation("sitemap");
  const navItems = await getDynamicCmsDataViaCmsSelector(
    location.componentLocation,
    undefined,
    undefined,
    languageSite,
    location.isSiteComponent
  );

  return navItems.result || [];
}

export async function collectSitemapNavigationSiteStructure(languageSite: LanguageSite | null) {

  const cmsVariant = GetCMS();
  const cmsVariantSelected = CmsVariants.variants[cmsVariant];
  const location = await GetDataLocation("sitemapClient");
  const navItems = await getDynamicCmsDataViaCmsSelector(
    location.componentLocation,
    undefined,
    undefined,
    languageSite,
    location.isSiteComponent
  );

  return navItems.result || [];
}