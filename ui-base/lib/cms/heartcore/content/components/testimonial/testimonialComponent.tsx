import { ExampleCodeJSON } from "@/ui-base/components/ui/code";
import DevButton from "@/ui-base/components/ui/developer/devButton";
import { ComponentDataProps } from "@/ui-base/lib/services/data/componentMetaDataService";
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig";
import { Suspense } from "react";

const log = getLogger("ui-base.cms.heartcore.content.testimonial");

export function testimonialComponent(data:ComponentDataProps) {
    log.trace("testimonial data passed in:", JSON.stringify(data));

    let matchingData = data.componentData;

    if(!matchingData) { 
      matchingData = {};
    }

    data.componentMetaData.dataProvided = matchingData;

    return (
      <>
        <div className="relative w-full">   
          <Suspense><DevButton metaData={data.componentMetaData} /></Suspense>
          <h6>Testimonial Component</h6>
          <div className="w-full break-after-auto py-4">
            Developer Please Connect up the data to components to complete the page:
            <ExampleCodeJSON language="json">{matchingData}</ExampleCodeJSON>
          </div>        
        </div>
      </>
    );   
}
  
  