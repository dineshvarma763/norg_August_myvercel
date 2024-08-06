lib => cms => heartcore => graphql => componets => testimonial => testimonial.ts
import {
  variablesMultiSiteByIdentifier,
  variablesMultiSiteSlug,
} from "@/ui-base/lib/cms/_base/tools/common/multiSite"
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { getMatchingResultBySortOrder } from "@/ui-base/lib/util/filterTools"
import { extractUmbracoGuid } from "../../../tools/extractUmbracoGuid"
import { loadSingleComponentGraphQLData } from "@/ui-base/lib/services/components/pageSubComponentDataService"
import { stripSiteLanguagePrefix } from "@/ui-base/lib/services/urlService"
import { stripSiteLanguagePrefixAsync } from "@/ui-base/lib/services/stripSiteLanguagePrefixAsync"

const log = getLogger("headless.graphql.heartcore.components.accordion")

export function accordion(slug: string) {
  return `
  
  query GetAccordionComponent($slug: String!) {
    content(url: $slug) {
      url
      contentTypeAlias
      name
      sortOrder
      updateDate
      children{
          edges{
              node{
                  __typename
                  name
                  updateDate
                  children{
                      edges{
                          node {
                              __typename
                              name
                              level   
                              sortOrder
                              updateDate
                              ... on Accordion{
                                  name
                                  backgroundColour
                                  updateDate
                                  children{
                                      edges{
                                          node{                        
                                              name       
                                              id
                                              url  
                                              __typename    
                                              sortOrder
                                              updateDate
                                          }
                                      }
                                  }
                              }
                          }
                      }
                  }
              }
          }
      }
    }
}
  `
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

  log.trace("variables heartcore testimonial > ", variables)
  return variables
}

export default function GetTestimonialQuery() {
  return accordion;
}

export async function mapAccordionData(data, pageIdentifier: PageIdentifier, languageSite: LanguageSite, sortOrder: number) {
  log.trace("heartcore mapAccordionData > ", JSON.stringify(data))
  log.trace("heartcore mapAccordionData data.content.children.edges > ", data.content.children.edges);

  let matchingData = getMatchingResultBySortOrder(data.content.children.edges, "Accordion", sortOrder);
 
  if (!matchingData) {
    matchingData = {}
  }

  matchingData.componentDocumentation = getComponentDocumentation();
  matchingData.youtubeVideo = getYoutubeDocumentation();

  await retrieveSubComponents(matchingData, pageIdentifier, languageSite);

  return matchingData;
}

export async function retrieveSubComponents(matchingResult: any, pageIdentifier: PageIdentifier, languageSite: LanguageSite) {
  if (matchingResult && Array.isArray(matchingResult?.children?.edges)) {
    const promises = matchingResult?.children?.edges?.map(async ({node:item}) => {
      const slug = await stripSiteLanguagePrefixAsync(item?.url);
      if(slug){
        const dataItem = {url: slug, __typename: item.__typename};
        const data = await loadSingleComponentGraphQLData(dataItem, slug, item.__typename, languageSite);
        if(data)
          item.componentData = data.componentData;
      }
    });
    
    await Promise.all(promises);
  }
}

function getComponentDocumentation() {
  return "/library/9-accordion";  
}

function getYoutubeDocumentation() {
  return "https://www.youtube.com/watch?v=uH71Z38dQio";
}