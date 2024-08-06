import { DynamicCmsDataLocations } from "../../cms/constants";
import { getLogger } from "../logging/LogConfig";
import { GetSite } from "../siteContextService";

const log = getLogger("headless.services.components.pageComponentDataLocationService");

export async function GetDataLocation(lowerCaseMatchName){
  lowerCaseMatchName = lowerCaseMatchName.toLowerCase();
  log.trace("GetDataLocation 9 > looking for component data location: ", lowerCaseMatchName);
  let componentLocation = DynamicCmsDataLocations.find(
    (componentLocation) => componentLocation.identifier === lowerCaseMatchName
  )

  let isSiteComponent = false;
  if(!componentLocation){ // Search the individual site context for a match
    const site = await GetSite();
    log.trace("GetDataLocation 17 > componentLocation was null, looking in site components ... GetDataLocation > site > ", lowerCaseMatchName);
    componentLocation = site.getComponentLocations().find(
      (componentLocation) => componentLocation.identifier === lowerCaseMatchName
    )
    if(componentLocation){
      log.trace("GetDataLocation 22 > componentLocation found in the site components list ", lowerCaseMatchName);
      isSiteComponent = true;
    } else {
      log.info("GetDataLocation 25 > componentLocation found in the site components list ", lowerCaseMatchName);
    }
  }
  return { componentLocation, isSiteComponent};
}  
  