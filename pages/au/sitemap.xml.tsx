//pages/sitemap.xml.js

import { GetLanguageSiteByCode } from "@/ui-base/lib/cms/heartcore/tools/urlTools";
import { collectSitemapNavigationStructure } from "@/ui-base/lib/services/data/collectSitemapNavigationStructure";


function generateSiteMap(data, domain) {

  data = data.filter((x) => typeof(x.showInSitemap) !== 'undefined' && x.showInSitemap === true && typeof(x.url) !== 'undefined' && x.url != null);

  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${data
       .map(({ id, slug, updateDate, url }) => {  
        const date = new Date(updateDate);  
         return `
       <url>
           <loc>${`${domain}${url.endsWith('/') ?  url.slice(0,-1) : url}`}</loc>
           <lastmod>${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')}</lastmod>
           <changefreq>always</changefreq>
           <priority>0.5</priority>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}
  

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ req, res }) {
  const { host } = req.headers;
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const languageSite = await GetLanguageSiteByCode('au');
  const data = await collectSitemapNavigationStructure(languageSite);  

  // Replace MAIN_DOMAIN with dynamic domain
  const sitemap = generateSiteMap(data, `${protocol}://${host}`);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;