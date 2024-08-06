import { GetDataLocation } from "../components/pageComponentDataLocationService";
import { LanguageSite } from "../../interfaces/LanguageSite";
import { getDynamicCmsDataViaCmsSelector, log } from "../data/graphqlDataService";


export async function getPageTypeBySlug(slug: string, languageSite: LanguageSite) {
  const location = await GetDataLocation("model");
  const pageType = (await getDynamicCmsDataViaCmsSelector(
    location.componentLocation,
    undefined,
    slug,
    languageSite,
    location.isSiteComponent
  )) || undefined;
  log.debug("graphqlDataService > getPageTypeBySlug > pageType > ", pageType?.result?.contentTypeAlias);
  return pageType?.result;
}
