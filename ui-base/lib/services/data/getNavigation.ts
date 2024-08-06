import { cache } from 'react'
import 'server-only'
import { GetLanguageSiteByCode } from '../../cms/heartcore/tools/urlTools'
import { GetPageIdentifier } from '../cmsContextService'
import { getNavItems } from './pageLayoutDataCollector'
import { CountryCode } from '../../cms/constants'
 
export const preload = (countryCode: string) => {
  void getNavigation(countryCode)
}
 
export const getNavigation = cache(async (countryCode: string) => {
    const languageSite =  await GetLanguageSiteByCode(countryCode as CountryCode);
    const pageIdentifier = await GetPageIdentifier("home");
    const navItems = await getNavItems(pageIdentifier, languageSite);
    return navItems;
})