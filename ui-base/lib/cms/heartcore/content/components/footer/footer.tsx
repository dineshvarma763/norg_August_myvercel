import { ExampleCodeJSON } from "@/ui-base/components/ui/code";
import DevButton from "@/ui-base/components/ui/developer/devButton";
import { ComponentDataProps } from "@/ui-base/lib/services/data/componentMetaDataService";
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig";
import { Suspense } from "react";

const log = getLogger("ui-base.cms.heartcore.content.footer");

export function footerComponent(data:ComponentDataProps) {
    log.trace("footer data passed in:", JSON.stringify(data));

    data.componentMetaData.dataProvided = data.componentData;

    return (
      <>
        <div className="relative w-full">   
          <Suspense><DevButton metaData={data.componentMetaData} /></Suspense>
          <h6>Footer Component</h6>
          <div className="w-full break-after-auto py-4">
            Developer Please Connect up the data to components to complete the page:
            <ExampleCodeJSON language="json">{data.componentData}</ExampleCodeJSON>
          </div>        
        </div>
      </>
    );   
}
  
  