import { GetLanguageSiteByCode, GetMainSiteLanguage } from '@/ui-base/lib/cms/heartcore/tools/urlTools';
import React from 'react';

import { GetPageIdentifier } from '@/ui-base/lib/services/cmsContextService';

import { seoExtractor } from '@/ui-base/lib/services/seoRendererService';
import { buildPageData } from '@/ui-base/lib/services/data/buildPageData';
import { Homepage } from '@/sites/norg-website/pages/Homepage';
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig";


const log = getLogger("headless.app.app");

// export const fetchCache = 'force-no-store'
export default async function Page() {
  const data = await getData();
  return (
    <>
      <Homepage data={data} />
    </>
  );
}

async function getData() {
    const languageSite =  await GetLanguageSiteByCode(await GetMainSiteLanguage());
    const data = await buildPageData('home', false, languageSite, { slug: '' });
    log.debug("getData > ", data);
    return data;
}

export async function generateMetadata({ params }) {
  const slug = '/';
  const pageIdentifier = await GetPageIdentifier('home');
  return await seoExtractor(slug, pageIdentifier);
}
