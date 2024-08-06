import { getLogger } from "@/ui-base/lib/services/logging/LogConfig";
import { variablesMultiSiteSlug } from "../../../_base/tools/common/multiSite";
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite";
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier";
import { CmsVariants } from "../../../constants";

const log = getLogger("headless.graphql.heartcore.common.multiSite");

export function model(urlPath:string)
{
  return `
  query GetPageByLongSlug($slug: String!) {
    pageCollection(where: { urlPath : $slug }, limit: 1) {
        items{   
            __typename         
            ... on Page{
                seoTitle
            }
        }
    }
}`
};

export function variables(urlPath: string, languageSite:LanguageSite) {
  const variables  = variablesMultiSiteSlug(urlPath, languageSite);
  log.debug("variables contentful model", urlPath, variables);
  return variables;
}

export default function GetModelQuery() {
  return model;
}

export function mapModelData(data, pageIdentifier:PageIdentifier, languageSite:LanguageSite) {
  log.debug("mapModelData", data);
  const typeNameIniitial = data?.pageCollection?.items[0].__typename;
  if(typeNameIniitial == 'Page'){
    return CmsVariants.variants.contentful.pageTypes.dynamic.pageVariant;
  }
}