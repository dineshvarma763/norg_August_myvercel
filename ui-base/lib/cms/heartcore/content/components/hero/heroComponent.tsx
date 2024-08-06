import { ExampleCodeJSON } from "@/ui-base/components/ui/code";
import DevButton from "@/ui-base/components/ui/developer/devButton";
import { ComponentDataProps } from "@/ui-base/lib/services/data/componentMetaDataService";
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig";
import { filterFirstSubComponentData } from "@/ui-base/lib/util/filterTools";
import dynamic from 'next/dynamic';
import { Suspense } from "react";

const log = getLogger("ui-base.cms.heartcore.content.hero");

const DynamicHero = dynamic(() => import('./heroComponent'), {
  loading: () => <p>Loading...</p>,
});
 
export default function heroComponentDynamic() {
  return <DynamicHero />;
}

export function heroComponent(data:ComponentDataProps) {
    log.trace("hero data passed in:", JSON.stringify(data));

    let matchingData = filterFirstSubComponentData(data.componentData, 'Hero');

    if(!matchingData) { 
      matchingData = {};
    }

    data.componentMetaData.dataProvided = matchingData;

    return (
      <>
        <div className="relative w-full">   
          <Suspense><DevButton metaData={data.componentMetaData} /></Suspense>
          <h6>Hero Component</h6>
          <div className="w-full break-after-auto py-4">
            Developer Please Connect up the data to components to complete the page:
            <ExampleCodeJSON language="json">{matchingData}</ExampleCodeJSON>
          </div>        
        </div>
      </>
    );   
}
  
  