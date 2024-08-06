import { GetCMS } from "@/ui-base/lib/services/cmsContextService";
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig";
import { GetMultiSiteSlug, GetMultiSiteSlugByIdentifier } from "../../../heartcore/tools/urlTools";
import { sanitiseForKontent } from "../cms/kontent/kontentTools";
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier";
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite";

const log = getLogger("headless.graphql.heartcore.common.multiSite");

export function variablesMultiSiteSlug(slug:string, languageSite:LanguageSite)
{
  log.trace("variablesMultiSiteSlug > ", slug, languageSite);

  if(slug.indexOf("/global-components") > -1){
    return {'slug': slug};
  }

  let result = {'slug': GetMultiSiteSlug(slug, languageSite)};
  if(GetCMS() == "kontent"){
    result = sanitiseForKontent(result);
  }
  return result;
};

export function variablesMultiSiteByIdentifier(pageIdentifier: PageIdentifier, languageSite:LanguageSite)
{
  return {'slug': GetMultiSiteSlugByIdentifier(pageIdentifier, languageSite)};
};

export function variablesByName(name:String)
{
  const result = {'name': name};
  return result;
};

export function variablesById(id:String)
{
  const result = {'id': id};
  return result;
};
