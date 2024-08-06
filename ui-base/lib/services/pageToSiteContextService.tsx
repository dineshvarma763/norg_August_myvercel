import dynamic from 'next/dynamic';
import React from 'react';
import { getLogger } from './logging/LogConfig';
import { RenderATADynamicServerImport } from '@/sites/norg-website/content/heartcore/components/DynamicServerImportsMap';
import { RenderATADynamicClientImport } from '@/sites/norg-website/content/heartcore/components/DynamicClientImportsMap';

const log = getLogger("headless.services.pageToSiteContextService");

export interface PageDataProps {
  data?: any;
}

const DynamicATAMultisitePage_Home = dynamic(() => import('../../../sites/norg-website/pages/Homepage').then((module) => module.Homepage), { ssr: true });

const DynamicATAMultisitePage_All = dynamic(() => import('../../../sites/norg-website/pages/AllPages').then((module) => module.AllPages), { ssr: true });

const DynamicATAPage_Sitemap = dynamic(() => import('../../../sites/norg-website/pages/Sitemap').then((module) => module.SitemapPage), { ssr: true });


export function getAllPages(siteName: string) {
  log.trace("getDynamicHomepages siteName:", siteName)

  const DynamicAll = (props: PageDataProps) => {

    if (siteName === 'norg-website') {
      return <DynamicATAMultisitePage_All data={props.data} />;
    }
    return null;
  };

  return DynamicAll;
}

export function getDynamicHomepages(siteName: string) {
  log.trace("getDynamicHomepages siteName:", siteName)

  const DynamicHomepage = (props: PageDataProps) => {
    // if (siteName === 'landify') {
    //   return <DynamicLandifyPage_Home data={props.data} />;
    // } else
    // if (siteName === 'multisite') {
    //   return <DynamicMultisitePage_Home data={props.data} />;
    // } else
    if (siteName === 'norg-website') {
      return <DynamicATAMultisitePage_Home data={props.data} />;
    }
    // else if (siteName === 'showcase') {
    //   return <DynamicShowcasePage_Home data={props.data} />;
    // }
    return null;
  };

  return DynamicHomepage;
}

export function getDynamicSitemap(siteName: string) {
  log.trace("getDynamicSitemap siteName:", siteName)

  const DynamicHomepage = (props: PageDataProps) => {
    if (siteName === 'multisite') {
      return <DynamicATAPage_Sitemap data={props.data} />;
    } else if (siteName === 'norg-website') {
      return <DynamicATAPage_Sitemap data={props.data} />;
    }
    return null;
  };

  return DynamicHomepage;
}

export function GetDynamicServerComponent({siteName}) {

  const DynamicComponent = ({data, componentId, globalData}) => {
    log.trace("renderATADynamicImport", componentId)
    if (siteName === 'landify') {
      return (<></>);
    } else if (siteName === 'multisite') {
      return (<></>);
    } else if (siteName === 'norg-website') {
      // return RenderATADynamicImport(data, componentId, globalData);
      return (<RenderATADynamicServerImport data={data} componentId={componentId} globalData={globalData}/>);
    } else if (siteName === 'showcase') {
      return (<></>);
    }
    return (<></>);
  };
  return DynamicComponent;
}

export function GetDynamicClientComponent({siteName}) {

  const DynamicComponent = ({data, componentId, globalData}) => {
    log.trace("renderATADynamicImport", componentId)
    if (siteName === 'landify') {
      return (<></>);
    } else if (siteName === 'multisite') {
      return (<></>);
    } else if (siteName === 'norg-website') {
      // return RenderATADynamicImport(data, componentId, globalData);
      return (<RenderATADynamicClientImport data={data} componentId={componentId} globalData={globalData}/>);
    } else if (siteName === 'showcase') {
      return (<></>);
    }
    return (<></>);
  };
  return DynamicComponent;
}
