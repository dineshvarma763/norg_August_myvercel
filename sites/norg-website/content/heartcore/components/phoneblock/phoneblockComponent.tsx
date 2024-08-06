import { ComponentDataProps } from "@/ui-base/lib/services/data/componentMetaDataService";
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig";
import { filterAndUpdateClass } from "@/ui-base/lib/cms/heartcore/filterAndUpdateClass";
import DevButton from "@/ui-base/components/ui/developer/devButton";
import { Suspense } from "react";

const log = getLogger("ui-base.cms.heartcore.content.phoneblock");

export default function phoneblockComponent(data: ComponentDataProps) {
  log.trace("phoneblock data passed in:", JSON.stringify(data));

  populateMetaData(data);

  let contacTitle = "";
  let contactDetails = "";
  let contactNumber = "";
  let sectionName = "";

  contacTitle = data?.componentData?.contactTitle;
  contactDetails = data?.componentData?.contactDetails;
  contactNumber = data?.componentData?.contactNumber;
  sectionName = data?.componentData?.name;

  return (
    <>
      <div className="container">
        <div className="m-auto bg-gray-100 w-full md:w-72 md:mb-20 mb-24 p-8">
          <Suspense><DevButton metaData={data.componentMetaData} /></Suspense>
          <h2 className="font-urbanist text-base font-800 text-my-blue">{contacTitle}</h2>
          <div className="font-urbanist text-sm font-400 text-my-brown-grey leading-5" dangerouslySetInnerHTML={{ __html: filterAndUpdateClass(contactDetails, data.globalData?.languageSite), }} />
          <div className="font-urbanist font-800 text-base text-white hover:text-my-black uppercase text-center tracking-widest bg-my-blue hover:bg-my-yellow rounded-full w-full p-3 mt-4 inline-block transition"><a href={`tel:${contactNumber}`}>Call {contactNumber}</a></div>
        </div>
      </div>
    </>
  );
}


function populateMetaData(data: ComponentDataProps) {

  data.componentMetaData.dataProvided = data?.componentData;
  // Get the relative path of the current file
  data.componentMetaData.rendering = "sites/norg-website/content/heartcore/components/phoneblock/phoneblockComponent.tsx";
  // Get the name of the current function
  data.componentMetaData.renderingExportFunction = "phoneblockComponent";
}
