import { Suspense } from "react"

import DevButton from "@/ui-base/components/ui/developer/devButton"
import {
  ComponentDataProps,
  getComponentMetaData,
} from "@/ui-base/lib/services/data/componentMetaDataService"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { getSectionBackgroundColour } from "@/ui-base/lib/util/getSectionBackgroundColour"

const log = getLogger("ui-base.cms.heartcore.content.richtextComponent")

export default function richtextComponent(data: ComponentDataProps) {
  log.trace("gallery data passed in:", JSON.stringify(data))

  let newData = Object.assign({}, data)

  if (!newData.componentMetaData) {
    newData.componentMetaData = getComponentMetaData()
  }
  populateMetaData(newData)

  return (
    <>
      <div className={`rich-text relative w-full`}>
        <Suspense>
          <DevButton metaData={data.componentMetaData} />
        </Suspense>
        <div className="invisible bg-my-grey text-h1 text-h2 text-h3 text-h4 text-h5" />
        <div className="container w-full break-after-auto py-4">
          <div
            dangerouslySetInnerHTML={{
              __html: newData.componentData?.processedBody,
            }}
          />
        </div>
      </div>
    </>
  )
}

function populateMetaData(data: ComponentDataProps) {
  data.componentMetaData.dataProvided = data.componentData
  // Get the relative path of the current file
  data.componentMetaData.rendering =
    "ui-base/lib/cms/heartcore/content/components/richtext/richtextComponent.tsx"
  // Get the name of the current function
  data.componentMetaData.renderingExportFunction = "richtextComponent"
}
