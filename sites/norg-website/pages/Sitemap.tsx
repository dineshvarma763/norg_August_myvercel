
import Breadcrumbs from '@/ui-base/components/ui/breadcrumbs/Breadcrumbs';
import { NorgLayout } from '../views/layout';
import { buildMegaMenu } from '../components/MegaMenu';
import AccordionSitemapClient from '@/ui-base/components/ui/accordion/accordionClientSitemap';

export function SitemapPage({ data }) {
let breadcrumbCustom;
breadcrumbCustom = data?.data?.breadcrumbItems;
let href = (data?.data?.languageSite?.countryCode !="us" ? `/${data?.data?.languageSite?.countryCode}/sitemap`:"/sitemap");
breadcrumbCustom.links.push({ href: href, text: "Sitemap"});

  return (  
    <NorgLayout
      className={"flex w-full flex-col items-center"}
      data={data}
      isMegamenu={true}
      megaMenuMenu={buildMegaMenu(data?.data?.navItems, data?.data?.stickyNavItems, data?.data?.languageSite)}
    >
      <div className="mx-auto py-12">
      <div className="w-full container">
        <Breadcrumbs
            data={data?.data?.breadcrumbItems}
            seperatorIcon={<span>/</span>}
            itemClassName="uppercase font-urbanist text-my-blue font-500 text-xs tracking-0.1em no-underline mb-2.5"
            slug={'/sitemap'}
          />
      </div>
      <div className="sitemap-link-sections w-full container flex flex-wrap">
      <h2 className="text-5xl mt-11 font-bold uppercase text-my-black ml-4">Sitemap</h2>
        <AccordionSitemapClient sitemapList={data?.data?.dataSitemap} languageSite={ data?.data?.languageSite}></AccordionSitemapClient>
      </div>
    </div>
    </NorgLayout>
  )
}