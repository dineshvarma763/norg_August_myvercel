
import DevButton from "@/ui-base/components/ui/developer/devButton";
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig";
import { getSectionBackgroundColour } from "@/ui-base/lib/util/getSectionBackgroundColour";
import AccordionClientLoader from "./accordionClientLoader";
import { GetSite } from "@/ui-base/lib/services/siteContextService";
import { GetDynamicServerComponent } from "@/ui-base/lib/services/pageToSiteContextService";
import { ComponentDataProps } from "@/ui-base/lib/services/data/componentMetaDataService";
import { Suspense } from "react";

const log = getLogger("ui-base.cms.heartcore.content.accordion");

export default function accordionComponent(data: ComponentDataProps) {
  log.trace("testimonial data passed in:", JSON.stringify(data));

  populateMetaData(data);
  let matchingData = data.componentData;

  if (!matchingData) {
    matchingData = {};
  }

  data.componentMetaData.dataProvided = matchingData;

  const accordionData = [];

  matchingData?.children?.edges?.map(({ node: item }, index) => {
    log.trace("accordionComponent : renderQuery ------------------------------------- ", item.__typename);
    const subComponentRelatedData = { componentData: item?.componentData, componentMetaData: item?.componentMetaData };
    const Component = GetDynamicServerComponent({siteName : GetSite().name});
    const name = item.name;
    const typeName = item.__typename;
    const renderedComponent = (<Component data={subComponentRelatedData} globalData={data.globalData} componentId={typeName} />);
    accordionData.push({name, renderedComponent});
  });


  return (
    <>
      <div className={`w-full ${getSectionBackgroundColour(matchingData?.backgroundColour, "")} py-6`}>
        <div className="relative w-full container">
          <Suspense><DevButton metaData={data.componentMetaData} /></Suspense>
          <div className="my-4">
            <AccordionClientLoader accordionData={accordionData} globalData={data.globalData} />
          </div>
        </div>
      </div>
    </>
  );
}


function populateMetaData(data: ComponentDataProps) {

  data.componentMetaData.dataProvided = data.componentData;
  // Get the relative path of the current file
  data.componentMetaData.rendering = "ui-base/lib/cms/heartcore/content/components/accordion/accordionComponent.tsx";
  // Get the name of the current function
  data.componentMetaData.renderingExportFunction = "accordionComponent";
}

