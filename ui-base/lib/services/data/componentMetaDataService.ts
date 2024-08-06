import { GraphQLQueryLookupResult } from "../../interfaces/GraphQLQueryLookupResult";
import { SubComponentDefinition, lookupComponentVariant } from "../components/pageSubComponentDataService";
import { LanguageSite } from "../../interfaces/LanguageSite";

export function getComponentMetaData():ComponentMetaData {
    const result:ComponentMetaData = {      
      variant: "",
      name: "",
      queryFileLocation: "",
      query: "",
      rendering : "",
      id: "",
      url: "",
      typeName: "",
      dataProvided: {},
      liveDocumentation: "",
      youtubeVideo: "",
      lastUpdated: "",
      renderingExportFunction:"",
      isInsideGrid: false,
      isClientSide: false,
    };
    return result;
  } 
  
  export function populateGraphqlMetaData(graphqlQuery:GraphQLQueryLookupResult, item:SubComponentDefinition) {
    let componentMetaData = getComponentMetaData();
    componentMetaData.queryFileLocation = graphqlQuery.fileLookupResult.matchingPath;
    componentMetaData.query = graphqlQuery.fileLookupResult.queryString;
    componentMetaData.id = item.id;
    componentMetaData.name = item.name;
    componentMetaData.typeName = item.__typename;
    componentMetaData.url = item.url;    
    componentMetaData.variant = lookupComponentVariant(graphqlQuery, item?.sortOrder);
    componentMetaData.isClientSide = graphqlQuery?.fileLookupResult?.isClientSide;
    if(graphqlQuery?.result?.componentDocumentation)
      componentMetaData.liveDocumentation = graphqlQuery.result.componentDocumentation;
    if(graphqlQuery?.result?.youtubeVideo)
      componentMetaData.youtubeVideo = graphqlQuery.result.youtubeVideo;
    if(graphqlQuery?.result?.lastUpdated)
      componentMetaData.lastUpdated = graphqlQuery.result.lastUpdated;
    return componentMetaData;
  }  
  
  export interface ComponentDataProps {
    id?: string;
    componentData: any;
    componentMetaData: ComponentMetaData;
    globalData?: any;
  }
  
  export interface ComponentMetaData {
    dataProvided: any;
    url: string;
    typeName: string;
    id: string;
    rendering: string;
    variant: string;
    name: string;
    queryFileLocation: string;
    query: string;
    liveDocumentation: string;
    youtubeVideo: string;
    renderingExportFunction: string;
    isInsideGrid: boolean;
    lastUpdated?: string;
    isClientSide: boolean;
    languageSite?: LanguageSite;
  }