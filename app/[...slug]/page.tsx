import { GetMainSiteLanguage } from '@/ui-base/lib/cms/heartcore/tools/urlTools';
import React from 'react';
import { GetSite } from '@/ui-base/lib/services/siteContextService';
import { getLogger } from '@/ui-base/lib/services/logging/LogConfig';
import { collectAllRoutes } from '@/ui-base/lib/services/routeProviderService';
import { collectDynamicPageData } from '@/ui-base/lib/services/data/pageDataProvider';
import { getPageIdentifierBySlug } from '@/ui-base/lib/services/cmsContextService';
import { seoExtractor } from '@/ui-base/lib/services/seoRendererService';
import { AllPages } from '@/sites/norg-website/pages/AllPages';

// export const fetchCache = 'force-no-store'
export default async function Page({params} : { params: { slug: string } } ){
  const data = await getData(params);
  return <AllPages data={data}/>;
}

async function getData(params) {

    const log = getLogger("headless.pages.slug." + params.slug.join('.'  ));
    const site = await GetSite();
    const siteLanguage = await GetMainSiteLanguage();
    if(!site.shouldRenderAllPages()){
      log.debug( `getStaticProps ${siteLanguage} paths are not required`, 0);
      return {};
    } else {

    let slugCleanedUp = params.slug.join('/');
    if(slugCleanedUp === 'favicon.ico' || slugCleanedUp.indexOf(".js") > -1)
    {
      log.debug("getStaticProps slugCleanedUp JS file", slugCleanedUp);
      return {}
    }

    const pageDataResult = await collectDynamicPageData(params, slugCleanedUp);
	// console.log("Page slug : " , slugCleanedUp,  ", Name: " , pageDataResult.pageData.data.seoItems.name , ", SEO Title : " , pageDataResult.pageData.data.seoItems.seoTitle , " , Description: " , pageDataResult.pageData.data.seoItems.seoDescription)
    return pageDataResult.pageData;
  }
}

export async function generateStaticParams() {
  const log = getLogger("headless.pages.slug");

  if(!GetSite().shouldRenderAllPages()){
    log.debug(`getStaticPaths ${await GetMainSiteLanguage()} paths`, 0);
    return [];
  }

  const languageSites = (await GetSite()).siteSettings.languageSites;

  // Use Promise.all with map to process languageSites concurrently
  const pathsArray = await Promise.all(languageSites.map(async (languageSite) => {
    try {
      // Collect all routes for the current language site
      return await collectAllRoutes(languageSite);
    } catch (error) {
      log.error(`Error in generateStaticParams for languageSite > ${languageSite}, Error: ${error}`);
      // Return an empty array in case of error, so Promise.all doesn't fail
      return [];
    }
  }));

  // Flatten the array of arrays into a single array
  let paths = [].concat(...pathsArray);

  const isProduction = process.env.NEXT_PUBLIC_AUTHOR_MODE === "false";
  if(isProduction) {
    // filter out any paths starting with /library
    paths = paths.filter((path) => {
      return !(path.slug.indexOf("library") > -1);
    });
  }

  return paths;
}

export async function generateMetadata({ params }) {
  const log = getLogger("headless.pages.generateMetadata");
  const slug = params.slug;

  if(slug == 'favicon.ico' || slug.indexOf(".js") > -1 || slug == "undefined")
  {
    log.debug("getStaticProps slugCleanedUp JS file", slug);
    return {}
  }
  const slugJoined = slug.join("/")
  const { pageIdentifier, cmsUrl } = await getPageIdentifierBySlug(slugJoined)
  if (!pageIdentifier || !cmsUrl) return {}
  return await seoExtractor(cmsUrl, pageIdentifier)
}
