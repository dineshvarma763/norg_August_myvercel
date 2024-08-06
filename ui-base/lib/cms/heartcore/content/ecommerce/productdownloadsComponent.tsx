import React, { Suspense } from "react"

import DevButton from "@/ui-base/components/ui/developer/devButton"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { ComponentDataProps } from "@/ui-base/lib/services/data/componentMetaDataService"
import { IconDownloadCTA } from "@/sites/norg-website/content/heartcore/components/ctalist/ctalistComponent"
import { getSectionBackgroundColour } from "@/ui-base/lib/util/getSectionBackgroundColour"

const log = getLogger("ui-base.cms.heartcore.content.productdownloads")

export default function productdownloadsComponent(data: ComponentDataProps) {
  log.debug("productdownloads data passed in:", JSON.stringify(data))
  log.debug("productdownloads", data.componentData)

  populateMetaData(data);

  const product = data?.componentData?.productPicker;
  const backgdoundColur = data?.componentData?.backgroundColour;
  return (
    <div className={`w-full  ${getSectionBackgroundColour(backgdoundColur, "")}`}>
      <Suspense><DevButton metaData={data.componentMetaData} /></Suspense>
        {product?.downloads && product?.downloads?.length > 0 ? (
        <IconDownloadCTA data={product} />
      ) : null}
    </div>
  )
}

function populateMetaData(data: ComponentDataProps) {
  data.componentMetaData.dataProvided = data.componentData
  // Get the relative path of the current file
  data.componentMetaData.rendering =
    "ui-base/lib/cms/heartcore/content/ecommerce/productdownloadsComponent.tsx"
  // Get the name of the current function
  data.componentMetaData.renderingExportFunction = "productdownloadsComponent"
}
