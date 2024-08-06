import {
  SUBCOMPONENT_CONTENT,
  PageVariant,
} from "../../cms/constants"
import { GetMainSiteLanguage } from "../../cms/heartcore/tools/urlTools";
import { PageIdentifier } from "../../interfaces/PageIdentifier";
import { LanguageSite } from "../../interfaces/LanguageSite";
import { replaceString } from "../../util/replaceString";
import { GetDataLocation } from "../components/pageComponentDataLocationService";
import { LoadAllSubComponentData } from "../components/pageSubComponentDataService";
import { getDynamicCmsDataViaCmsSelector as getDynamicCmsDataViaCmsSelector } from "./graphqlDataService"
import { getLogger } from "../logging/LogConfig";
import { GetSite, GetSiteConfig } from "../siteContextService";
import { getNavigation } from "./getNavigation";

const log = getLogger("headless.pageLayoutDataCollector");

/*
    The purpose of this function is to gather the required data from the GraphQL layer for a particular page.
    We need to support two page layout types. 
    1) Fixed Layout -   These pages have a pre-determined layout as per a design. The data they try to collect is fixed.
    2) Dynamic Layout - These pages have multiple components as determined by the data passed in. 
                        Usually a single field in the CMS will contain multiple references.  We need to loop over the references and collect all the data for display.


     On top of the page layout types we have common data that all pages will require. 
     We need to support two types of common data. 
     1) Individual Page Data       - This is unique to each page. Each page can have Meta Data, Breadcrumbs, Redirects, Structured DAta.
     2) Global Data          - This is commmon to all pages. Includes Naviation, Footer
*/

export async function collectAllPageData(pageIdentifier: PageIdentifier, pageVariant: PageVariant, slug: string, languageSite: LanguageSite) {
    log.debug(`${slug}  > collectAllPageData > pageIdentifier > ${JSON.stringify(pageIdentifier)} pageVariant ${pageVariant} `);

    const siteSettings = (await GetSite()).getSiteSettings();

    let navItems = await getNavItems(pageIdentifier, languageSite);
  
    log.trace(`${slug}  > collectAllPageData > navItems > ${JSON.stringify(navItems)}`);
   
    let seoItems = await getSeoData(pageIdentifier, languageSite);

    log.trace(`${slug}  > collectAllPageData > seoItems > ${seoItems}`);

    let pageComponentData:any = {};

    if(pageIdentifier.isFixedLayout){
      log.debug(`${slug}  > collectAllPageData > fetching fixed layout data`);
      let fixedLayoutData = await collectFixedLayoutPageComponentData(pageVariant, pageIdentifier, slug, languageSite);
      pageComponentData = {...fixedLayoutData}
    }

    let flexibleComponentData = await collectDynamicLayoutPageComponentData(pageVariant, pageIdentifier, slug, languageSite);

    pageComponentData = {...pageComponentData, ...flexibleComponentData}; // Merge the two objects
    
    log.trace(`${slug} > collectAllPageData > completed lookup`);
    const site = (await GetSite());
    const finalPageData = { 
      navItems, 
      seoItems, 
      pageComponentData, 
      pageVariant, 
      breadcrumbItems: await getBreadcrumbStructures(slug, languageSite),
      footerItems: await getFooterStructures(slug, languageSite),
      stickyNavItems: await getStickNavTopStructures(slug, languageSite),
      siteName : site.name,
      siteSettings: siteSettings,
      languageSite: languageSite,
      slug: slug,
    };

    log.trace(`${slug} > collectAllPageData > finalPageData > ${JSON.stringify(finalPageData)}`);

    return finalPageData;
}

export async function collectFixedLayoutPageComponentData(pageVariant: PageVariant, pageIdentifier: PageIdentifier, slug:string, languageSite: LanguageSite) {
  const pageComponentData: Record<string, unknown> = {};
  log.debug(`${slug}  > collectFixedLayoutPageComponentData`);
  // get the fixed layout for the current page variant
  const layout = (await GetSite()).components.layouts.find(
    (layout) => layout.identifier === pageVariant
  )

  // if no matching layout found, return empty pageComponentData
  if (!layout) {
    log.debug(
      "collectFixedLayoutPageComponentData no matching layout",
      pageVariant
    )
    return pageComponentData
  }

  log.debug(`${slug}  > collectFixedLayoutPageComponentData > About to iterate over layout.components > ${typeof(layout.components)}`);

  // iterate over the components in the layout and add corresponding property to pageComponentData
  for (const component of layout.components) {
    const lowerCaseMatchName = component.toLowerCase();
    const componentLocation = (await GetSite()).componentLocations.find(
      (componentLocation) => componentLocation.identifier.toLowerCase() === lowerCaseMatchName
    )
    log.debug(`${slug}  > collectFixedLayoutPageComponentData > componentLocation > ${JSON.stringify(componentLocation)}`);
    
    if(!componentLocation) continue;

    const componentLocationResult = await getDynamicCmsDataViaCmsSelector(
      componentLocation,
      pageIdentifier,
      undefined,
      languageSite,
      true,
      undefined,
      true
    );

    pageComponentData[lowerCaseMatchName] = componentLocationResult.result;
  }
  log.debug("collectFixedLayoutPageComponentData", pageVariant);
  return pageComponentData;
}

export async function collectDynamicLayoutPageComponentData(pageVariant: PageVariant, pageIdentifier: PageIdentifier, slug, languageSite: LanguageSite) {
  const pageComponentData: Record<string, unknown> = {};
  
  log.debug(`${slug}  > collectDynamicLayoutPageComponentData`);

  let location = await GetDataLocation(SUBCOMPONENT_CONTENT);
	var componentLocationResult;
	try {
		componentLocationResult = await getDynamicCmsDataViaCmsSelector(
    location.componentLocation,
    undefined,
    slug,
    languageSite,
    location.isSiteComponent,
    undefined,
    true
  );
	} catch(err) {
		console.log("Error in getDynamicCmsDataViaCmsSelector : " , err );
		return ;
	}
  pageComponentData[SUBCOMPONENT_CONTENT] = componentLocationResult.result;

  await LoadAllSubComponentData(pageComponentData, SUBCOMPONENT_CONTENT, slug, languageSite);

  log.debug(`${slug}  > collectDynamicLayoutPageComponentData > pageComponentData[SUBCOMPONENT_CONTENT] > ${JSON.stringify(pageComponentData[SUBCOMPONENT_CONTENT])}`);
  
  return pageComponentData;
}

// For each navitem, we need to grab its ID and do a lookup for any children, add the children to the navitem
export async function deepSearchNavigation(navItems: any, languageSite: LanguageSite) {

  //log.trace(`${slug}  > deepSearchNavigation > navItems > navItems.length > ${navItems.length}`);

  for (const navItem of navItems) {

    if(navItem.name.indexOf('_') > -1) continue;

    if (navItem.children) {
      //log.trace(`${slug}  > deepSearchNavigation > navItem.id > ${navItem.id}`);
      await deepSearchNavigation(navItem.children, languageSite);
    } else {
      //log.trace(`${slug}  > deepSearchNavigation > query > ${navItem.id}`);
      let location = await GetDataLocation("navigationChildren");
      //log.trace(`${slug}  > deepSearchNavigation > location > ${JSON.stringify(location)}`);
      await loadChildNavItems(location, navItem, languageSite);
      //log.trace(`${slug}  > deepSearchNavigation > final > ${navItem?.children?.length}`);
    }
  }
}

async function loadChildNavItems(location, navItem, languageSite){

  let childNavItemsResult = await getDynamicCmsDataViaCmsSelector(
    location.componentLocation,
    undefined,
    navItem.id,
    languageSite,
    location.isSiteComponent,
    undefined,
    true
  );

  let childNavItems = childNavItemsResult.result || [];

  childNavItems = childNavItems.filter((x) => !(x.name.indexOf('_') > -1));

  if(childNavItems.length === 0) return;

  await Promise.all(childNavItems.map(childNavItem => loadChildNavItems(location, childNavItem, languageSite)));

  navItem.children = childNavItems;
}


async function getBreadcrumbStructures(slug, languageSite){
  const locationBread = await GetDataLocation("breadcrumb");
  let breadcrumbItems =
  await getDynamicCmsDataViaCmsSelector(
    locationBread.componentLocation,
    undefined, 
    slug,
    languageSite,
    locationBread.isSiteComponent,
    undefined,
    true
  ); 
  
  breadcrumbItems = breadcrumbItems.result || [];

  log.trace(`${slug}  > collectAllPageData > breadcrumbItems > ${JSON.stringify(breadcrumbItems)}`);

  return breadcrumbItems;
}

async function getFooterStructures(slug, languageSite){
  return await getDataStructures("footer", "footerLocation", slug, languageSite);
}

async function getStickNavTopStructures(slug, languageSite){
  return await getDataStructures("stickynavigation", "stickyNavLocation", slug, languageSite);
}

async function getDataStructures(id, locationVariableName, slug, languageSite){
  const location = await GetDataLocation(id);
  let itemSlug = (await GetSiteConfig())[locationVariableName] || slug;
  itemSlug = replaceString(itemSlug, await GetMainSiteLanguage(), languageSite.countryCode);
  let items =
  await getDynamicCmsDataViaCmsSelector(
    location.componentLocation,
    undefined, 
    itemSlug,
    languageSite,
    location.isSiteComponent,
    undefined,
    true
  ); 
  
  items = items.result || [];

  log.trace(`${slug}  > collectAllPageData > items > ${JSON.stringify(items)}`);

  return items;
}

export async function getSeoData(pageIdentifier: PageIdentifier, languageSite: LanguageSite){
  
  const locationSeo = await GetDataLocation("seo");    
  // Individual Page Data
  let seoItems =
  await getDynamicCmsDataViaCmsSelector(
    locationSeo.componentLocation,
    pageIdentifier,
    undefined, // Slug is undefined, as we are doing the lookup based on page type
    languageSite,
    locationSeo.isSiteComponent,
    undefined,
    true
  );

  seoItems = seoItems.result || [];

  return seoItems;
}


// export const getNavItemsWrapper = cache(async (countryCode: string) => {
//   console.log("cache miss - getNavItemsWrapper")
//   const languageSite =  await GetLanguageSiteByCode(countryCode as CountryCode);
//   const pageIdentifier = await GetPageIdentifier("home");
//   const navItems = await getNavItems(pageIdentifier, languageSite);
//   return navItems
// })

export async function getNavItems(pageIdentifier: PageIdentifier, languageSite: LanguageSite) {
  // Global Data - Nav items are Global Data required by each page
  const location = await GetDataLocation("navigation");
  let navItemsResult =
    await getDynamicCmsDataViaCmsSelector(
      location.componentLocation,
      pageIdentifier,
      undefined, // Slug is undefined, as we are doing the lookup based on page type
      languageSite,
      location.isSiteComponent,
      undefined,
      true
    );

    const navItems = navItemsResult.result || [];
    const siteSettings = (await GetSite()).getSiteSettings();
    if(siteSettings.deepSearchNavigation){
      await deepSearchNavigation(navItems, languageSite);
    }
    return navItems;
}

