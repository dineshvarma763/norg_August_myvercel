import { getLogger } from "../services/logging/LogConfig";

interface ResponseItem {
  node: any;
}

const log = getLogger(
  "ui-base.lib.util.filterTools"
)

export function processUrlEndWith(url: string): string {
  // Check if the url ends with '/'
  if (url.endsWith('/')) {
      // Remove the trailing '/' by subtracting 1 from the length
      return url.slice(0, -1);
  }
  // If the url doesn't end with '/', return it as is
  return url;
}

export function filterFirstSubComponentData(data: ResponseItem[], typeName:string): any {
  for (const item of data) {
    const node = item.node;
    if (node.__typename === 'DataFolder' && node.name === '_components') {
      for (const edge of node.children.edges) {
        if (edge.node.__typename === typeName) {
          return edge.node;
        }
      }
    }
  }
  return null;
}

export function filterSubComponentData(data: ResponseItem[], typeName: string): any[] {
  const matchingChildren: any[] = [];
  for (const item of data) {
    const node = item.node;
    if (node.__typename === 'DataFolder' && node.name === '_components') {
      for (const edge of node.children.edges) {
        if (edge.node.__typename === typeName) {
          log.trace(`${edge.node.__typename}  === ${typeName} adding matching`, edge.node)
          matchingChildren.push(edge.node);
        }
      }
    }
  }
  return matchingChildren;
}

export function getMatchingResultBySortOrder(edges, identifier, sortOrder) {
  let matchingDataArray = filterSubComponentData(edges, identifier);
  let matchingResult = null;
  const filteredBySortOrder = matchingDataArray.filter((item) => item.sortOrder === sortOrder);
  if(filteredBySortOrder.length === 1){
    matchingResult = filteredBySortOrder[0];
  }
  return matchingResult;
}