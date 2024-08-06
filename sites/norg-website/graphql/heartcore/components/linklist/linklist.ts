import {
    variablesMultiSiteByIdentifier,
    variablesMultiSiteSlug,
} from "@/ui-base/lib/cms/_base/tools/common/multiSite"
import { processRawUrlsOnServer } from "@/ui-base/lib/cms/heartcore/tools/processRawUrlsOnServer"
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { getMatchingResultBySortOrder } from "@/ui-base/lib/util/filterTools"

const log = getLogger("headless.graphql.heartcore.query.linklist")

export function linklist(slug: string) {
    return `
    query GetLinkListSectionComponentsBySlug($slug: String!) {
        content(url: $slug) {
          url
          contentTypeAlias
          name
          __typename
          sortOrder
          updateDate
          ...on LinksListings {
              name
              level
              url
              selectableVariant
              topRounded
              bottomRounded
              align
              backgroundColour
              updateDate
              linksListings {
                  content {
                      __typename
                      ...on LinkListCOMP1 {
                          heading
                          mediaLinks{
                              url
                              media{
                                  id
                                  name
                                  __typename
                                  url
                                  mediaTypeAlias
                                  updateDate
                              }
                          }
                          icon {
                              url
                          }
                      }
                      ...on LinkListCOMP {
                          heading
                          links{
                              url
                              target
                              name
                              type
                              udi
                          }
                          icon {
                              url
                          }
                      }
                  }
              }
          }
          children{
              edges{
                  node{
                      __typename
                      name
                      children {
                          edges {
                              node {
                                  name
                                  __typename
                                  updateDate
                                  url
                                  sortOrder
                                  ...on LinksListings {
                                      name
                                      level
                                      url
                                      selectableVariant
                                      topRounded
                                      bottomRounded
                                      align
                                      backgroundColour
                                      updateDate
                                      linksListings {
                                          content {
                                              __typename
                                              ...on LinkListCOMP1 {
                                                  heading
                                                   mediaLinks{
                                                       url
                                                       media{
                                                           __typename
                                                           id
                                                           name
                                                           url
                                                           mediaTypeAlias
                                                           updateDate
                                                       }
                                                  }
                                                  icon {
                                                      url
                                                  }
                                              }                                            
                                              ...on LinkListCOMP {
                                                  heading
                                                  links{
                                                      url
                                                      target
                                                      name
                                                      type
                                                      udi
                                                  }
                                                  icon {
                                                      url
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
  }
`}

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

    log.trace("variables heartcore linklist > ", variables)
    return variables
}

export default function GetLinkSectionQuery() {
    return linklist
}

export async function mapLinkSectionData(data, pageIdentifier: PageIdentifier, languageSite: LanguageSite, sortOrder: number) {
    log.trace("variables heartcore mapLinkSectionData > ", JSON.stringify(data))
    
    let matchingData:any = getMetaData();

    // This is a special case to handle for Accordion Sub-Components
    if(data?.content?.contentTypeAlias == 'linksListings'){ 
      matchingData = data?.content;

    // This is the main case of handling rich text as pagae Sub-Components
    }else {
      const edges = data?.content?.children?.edges;
      if(edges){
        log.trace("mapLinkSectionData data.content.children.edges > ", edges);
        matchingData = getMatchingResultBySortOrder(edges, "LinksListings", sortOrder);
      }
    }

    if (!matchingData) {
      matchingData = getMetaData()
    } 
    
    if (matchingData) {
        await processRawUrlsOnServer(matchingData, languageSite);
    }

    return matchingData;
  }

  function getMetaData() {
    return {  
      componentDocumentation: getComponentDocumentation(), 
      youtubeVideo:getYoutubeDocumentation()
    }
  }
  
  function getComponentDocumentation() {
    return "/library/10-links-listings";
  }
  
  function getYoutubeDocumentation() {
    return "https://www.youtube.com/watch?v=QjRs6QA8y6Q";
  }
