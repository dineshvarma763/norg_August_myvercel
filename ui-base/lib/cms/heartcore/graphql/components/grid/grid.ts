import {
  variablesMultiSiteByIdentifier,
  variablesMultiSiteSlug,
} from "@/ui-base/lib/cms/_base/tools/common/multiSite"
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier"
import { loadSingleComponentGraphQLData } from "@/ui-base/lib/services/components/pageSubComponentDataService"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { getMatchingResultBySortOrder } from "@/ui-base/lib/util/filterTools"
import { extractUmbracoGuid } from "../../../tools/extractUmbracoGuid"
import { stripSiteLanguagePrefixAsync } from "@/ui-base/lib/services/stripSiteLanguagePrefixAsync"
import { getPageTypeBySlug } from "@/ui-base/lib/services/model/getPageTypeBySlug"

const log = getLogger("headless.graphql.heartcore.grid.grid")

export function grid(slug: string) {
  return `    
  query GetGridComponent($slug: String!) {
    content(url: $slug) {
      url
      contentTypeAlias
      name
      sortOrder
      updateDate
      children(where: { contentTypeAlias_ends_with: "dataFolder" }) {
          edges{
              node{
                __typename
                url
                contentTypeAlias
                name
                updateDate
                children(where: { contentTypeAlias_ends_with: "GridContent" }) {
                      edges{
                          node {
                              __typename
                              url
                              contentTypeAlias
                              name
                              level   
                              sortOrder        
                              updateDate                                   
                              ... on GridContent{
                                  selectableVariant
                                  topRounded
                                  bottomRounded
                                  align
                                  order
                                  backgroundColour
                                  body
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

  log.trace("variables heartcore productList > ", variables)
  return variables
}

export default function GetGridQuery() {
  return grid
}

export async function mapGridData(data, pageIdentifier: PageIdentifier, languageSite: LanguageSite, sortOrder: number) {
  log.trace("variables heartcore mapGridData > ", JSON.stringify(data))
  log.trace("mapGridData data.content.children.edges > ", data.content.children.edges);

  let matchingData = getMatchingResultBySortOrder(data.content.children.edges, "GridContent", sortOrder)

  if (!matchingData) {
    matchingData = {}
  }
  
  const body = matchingData.body;

  await mapGridSubComponents(body, matchingData, pageIdentifier, languageSite);

  if(!matchingData?.childComponents || matchingData?.childComponents?.length === 0){
    log.trace("No embedded child components found for grid component", data?.content?.url);
  }

  matchingData.componentDocumentation = getComponentDocumentation();
  matchingData.youtubeVideo = getYoutubeDocumentation();

  return matchingData;
}

function getComponentDocumentation() {
  return "/library/2-structured-grid-content";
}

function getYoutubeDocumentation() {
  return "https://youtu.be/uTM9VEn2_Hc";
}

// Function to retrieve a component given its ID and other required information
async function getComponent(udi: string, languageSite: LanguageSite) {
  const model = await getPageTypeBySlug(udi, languageSite);
	if (model === null || model === undefined)
		return null;
  const contentTypeAlias = model.contentTypeAlias;
  let url = model.url;
  if(!(url.indexOf("/global-components") > -1)) {
    url = await stripSiteLanguagePrefixAsync(model.url);
  }
  const component = await loadSingleComponentGraphQLData(model, url, contentTypeAlias, languageSite);

  if(component){
    component.id = udi;
    component.componentMetaData.id = udi;
    component.componentMetaData.isInsideGrid = true;
    component.componentMetaData.languageSite = languageSite;
    return component;
  }
  return null;
}

// Function to process the matches and return the components
async function processMatches(matches: any[], languageSite: LanguageSite) {
  const components = await Promise.all(matches.map(async (match) => {
    const udi = extractUmbracoGuid(match);
    return getComponent(udi, languageSite);
  }));

  return components.filter(component => component !== null);
}

// Main function to map the grid subcomponents
async function mapGridSubComponents(body: any, matchingData: any, pageIdentifier: PageIdentifier, languageSite: LanguageSite) {
  matchingData.childComponents = [];

  if (!body) {
    log.warn('Body is undefined');
    return;
  }

  const bodyString = JSON.stringify(body);

  if (!bodyString) {
    log.warn('BodyString is undefined');
    return;
  }

  const matches = bodyString.match(/umb:\/\/document\/([a-fA-F0-9]{32})/g);

  if (matches) {
    matchingData.childComponents = await processMatches(matches, languageSite);
  }
}

