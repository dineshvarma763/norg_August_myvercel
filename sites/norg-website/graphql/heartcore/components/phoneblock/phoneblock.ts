import {
  variablesMultiSiteByIdentifier,
  variablesMultiSiteSlug,
} from "@/ui-base/lib/cms/_base/tools/common/multiSite"
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier"
import { loadSingleComponentGraphQLData } from "@/ui-base/lib/services/components/pageSubComponentDataService"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { filterSubComponentData } from "@/ui-base/lib/util/filterTools"

const log = getLogger("headless.graphql.heartcore.components.phoneblock")

export function phoneblock(slug: string) {
  return `query PhoneblockComponentsBySlug($slug: String!) {
    content(url: $slug) {
      url
      contentTypeAlias
      name
      sortOrder
      updateDate
      ... on PhoneBlock
      {
      name
      contactTitle
      contactDetails
      contactNumber
      updateDate                                                                              
      id
      }
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
                              url
                              contentTypeAlias
                              updateDate
                              ... on PhoneBlock
                              {
                                  __typename
                                  contentTypeAlias
                                  url
                                  name
                                  sortOrder                        
                                  contactTitle
                                  contactDetails
                                  contactNumber
                                  updateDate                         
                                  datasource
                                  {
                                   contentTypeAlias
                                   updateDate
                                   ... on PhoneBlock
                                   {
                                    name
                                    contactTitle
                                    contactDetails
                                    contactNumber
                                    updateDate
                                    id
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

  log.trace("variables heartcore PhoneBlock > ", variables)
  return variables
}

export default function GetPhoneblockQuery() {
  return phoneblock
}

export async function mapPhoneblockData(data, pageIdentifier: PageIdentifier, languageSite: LanguageSite, sortOrder: number) {
  log.trace("variables heartcore mapPhoneblockData > ", JSON.stringify(data))
  log.trace("data.content.children.edges > ", data?.content?.children?.edges);
  const edges = data?.content?.children?.edges;

  let matchingResult:any = null;

  // This is a special case to handle for Grid or Accordion Sub-Components
  if(data?.content?.contentTypeAlias == 'phoneBlock'){ 
    matchingResult = data?.content;
  }else {
    matchingResult = await retrievePhoneBlockData(edges, matchingResult, data, languageSite, sortOrder);
  }

  if(matchingResult){
    matchingResult.componentDocumentation = getComponentDocumentation();
    matchingResult.youtubeVideo = getYoutubeDocumentation();
  }else {
    console.log('No matchingResult found for PhoneBlock', data);
  }

  return matchingResult;
}

async function retrievePhoneBlockData(edges:any, matchingResult:any, data:any, languageSite: LanguageSite, sortOrder: number) {
  if(!edges || edges.length === 0){
    return null;
  }

  let matchingDataArray = filterSubComponentData(edges, 'PhoneBlock'); 

  // If this call is a recursive call, then the data is structured slightly differently.
  // A recursive call would load the global datasource. the following code handles that case.
  if ((!matchingDataArray || matchingDataArray.length === 0) && data.content.contentTypeAlias === 'phoneBlock') {
    return data.content;
  } else if (matchingDataArray.length > 0) {
    // filter by matching sortOrder, take the first result
    const filteredBySortOrder = matchingDataArray.filter((item) => item.sortOrder === sortOrder);
    if (filteredBySortOrder.length === 1) {
      matchingResult = filteredBySortOrder[0];
    }
  }

  // The datasource is a global datasource, so we need to load the datasource data.
  if (matchingResult && matchingResult?.datasource && matchingResult?.datasource) {
    matchingResult = matchingResult.datasource;
  }

  return matchingResult;
}

function getComponentDocumentation() {
  return "/library/15-phone-block";
}

function getYoutubeDocumentation() {
  return "https://youtu.be/ix7rnw75vWI";
}