import { ExampleCodeJSON } from "@/ui-base/components/ui/code";
import DevButton from "@/ui-base/components/ui/developer/devButton";
import { ComponentDataProps } from "@/ui-base/lib/services/data/componentMetaDataService";
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig";
import { filterFirstSubComponentData } from "@/ui-base/lib/util/filterTools";
import { Suspense } from "react";

const log = getLogger("ui-base.cms.heartcore.content.featurethreeImages");

export function featurethreeImagesComponent(data:ComponentDataProps) {
    log.trace("featurethreeImages data passed in:", JSON.stringify(data));

    let matchingData = data.componentData;

    if(!matchingData) { 
      matchingData = {};
    }

    data.componentMetaData.dataProvided = matchingData;

    return (
      <>
        <div className="relative w-full">   
          <Suspense><DevButton metaData={data.componentMetaData} /></Suspense>
          <h6>Feature Three Images Component</h6>
          <div className="w-full break-after-auto py-4">
            Developer Please Connect up the data to components to complete the page:
            <ExampleCodeJSON language="json">{matchingData}</ExampleCodeJSON>
          </div>        
        </div>
      </>
    );   
}

function populateMetaData(data: ComponentDataProps) {
  
  data.componentMetaData.dataProvided = data.componentData;
  // Get the relative path of the current file
  data.componentMetaData.rendering = "ui-base/lib/cms/heartcore/content/components/featurethreeImages/featurethreeImagesComponent.tsx";
  // Get the name of the current function
  data.componentMetaData.renderingExportFunction = "featurethreeImagesComponent";
}
  
  