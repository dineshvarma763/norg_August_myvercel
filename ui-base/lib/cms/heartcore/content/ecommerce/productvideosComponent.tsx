import React, { Suspense } from "react"

import DevButton from "@/ui-base/components/ui/developer/devButton"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { ComponentDataProps } from "@/ui-base/lib/services/data/componentMetaDataService"
import { IconDownloadCTA } from "@/sites/norg-website/content/heartcore/components/ctalist/ctalistComponent"
import { getSectionBackgroundColour } from "@/ui-base/lib/util/getSectionBackgroundColour"

const log = getLogger("ui-base.cms.heartcore.content.productvideos")

export default function productdownloadsComponent(data: ComponentDataProps) {
  // log.debug("productvideos data passed in:", JSON.stringify(data))

  populateMetaData(data);

  const product = data?.componentData.productPicker;
  const backgroundColour = data?.componentData?.backgroundColour;

  return (
    <div className={`w-full ${getSectionBackgroundColour(backgroundColour, "")}`}>
      <div className=" w-full container">
      <Suspense><DevButton metaData={data.componentMetaData} /></Suspense>
      {product?.productVideos && product.productVideos.length > 0 && (
        <div className="py-12">
          <h2 className="text-center text-my-brown-grey font-urbanist font-800 text-3xl leading-h4 md:text-h3 md:leading-h3 mb-14">Product Videos</h2>
          {product?.productVideos.map((video, index) => (
            <div key={index} className="my-8 aspect-video w-full h-48 sm:h-auto lg:h-168">
              <iframe
                title={`Video ${index}`}
                className="h-full w-full"
                src={video.url.replace("watch?v=", "embed/")}
                allowFullScreen
              ></iframe>
            </div>
          ))}
        </div>
      )}
       </div>
    </div>
  )
}

function populateMetaData(data: ComponentDataProps) {
  data.componentMetaData.dataProvided = data.componentData
  // Get the relative path of the current file
  data.componentMetaData.rendering ="ui-base/lib/cms/heartcore/content/ecommerce/productvideosComponent.tsx"
  // Get the name of the current function
  data.componentMetaData.renderingExportFunction = "productvideosComponent"
}
