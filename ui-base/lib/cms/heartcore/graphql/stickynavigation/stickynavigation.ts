import { getLogger } from "@/ui-base/lib/services/logging/LogConfig";
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier";
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite";
import { variablesById, variablesMultiSiteSlug } from "../../../_base/tools/common/multiSite";
import { processRawUrlsOnServer } from "../../tools/processRawUrlsOnServer";

const log = getLogger("headless.heartcore.graphql.stickyNav");

export function stickynavigation(pageIdentifier:PageIdentifier)
{
  return `
  query StickyNavBySlug($slug: String!) {
    content(url: $slug) {
      url
      id
      contentTypeAlias
      __typename
      name
      updateDate
      ... on StickyNavigation{
          updateDate
          phoneNumber
          buttons{
              name
              target
              type
              url
          }
          showSearch
          showCountrySelector
          searchText
      }
    }
  } 
 `
};

export default function GetFooterQuery() {
  return stickynavigation;
}

export function variables(urlPath: string, languageSite:LanguageSite) {
  let variables = variablesMultiSiteSlug(urlPath, languageSite);
  log.trace("variables heartcore model > ", variables);
  return variables;
}

export async function mapStickyNavigationData(data : any, pageIdentifier:PageIdentifier, languageSite:LanguageSite) {
  const content = data?.content;

  if (content) {
    await processRawUrlsOnServer(content, languageSite);
  }

  return content;
}