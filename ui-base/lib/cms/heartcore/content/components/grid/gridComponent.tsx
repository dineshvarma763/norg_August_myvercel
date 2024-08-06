import DevButton from "@/ui-base/components/ui/developer/devButton";
import { ComponentDataProps } from "@/ui-base/lib/services/data/componentMetaDataService";
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig";
import UmbracoFlexGrid from "../../../umbraco-heartcore-grid";
import { getGridColour } from "../../../tools/colourTools";
import { Suspense } from "react";

const log = getLogger("ui-base.cms.heartcore.content.grid");

export default function gridComponent(data:ComponentDataProps) {
    log.trace("gallery data passed in:", JSON.stringify(data));

    populateMetaData(data);
    const colourClass = getGridColour(data.componentData?.backgroundColour);
    return (
      <>
        <div className="invisible bg-my-grey"></div>
        <div className={`relative w-full ${colourClass}`}>   
          <Suspense><DevButton metaData={data.componentMetaData} /></Suspense>
          <div className="w-full container break-after-auto py-4">
            <UmbracoFlexGrid name="Grid" sections={data.componentData?.body?.sections} mainData={data.componentData} variant={data.componentMetaData.variant} languageSite={data?.globalData?.languageSite} />
          </div>        
        </div>
      </>
    );   
}

function populateMetaData(data: ComponentDataProps) {
  
  data.componentMetaData.dataProvided = data.componentData;
  // Get the relative path of the current file
  data.componentMetaData.rendering = "ui-base/lib/cms/heartcore/content/components/grid/gridComponent.tsx";
  // Get the name of the current function
  data.componentMetaData.renderingExportFunction = "gridComponent";
}
  
  
  