import { getLogger } from "@/ui-base/lib/services/logging/LogConfig";
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier";
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite";
import { variablesMultiSiteSlug } from "../../../_base/tools/common/multiSite";
import { processRawUrlsOnServer } from "../../tools/processRawUrlsOnServer";

const log = getLogger("headless.heartcore.graphql.footer");

export function footer(pageIdentifier:PageIdentifier)
{
  return `
  query FooterBySlug($slug: String!) {
    content(url: $slug) {
      url
      contentTypeAlias
      __typename
      name
      updateDate
      ... on Footer{
        sortOrder
        selectableVariant
        order
        align
        maxItemsPerRow
        colReverse
        topRounded
        bottomRounded 
          leftLogo{
              url
              media{
                name
                updateDate
                mediaTypeAlias
                ... on Image{
                    updateDate
                    altText}
                }
          }
          rightLogo
          {
              url
              media{
                name
                updateDate
                mediaTypeAlias
                ... on Image{
                    updateDate
                    altText}
                }
          }
          bDLogo {
              url
              media{
                name
                updateDate
                mediaTypeAlias
                ... on Image
                        {updateDate
                         altText}
                }
         }
          copyrightNotice
          linkSections{
              content{
                  __typename
                  contentTypeAlias
                  ... on LinkListCOMP{
                      heading
                      links{
                          name
                          target
                          type
                          udi
                          url
                      }
                      showAsButton
                  }
              }
          }
          button{
              url
              name
              target
              type
          }
          phoneNumber
      }
    }
  } 
 `
};

export default function GetFooterQuery() {
  return footer;
}

export function variables(urlPath: string, languageSite:LanguageSite) {
  let variables = variablesMultiSiteSlug(urlPath, languageSite);
  log.trace("variables heartcore model > ", variables);
  return variables;
}

export async function mapFooterData(data : any, pageIdentifier: PageIdentifier, languageSite: LanguageSite) {
  const responseData = data?.content;
  if (responseData) {
      await processRawUrlsOnServer(responseData, languageSite);
  }
  return responseData;
}

