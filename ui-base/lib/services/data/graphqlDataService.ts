import { fetchAPIGatewayWrapper } from "./cmsDataQueryGateway"
import {
  DynamicDataCmsProperties,
} from "../../cms/constants"
import { GetSite } from "../siteContextService";
import { getLogger } from "../logging/LogConfig";
import { PageIdentifier } from "../../interfaces/PageIdentifier";
import { LanguageSite } from "../../interfaces/LanguageSite";
import { FileLookupResult } from "../../interfaces/FileLookupResult";
import { GraphQLQueryLookupResult } from "../../interfaces/GraphQLQueryLookupResult";

export const log = getLogger("headless.graphqlDataService");

export async function getDynamicCmsDataViaCmsSelector(
  lookupDetails: DynamicDataCmsProperties,
  pageIdentifier?: PageIdentifier,
  slug?: string,
  languageSite?: LanguageSite,
  isSiteComponent: boolean = false,
  sortOrder?: number,
  useCache?: boolean
): Promise<GraphQLQueryLookupResult> {

  const variant = process.env.NEXT_PUBLIC_CMS_VARIANT
  const queryHasVariables = lookupDetails.queryHasVariables
  const queryExport = lookupDetails.snippetExport
  const snippitLocation = lookupDetails.snippetLocation
  const snippetFileName = lookupDetails.snippetFileName
  const dataFunctionMapperName = lookupDetails.dataFunctionMapperName

  let queryResult = undefined;
  let siteName = (await GetSite()).name;
  let fileLookupResult;
  let variableFunc;
  let dataMapper;

  try {
    fileLookupResult = await performFileLocationLookup(`../../../../sites/${siteName}/graphql/${variant}/${snippitLocation}/${snippetFileName}`, 
    `../../cms/${variant}/graphql/${snippitLocation}/${snippetFileName}` 
    , siteName, variant, snippitLocation, snippetFileName, queryExport, 
    "graphql", lookupDetails.isClientSide);

    let query = fileLookupResult.query;

    if (queryHasVariables && typeof pageIdentifier !== "undefined") {
      queryResult = query(pageIdentifier, languageSite)
    } else if (queryHasVariables && typeof slug !== "undefined") {
      queryResult = query(slug, languageSite)
    } else {
      queryResult = query
    }

    const module = isSiteComponent
      ? await import(`../../../../sites/${siteName}/graphql/${variant}/${snippitLocation}/${snippetFileName}`)
      : await import(`../../cms/${variant}/graphql/${snippitLocation}/${snippetFileName}`);

    variableFunc = module[lookupDetails.variableFunction];
    dataMapper = module[dataFunctionMapperName];

  } catch (err) {
    log.error("query module import error - graphql", dataFunctionMapperName, err)
		return null;
  }

  let variables = { variables: {}, preview: false, component: snippetFileName }
  if (queryHasVariables) {
    log.trace("inside variable sender pageIdentifier", pageIdentifier);

    if(typeof variableFunc !== "function"){
      log.error("variableFunc called variables() is not a function --- ", snippetFileName);
			return null;
    }

    if (typeof pageIdentifier !== "undefined") {
      variables = { variables: variableFunc(pageIdentifier, languageSite), preview: false, component: snippetFileName }
    } else if (typeof slug !== "undefined") {
      variables = { variables: variableFunc(slug, languageSite), preview: false, component: snippetFileName }
    }

    log.trace("variables --", variables)
    if(variables !== undefined && JSON.stringify(variables?.variables) === "{}"){
      log.warn("variables are empty -- ", `${fileLookupResult.matchingPath} > ${queryExport}()`);
    }
  }

  if(queryResult === undefined){
    log.error("query failure -- ", `${fileLookupResult.matchingPath} > ${queryExport}()`);
  }else if(queryResult.name !== undefined) {
    log.error("query component may have failed", queryResult.name, slug, pageIdentifier, fileLookupResult.matchingPath);
  }

  // Process the query call
  const data = await fetchAPIGatewayWrapper(queryResult, variables, useCache);

  // Lookup the data mapper function dynamically and process the data.  This is equivalent to filtering the data per CMS.
  const result = await dataMapper(data, pageIdentifier, languageSite, sortOrder)

  return {result, fileLookupResult};
}

// This file is used to lookup the location of the graphql snippet file.  
// This is used to support the ability to override the graphql snippet file in the site folder.
export async function performFileLocationLookup(
  path1: string,
  path2: string,
  siteName: string,
  variant: string,
  snippitLocation: string,
  snippetFileName: string,
  queryExport: string,
  source: string,
  isClientSide: boolean
): Promise<FileLookupResult> {
  let query;
  let matchingPath = "Unknown";
  let module;

  try {
    log.trace(`attempting first lookup - render ${source}`, path1);
    module = await import(
      `../../../../sites/${siteName}/${source}/${variant}/${snippitLocation}/${snippetFileName}`
    );
    query = module[queryExport];
    log.trace(`first lookup success - render ${source}`, path1);
    matchingPath = path1;
  } catch (error) {
    log.trace(`attempting second lookup - ${source}`, path2);
    if (error.code === 'MODULE_NOT_FOUND') {
      try {
        module = await import(
          `../../cms/${variant}/${source}/${snippitLocation}/${snippetFileName}`
        );
        query = module[queryExport];
        log.trace(`function render -- pass 2 -- ${source} success`, path2);
        matchingPath = path2;
      } catch (error2) {
        log.error(`function render -- pass 2 -- ${source} failed`, path2);
        throw error2;
      }
    } else {
      log.error(`function render ${source} failed`);
      throw error;
    }
  }

  let queryString = "Unknown";
  if(query)
    queryString = query.toString();

  return {query: query, matchingPath: matchingPath, queryString: queryString, isClientSide};
}

