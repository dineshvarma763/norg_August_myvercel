import { CmsVariants } from "../cms/constants";
import { GetCMS } from "./cmsContextService";
import { GetDataLocation } from "./components/pageComponentDataLocationService";
import { getDynamicCmsDataViaCmsSelector as getDynamicCmsDataViaCmsSelector } from "./data/graphqlDataService";
import { getLogger } from "./logging/LogConfig";

const log = getLogger("headless.services.robots");

export async function collectRobotsTxtData() {

  const cmsVariant = GetCMS();
  const cmsVariantSelected = CmsVariants.variants[cmsVariant]

  let location = await GetDataLocation("robotstxt");
  const navItems =
    await getDynamicCmsDataViaCmsSelector(
      location.componentLocation,
      undefined,
      "robots.txt",
      undefined,
      location.isSiteComponent
    );

  return navItems.result || [];
}

