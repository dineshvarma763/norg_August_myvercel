
import { ComponentDataProps } from "@/ui-base/lib/services/data/componentMetaDataService";
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig";
import { DetectAndRenderSiteSearch } from "@/ui-base/lib/services/search/searchRenderService";

const log = getLogger("ui-base.cms.heartcore.content.sitesearch");

export default function sitesearchComponent(data:ComponentDataProps) {
  log.trace("sitesearch data passed in:", JSON.stringify(data));
  populateMetaData(data);
  return (
    <>
    <DetectAndRenderSiteSearch data={data} languageSite={data?.globalData?.languageSite} />
    </>
  );  
}

function populateMetaData(data: ComponentDataProps) {
  
  data.componentMetaData.dataProvided = data.componentData;
  // Get the relative path of the current file
  data.componentMetaData.rendering = "ui-base/lib/cms/heartcore/content/sitesearch/sitesearchComponent.tsx";
  // Get the name of the current function
  data.componentMetaData.renderingExportFunction = "sitesearchComponent";
}
  
  