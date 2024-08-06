import { performFileLocationLookup } from "./data/graphqlDataService";
import { getLogger } from "./logging/LogConfig";

const log = getLogger("headless.contentRendererService");

export async function getContentQuery(siteName, cmsVariant, snippitLocation, snippetFileName, queryExport, isClientSide)
: Promise<ContentQuery>
{

  const localSitePath = `../../../sites/${siteName}/content/${cmsVariant}/${snippitLocation}/${snippetFileName}`;
  log.trace("localSitePath", localSitePath, queryExport);
  const globalPath = `../cms/${cmsVariant}/content/${snippitLocation}/${snippetFileName}`;
  let fileLookupResult = await performFileLocationLookup(localSitePath, globalPath
                        , 
                        siteName, cmsVariant, snippitLocation, snippetFileName, queryExport, 
                        "content",
                        isClientSide
  );

  let result = fileLookupResult.query;

  return { result, localSitePath, globalPath, matchingPath: fileLookupResult.matchingPath, renderingExportFunction:queryExport};
}

export interface ContentQuery {
  result: any, 
  localSitePath: string, 
  globalPath: string, 
  matchingPath: string , 
  renderingExportFunction: string 
}



