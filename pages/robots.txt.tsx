//pages/sitemap.xml.js

import { getLogger } from "@/ui-base/lib/services/logging/LogConfig";
import { collectRobotsTxtData } from "@/ui-base/lib/services/robotsService";

const log = getLogger("headless.pages.robots.txt");

function generateRobotsTxt(data) {
  log.debug("generateRobotsTxt ", data);
    return `${data}`;
  }
  

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  const data = await collectRobotsTxtData();  

  // We generate the XML sitemap with the posts data
  const sitemap = generateRobotsTxt(data);

  res.setHeader('Content-Type', 'text/plain');
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;


