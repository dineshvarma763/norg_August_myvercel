import { GetCMS } from "@/ui-base/lib/services/cmsContextService";
import { GetHomepageVariant, GetMultiSiteSlugByIdentifier } from "../../../heartcore/tools/urlTools";
import { sanitiseForKontent } from "../cms/kontent/kontentTools";
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier";
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite";



export function variablesNavigationBase(pageIdentifier: PageIdentifier, languageSite:LanguageSite)
{
  // Regadless of the page type, we always want to get the homepage for navigation purposes
  let result;
  if(pageIdentifier.cmsType === 'homepage')
  {
    result = {'slug': GetMultiSiteSlugByIdentifier(pageIdentifier, languageSite)};
  }else {
    result = {'slug': GetMultiSiteSlugByIdentifier(GetHomepageVariant(), languageSite)}; // Get the homepage (not the current page
  }  
  if(GetCMS() == "kontent"){
    result = sanitiseForKontent(result);
  }
  return result;
};

export function variablesById(id: string)
{
  let result = {'id': id};
  return result;
};

