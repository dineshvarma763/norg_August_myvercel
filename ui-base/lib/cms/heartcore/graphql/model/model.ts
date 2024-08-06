import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier";
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig";
import { variablesById, variablesMultiSiteSlug } from "../../../_base/tools/common/multiSite";
import { isGuid } from "../../tools/urlTools";

const log = getLogger("headless.graphql.heartcore.common.multiSite");

export function model(slug:string)
{

  if(isGuid(slug)){
    return `
    query PageTypeBySlug($id: ID!) {
      content(id: $id) {
         url
         contentTypeAlias
         name
         __typename
         updateDate
      }
  }`
  }


  return `
  query PageTypeBySlug($slug: String!) {
    content(url: $slug) {
       url
       contentTypeAlias
       name
       __typename
       updateDate
    }
}`
};

export function variables(urlPath: string, languageSite:LanguageSite) {

  // detect if urlPath is a GUID and if so use variablesById
  if(isGuid(urlPath)){
    const idVar = variablesById(urlPath);
    return idVar;
  }

  let variables = variablesMultiSiteSlug(urlPath, languageSite);
  log.trace("variables heartcore model > ", variables);
  return variables;
}

export default function GetModelQuery() {
  return model;
}

export function mapModelData(data, pageIdentifier:PageIdentifier) {
  log.trace("variables heartcore mapModelData > ", JSON.stringify(data));
  //return data?.content?.contentTypeAlias;
  return data?.content;
}