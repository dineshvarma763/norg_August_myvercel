import { PageVariant } from "../../cms/constants";
import { GetCMS, GetCMSVariant, GetPageIdentifier } from "../cmsContextService";
import { collectAllPageData } from "./pageLayoutDataCollector";
import { GetSite } from "../siteContextService";
import { LanguageSite } from "../../interfaces/LanguageSite";
import { PageDataInterface } from "../../interfaces/PageDataInterface";
import { log } from "./graphqlDataService";


export async function buildPageData(pageVariant: PageVariant, isDynamic: Boolean, site: LanguageSite, params?: any): Promise<PageDataInterface> {

  if ((await GetSite()).shouldAbortPageDataCollection()) {
    log.debug('buildPageData > no page data is needed for this site');
    return { data: {} };
  } else {
    const cmsVariant = GetCMS();
    const cmsVariantSelected = GetCMSVariant();
    // log.debug( "buildPageData > cmsVariantSelected > ", cmsVariantSelected);
    log.trace("buildPageData > pageVariant > ", pageVariant);
    log.trace("buildPageData > params > ", params);
    log.trace("buildPageData > isDynamic > ", isDynamic);
    const pageIdentifier = await GetPageIdentifier(pageVariant);
    log.debug("buildPageData > pageIdentifier > ", pageIdentifier);

    // We set the back end slug here for all dynamic pages.
    if (isDynamic && typeof params !== "undefined" && typeof params.slug !== "undefined") {
      if (pageIdentifier && params)
        pageIdentifier.backEndSlug = params && params.slug ? params.slug : "";
    }

    const result = { data: await collectAllPageData(pageIdentifier, pageVariant, params.slug, site) };

    return result;
  }
}
