import { getLogger } from "@/ui-base/lib/services/logging/LogConfig";
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier";
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite";
import { variablesMultiSiteByIdentifier, variablesMultiSiteSlug } from "../../../_base/tools/common/multiSite";

const log = getLogger("headless.alias");

export function alias(pageIdentifier:PageIdentifier)
{
  return `
  query AliasBySlug($slug: String!) {
    content(url: $slug) {
       url
       ... on Homepage {
        superAlias
        updateDate
        }
        ... on SubComponentsPage {
        superAlias
        updateDate
        }        
        ... on ProductPage {
          superAlias
          updateDate
          }
    }
}
 `
};

export default function GetNavQuery() {
  return alias;
}

export function variables(
  pageIdentifierOrSlug: PageIdentifier | string,
  languageSite: LanguageSite
) {
  let variables = {};

  if (typeof pageIdentifierOrSlug === "string") {
    variables = variablesMultiSiteSlug(pageIdentifierOrSlug, languageSite)
  } else {
    variables = variablesMultiSiteByIdentifier(pageIdentifierOrSlug, languageSite)
  }

  return variables
}

export function mapAliasData(data:any, pageIdentifier:PageIdentifier, languageSite:LanguageSite) {
    return data?.content?.superAlias;
}
