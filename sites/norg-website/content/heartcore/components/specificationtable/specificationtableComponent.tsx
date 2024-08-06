import DevButton from "@/ui-base/components/ui/developer/devButton";
import { getSpecificationsTableComponent } from "@/ui-base/components/ui/ecommerce/Product";
import { ComponentDataProps } from "@/ui-base/lib/services/data/componentMetaDataService";
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig";
import { Suspense } from "react";

const log = getLogger("ui-base.cms.heartcore.content.specificationsTableComponent.tsx");

export default function specificationtableComponent(data: ComponentDataProps) {
  log.trace("motto data passed in:", JSON.stringify(data))

  populateMetaData(data);

  return (
    <div className="w-full container mt-6" id="specifications">
      <Suspense><DevButton metaData={data.componentMetaData} /></Suspense>
      {getSpecificationsTableComponent(data.componentData.specifications)}
    </div>
  )
}

function populateMetaData(data: ComponentDataProps) {

  data.componentMetaData.dataProvided = data.componentData;
  // Get the relative path of the current file
  data.componentMetaData.rendering = "sites/norg-website/content/heartcore/components/specificationstable/specificationstableComponent.tsx";
  // Get the name of the current function
  data.componentMetaData.renderingExportFunction = "specificationstableComponent";
}
