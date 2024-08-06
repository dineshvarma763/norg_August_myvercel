
// subComponentContent: 
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig";
import { variablesMultiSiteSlug } from "../../../_base/tools/common/multiSite";
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite";
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier";

const log = getLogger("headless.graphql.heartcore.common.multiSite");

export function subComponentContent() {
  return `query SubComponentsBySlug($slug: String!) {
    content(url: $slug) {
      slug:url
      name
      id
      updateDate
      children {
        edges {
          node {
            __typename
            contentTypeAlias
            updateDate
            # Add other fields to retrieve here
            children {
                edges {
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
  `
}

export function variables(slug:string, languageSite:LanguageSite)
{
  log.debug("variables > ", slug, languageSite);
  const vars = variablesMultiSiteSlug(slug, languageSite);
  return vars;
};

export default function GetSubComponentContentQuery() {
  return subComponentContent
}

export function mapSubComponentContentData(data, pageIdentifier: PageIdentifier, languageSite: LanguageSite, sortOrder: number) {
  const childNodes: ChildNode[] = [];
  log.debug("mapSubComponentContentData > ", data, pageIdentifier, languageSite);
  data.content.children.edges.forEach((edge) => {
    const { node } = edge;

    if (node.contentTypeAlias === 'dataFolder') {
      node.children.edges.forEach((childEdge) => {
        const { node: childNode } = childEdge;
        log.trace("mapSubComponentContentData > childNode > ", childNode.name, childNode.id, childNode.url, childNode.__typename);
        childNodes.push(childNode);
      });
    }
  });

  return childNodes;
}
