import dynamic from "next/dynamic";
import { LanguageSite } from "../interfaces/LanguageSite";
import { PageDataProps } from "../interfaces/PageDataProps";
import { getLogger } from "./logging/LogConfig";

const DynamicATAPage_Sitemap = dynamic(() => import('../../../sites/norg-website/pages/Sitemap').then((module) => module.SitemapPage), { ssr: true });
const log = getLogger("headless.services.sitemapService");

  export function getDynamicSitemap(siteName: string, languageSite: LanguageSite) {
    log.trace("getDynamicSitemap siteName:", siteName)

    const DynamicHomepage = (props: PageDataProps) => {
      if (siteName === 'landify') {
        return <DynamicATAPage_Sitemap data={props.data.data} />;
      } else if (siteName === 'multisite') {
        return <DynamicATAPage_Sitemap data={props.data.data} />;
      } else if (siteName === 'norg-website') {
        return <DynamicATAPage_Sitemap data={props.data.data} />;
      }
      return null;
    };

    return DynamicHomepage;
  }
