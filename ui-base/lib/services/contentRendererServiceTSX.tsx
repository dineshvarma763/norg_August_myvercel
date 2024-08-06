import { RenderATADynamicClientImport } from "@/sites/norg-website/content/heartcore/components/DynamicClientImportsMap";
import { CmsVariants, PageVariant, SUBCOMPONENT_CONTENT } from "../cms/constants";
import { PageIdentifier } from "../interfaces/PageIdentifier";
import { GetCMS } from "./cmsContextService";
import { ComponentDataProps } from "./data/componentMetaDataService";
import { getLogger } from "./logging/LogConfig";
import { GetDynamicClientComponent, GetDynamicServerComponent } from "./pageToSiteContextService";
import { RenderATADynamicServerImport } from "@/sites/norg-website/content/heartcore/components/DynamicServerImportsMap";

const log = getLogger("headless.contentRendererServiceTSX");

type SubComponentProps = {
  data: any,
  location?: 'Top' | 'Bottom',
};

type RenderSubComponentContentProps = {
  pageVariant: PageVariant,
  data: any,
  globalData: any,
  location?: 'Top' | 'Bottom',
};

export const PageSubComponents: React.FC<SubComponentProps> = ({ data, location = 'Top' }) => {
  let subComponentContent = (<></>);

  if(data?.data?.pageComponentData && data?.data?.pageComponentData.hasOwnProperty(SUBCOMPONENT_CONTENT) && data?.data?.pageComponentData[SUBCOMPONENT_CONTENT]){
    subComponentContent = (<>
    <RenderSubComponentContent
      pageVariant={data?.data?.pageVariant}
      data={data?.data?.pageComponentData}
      globalData={data?.data}
      location={location}/>
      </>);
  }

  return subComponentContent;
};

function fixInvalidColours(colour: string)
{
  if (colour === null || colour === undefined || colour === "")
  {
    colour = "111928";
  }
  return colour;
}

// Version 3
export const RenderSubComponentContent: React.FC<RenderSubComponentContentProps> = ({ pageVariant, data, globalData, location = 'Top' }) => {
  const cmsVariant = GetCMS();
  const cmsVariantSelected = CmsVariants.variants[cmsVariant]
  const pageIdentifier = cmsVariantSelected.pageTypes[
    pageVariant
  ] as PageIdentifier;

  let result = null;

  let allSubComponents = data[SUBCOMPONENT_CONTENT];

  // filter the subcomponents by location parameter. For any components without location set add them into the 'Top' results.
  // This is useful on pages like a Product page, that has a mix of sub-components and Page data that are more structured.
  allSubComponents = allSubComponents.filter((element) => {
    if(element.order === location){
      return true;
    }
    if(!element.order){
      return location === 'Top';
    }
    return false;
  });

  let prevBackgroundColour = "ffffff";

  allSubComponents.forEach((element, index) => {
    // const location = GetDataLocation(element.__typename);

    // if(!location.componentLocation){
    //   return;
    // }
    let sortOrder = element.sortOrder ? element.sortOrder : 0;
    const subComponentRelatedData = data[element.__typename.toLowerCase() + "-" + sortOrder] as ComponentDataProps;
		if (subComponentRelatedData == undefined ||
			subComponentRelatedData == null)
			return;
		// console.log("subComponentRelatedData : " , subComponentRelatedData);

    let currentBackgroundColour = subComponentRelatedData?.componentData?.backgroundColour;
    // console.log("Current background colour: " , currentBackgroundColour);

    currentBackgroundColour = fixInvalidColours(currentBackgroundColour);
    // console.log("Current background colour fixed: " , currentBackgroundColour);
    let nextBackgroundColour = null;
    if (index + 1 < allSubComponents.length) {
      let nextElement = allSubComponents[index + 1];
      let nextSortOrder = nextElement.sortOrder ? nextElement.sortOrder : 0;
      let nextData = data[nextElement.__typename.toLowerCase() + "-" + nextSortOrder] as ComponentDataProps;
      nextBackgroundColour = nextData?.componentData?.backgroundColour;
    }

    nextBackgroundColour = fixInvalidColours(nextBackgroundColour);
		if (subComponentRelatedData.componentData == null || subComponentRelatedData.componentData == undefined)
			return;

    // Append background color information directly into subComponentRelatedData
    subComponentRelatedData.componentData.prevBackgroundColour = prevBackgroundColour;
    subComponentRelatedData.componentData.nextBackgroundColour = nextBackgroundColour;

    let Component:any = ( <></>);
    if (subComponentRelatedData?.componentMetaData?.isClientSide) {
      Component = GetDynamicClientComponent({ siteName: globalData.siteName });
    } else {
      Component = GetDynamicServerComponent({ siteName: globalData.siteName });
    }

    result = (
      <>
	{result}
	<Component
      data={subComponentRelatedData}
      globalData={globalData}
      componentId={element.__typename}
	/>
	</>
    );

    prevBackgroundColour = currentBackgroundColour;
  });


  return <>{result}</>;
};

export function GetComponentsByTypeName(data: any, typeName: string) {
  if(data?.data?.pageComponentData && data?.data?.pageComponentData.hasOwnProperty(SUBCOMPONENT_CONTENT) && data?.data?.pageComponentData[SUBCOMPONENT_CONTENT]){
    const subs = data?.data?.pageComponentData[SUBCOMPONENT_CONTENT];
    if(!subs){
      return [];
    }

    const allSubComponents = subs.filter((element) => {
      if(element.__typename === typeName){
        return true;
      }
      return false;
    });
    return allSubComponents;
  }
}
