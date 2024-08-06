import { LanguageSite } from "../../interfaces/LanguageSite";
import { ComponentDataProps, populateGraphqlMetaData } from "../data/componentMetaDataService";
import { getDynamicCmsDataViaCmsSelector } from "../data/graphqlDataService";
import { GraphQLQueryLookupResult } from "../../interfaces/GraphQLQueryLookupResult";
import { getLogger } from "../logging/LogConfig";
import { GetDataLocation } from "./pageComponentDataLocationService";


const log = getLogger("headless.services.components.pageSubComponentDataService");

// [{"name":"US Search","id":"05f9c8db-818d-4d00-b1ba-0401925c4212","url":"/us-homepage/search/_components/us-search/","__typename":"SiteSearch"}]
export async function LoadAllSubComponentData(pageComponentData, SUBCOMPONENT_CONTENT, slug:string, languageSite:LanguageSite) {
    log.debug("LoadAllSubComponentData > ", slug);
    const data = pageComponentData[SUBCOMPONENT_CONTENT];
    if(data?.length && data.length > 0){
      await Promise.all(data.map(async (item) => {
        if(item.__typename){
          log.trace("LoadAllSubComponentData > ", slug, item.__typename.toLowerCase());
          const sortOrder = item.sortOrder ? item.sortOrder : 0;
          const singleComponentResult = await loadSingleComponentGraphQLData(item, slug, item.__typename.toLowerCase(), languageSite);
          if(singleComponentResult){
            const specialOrder = singleComponentResult?.componentData?.order ? singleComponentResult?.componentData?.order : 'Top'; // This is either Top or Bottom. It is used for special cases where the pages contain a mix of Fixed and Dynamic components
            item.order = specialOrder;
            const property = item.__typename.toLowerCase() +"-"+ sortOrder;          
            pageComponentData[property] = singleComponentResult;
            log.trace("LoadAllSubComponentData > ", slug);
          }
        }
      }));
    }
  }

  export async function loadSingleComponentGraphQLData(item, slug:string, typename:string, languageSite:LanguageSite):Promise<ComponentDataProps>{
    const dataQueryLocation = await GetDataLocation(typename);
    if(dataQueryLocation?.componentLocation){

      let variableForQuery = item.id;
      if(dataQueryLocation?.componentLocation?.queryUsingSlug){
        variableForQuery = slug;
      }

      log.debug("pageSubComponentDataService.ts 62 > LoadAllSubComponentData > ", slug, "Loading data for ", typename, " using ", dataQueryLocation.componentLocation, " with isSiteComponent ", dataQueryLocation.isSiteComponent);
			const lookupComponentResult = await getDynamicCmsDataViaCmsSelector(
					dataQueryLocation.componentLocation,
					undefined,
					variableForQuery,
					languageSite,
					dataQueryLocation.isSiteComponent,
					item.sortOrder
				);
			if (lookupComponentResult == null || lookupComponentResult == undefined){
					log.error("Unable to load component: " , dataQueryLocation.componentLocation.identifier);
					return null;
				}
      log.debug(`pageSubComponentDataService.ts 56 > loadSingleComponentGraphQLData > ${slug} > ${lookupComponentResult.fileLookupResult.matchingPath}`);

      const subComponentRelatedData:ComponentDataProps = { componentData: lookupComponentResult.result, componentMetaData : populateGraphqlMetaData(lookupComponentResult, item)};

      return subComponentRelatedData;
    }else {
      log.error("pageSubComponentDataService.ts 62 > LoadAllSubComponentData > ", slug, "Could not find a data query location for typename:", typename);
    }
    return null
  }

  export interface SubComponentDefinition{
    __typename:string,
    id:string,
    name:string,
    url:string
    variant?:string
    sortOrder:number
  }

  export function lookupComponentVariant(lookupComponentResult: GraphQLQueryLookupResult, sortOrder): any {
    
    let itemToSearch = null;
    let result = "Unknown";
    
    if (Array.isArray(lookupComponentResult?.result))
    {    
      if (Array.isArray(lookupComponentResult?.result) && lookupComponentResult?.result.length === 1) {
        itemToSearch = lookupComponentResult.result[0];
      } else if (Array.isArray(lookupComponentResult?.result) && lookupComponentResult?.result.length > 1) {
        // Search inside the array for a matching sortOrder
        itemToSearch = lookupComponentResult.result.find((item) => {
            return sortOrder && item?.sortOrder === sortOrder;
          }
        );
      }
    }

    if(typeof(itemToSearch) === "undefined" || itemToSearch === null){
      itemToSearch = lookupComponentResult?.result;
    }

    if(itemToSearch?.selectableVariant)
    {
      result = itemToSearch?.selectableVariant;
    }
    return result;
  }

