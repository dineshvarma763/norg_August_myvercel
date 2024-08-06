import { BaseSiteConfig } from "@/ui-base/config/site";
import { CountryCode } from "../cms/constants";
import { LanguageSite } from "./LanguageSite";
import { PageIdentifier } from "./PageIdentifier";
import { EcommerceSettings } from "./EcommerceSettings";
import { PageSettings } from "./PageSettings";


export interface SiteSettings {
  mainSiteLanguage: CountryCode;
  languageSites: LanguageSite[];
  extraPageTypes: PageIdentifier[];
  ecommerceSettings?: EcommerceSettings;
  hideStoreButtons: boolean;
  siteConfig: BaseSiteConfig;
  deepSearchNavigation?: boolean;
  pageSettings?: PageSettings;
}
