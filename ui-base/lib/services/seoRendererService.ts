import { LanguageSite } from "../interfaces/LanguageSite";
import { PageIdentifier } from "../interfaces/PageIdentifier";
import { getSeoData } from "./data/pageLayoutDataCollector";
import { GetLanguageSiteByURL } from "./languageService";
import { getLogger } from "./logging/LogConfig";
import { GetSiteConfig } from "./siteContextService";
import { processURLForNavigation } from "./urlService";

const log = getLogger("headless.seoRendererServiceTSX")

import { Metadata } from 'next'
import { processURLForNavigationServer } from "./urlServiceServer";
import { processUrlEndWith } from "../util/filterTools";

export async function seoExtractor(slug: string, pageIdentifier: PageIdentifier) {
  const languageSite = await GetLanguageSiteByURL(slug);
  const site = await GetSiteConfig();
  let seoItems = await getSeoData(pageIdentifier, languageSite);
  return await generateMetadataJSON(slug, seoItems, languageSite, site.name);
}

export async function staticPageSeoExtractor(slug: string, seoItems:any)
{
  const languageSite = await GetLanguageSiteByURL(slug);
  const site = await GetSiteConfig();
  return await generateMetadataJSON(slug,seoItems,languageSite,site.name);
}

export async function generateMetadataJSON(slug:string, seoItems:any, languageSite:LanguageSite, siteName:string): Promise<Metadata> {
  let friendlyUrl;
  slug = (String(slug).startsWith("/")) ? slug : "/"+slug;
  friendlyUrl = await processURLForNavigationServer(slug, languageSite);
  friendlyUrl = (String(friendlyUrl).startsWith("/")) ? friendlyUrl :"/"+friendlyUrl

  // Construct the canonical URL
  let canonicalURL;
  if (seoItems?.canonicalURLContentItem?.url) {
    canonicalURL = `${process.env.NEXT_PUBLIC_CMS_MAIN_DOMAIN}${processURLForNavigation(seoItems.canonicalURLContentItem.url, languageSite)}`;
  } else if (seoItems?.canonicalURLAbsolute) {
    canonicalURL = seoItems.canonicalURLAbsolute;
  } else {
    canonicalURL = `${process.env.NEXT_PUBLIC_CMS_MAIN_DOMAIN}${friendlyUrl}`;
  }

    // Check if page should be no indexed
    let pageIndex = true;
    if(seoItems?.noIndexPage && seoItems?.noIndexPage == true) {
      pageIndex = false;
    }

  //fomating Alternate URLs
  const alternateUrls: any = await getAlternateURLs(seoItems?.alternateMultiURLs, friendlyUrl, languageSite);

  const { title, siteNameCountry } = titleExtrator(siteName, languageSite, slug, seoItems);
  const ogDefaultImage =  process.env.NEXT_PUBLIC_CMS_MAIN_DOMAIN + '/norg-website/images/logo.png';
  const ogImageUrl = seoItems?.ogImage?.url ?  seoItems.ogImage.url : ogDefaultImage;
  const ogDescription = seoItems?.ogDescription ? seoItems.ogDescription : seoItems?.seoDescription ? seoItems?.seoDescription : title;

  const ogImage:OGImage = {
    url: ogImageUrl,
    width: 200,
    height: 200,
  };
return {
      title: title,
      description: `${seoItems?.seoDescription}`,
      openGraph: {
        title: title,
        description: ogDescription,
        images: ogImage,
        url: canonicalURL,
        siteName: siteNameCountry,
        type: 'website'
      },
      alternates: {
        canonical: canonicalURL,
        languages: alternateUrls,
      },
      ...(!pageIndex ? { robots: { index: pageIndex } } : {}),
      // jsonLd: seoItems?.structuredData ? JSON.stringify(seoItems.structuredData) : undefined
    }
}

function titleExtrator(siteName: string, languageSite: LanguageSite, slug: string, seoItems: any) {
  const siteNameCountry = `${siteName} ${languageSite?.countryCode?.toUpperCase()}`;
  let pageTitle = "";
  if(seoItems?.seoTitle) {
    pageTitle = seoItems.seoTitle;
  } else if(seoItems?.name) {
    pageTitle = seoItems.name;
  }
  const title = `${pageTitle} - ${siteNameCountry}`;
  return { title, siteNameCountry };
}

function unescapeString(s: string) {
  return s.replace(/\\n/g, '\n')
    .replace(/\\'/g, '\'')
    .replace(/\\"/g, '"')
    .replace(/\\&/g, '&')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\b/g, '\b')
    .replace(/\\f/g, '\f');
}

export async function getAlternateURLs(alternateUrls = [], friendlyUrl, currentLanguageSite: LanguageSite) {

  const response:any = {"x-default": processUrlEndWith(`${process.env.NEXT_PUBLIC_CMS_MAIN_DOMAIN}${friendlyUrl}`)};

  response[`en-${currentLanguageSite?.countryCode}`] = processUrlEndWith(`${process.env.NEXT_PUBLIC_CMS_MAIN_DOMAIN}${friendlyUrl}`);

  // Handle case when alternateUrls is null, undefined or empty
  if (!alternateUrls || alternateUrls.length === 0) {
    return response;
  }

  const result = await Promise.all(alternateUrls.map(async (alternateUrl) => {
    try {
      const url = alternateUrl.url;

      if (alternateUrl.type === 'CONTENT') {
        const languageSite = await GetLanguageSiteByURL(url);
        let friendlyPageUrl = await processURLForNavigationServer(url, languageSite);
        friendlyPageUrl = friendlyPageUrl.replace("//","/");
        const fullUrl = `${process.env.NEXT_PUBLIC_CMS_MAIN_DOMAIN}${friendlyPageUrl}`;

        response[`en-${languageSite?.countryCode}`] = processUrlEndWith(fullUrl);
      }
      // else {
      //   let friendlyPageUrl = await processURLForNavigationServer(slug, currentLanguageSite);
      //   response[`en-${currentLanguageSite?.countryCode}`] = friendlyPageUrl;
      // }
    } catch (error) {
      console.error('Failed to process alternateUrl: ', alternateUrl, ' Error: ', error);
      return null;
    }
  }));

  return response;
}

type OGImage = string | OGImageDescriptor | URL;
type OGImageDescriptor = {
    url: string | URL;
    secureUrl?: string | URL;
    alt?: string;
    type?: string;
    width?: string | number;
    height?: string | number;
};
