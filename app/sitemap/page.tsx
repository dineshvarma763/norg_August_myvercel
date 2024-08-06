import { GetLanguageSiteByCode, GetMainSiteLanguage } from '@/ui-base/lib/cms/heartcore/tools/urlTools';
import { buildPageData } from '@/ui-base/lib/services/data/buildPageData';
import { collectSitemapNavigationStructure,collectSitemapNavigationSiteStructure } from '@/ui-base/lib/services/data/collectSitemapNavigationStructure';
import { GetSite } from '@/ui-base/lib/services/siteContextService';
import { getDynamicSitemap } from '@/ui-base/lib/services/sitemapService';
import { getLogger } from '@/ui-base/lib/services/logging/LogConfig';
import { staticPageSeoExtractor } from '@/ui-base/lib/services/seoRendererService';
import React from 'react';

export default async function Page() {
  const data = await getSitemapData();
  const DynamicSiteMap = getDynamicSitemap(data.siteName, data.languageSite);
  return <DynamicSiteMap data={data} />;
}

async function getSitemapData() {
  const languageSite = await GetLanguageSiteByCode('au');
  const data = await buildPageData('home', false, languageSite, { slug: '' });
  let dataSitemap = await collectSitemapNavigationSiteStructure(languageSite);  
  dataSitemap = dataSitemap.filter((x) => typeof(x.showInSitemap) !== 'undefined' && x.showInSitemap === true && typeof(x.url) !== 'undefined' && x.url != null);
  (data.data as any).dataSitemap = dataSitemap;
  // We generate the XML sitemap with the posts data
  const site = GetSite();
  const siteName = site.name;
  return {
      data,
      siteName,
      languageSite
    };
}

export async function generateMetadata() 
{   
  const log = getLogger("headless.pages.generateMetadata");
  const slug = "/sitemap";
  const seoData = {name: "Sitemap",
             seoTitle:"Sitemap",
             seoDescription:"Navigate the Automatic Technology website with ease. Search for the garage door or openers you need. Find all the necessary links and pages easily with our user-friendly sitemap.",
             ogDescription:"",
             ogImage:null,
             canonicalURLAbsolute:"",
             canonicalURLContentItem:null,
             structuredData:"",
             noIndexPage:false,
             alternateMultiURLs:null  
            };

  return await staticPageSeoExtractor(slug, seoData);
}