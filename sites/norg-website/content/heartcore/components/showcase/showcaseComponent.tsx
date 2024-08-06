import { Suspense } from "react"
import RenderShowcase from "@/sites/norg-website/components/RenderShowcase"
import ShowCaseV2 from "@/sites/norg-website/components/ShowCaseV2"

import DevButton from "@/ui-base/components/ui/developer/devButton"
import { ComponentDataProps } from "@/ui-base/lib/services/data/componentMetaDataService"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"

const log = getLogger("sites.norg-website.content.showcase")

export default function showcaseComponent(data) {
  log.trace("showcaseComponent data passed in:", JSON.stringify(data))
  populateMetaData(data)

  if (!data) return null

  switch (data.componentMetaData.variant) {
    case "Showcase - V2":
      return (
        <>
          <Suspense>
            <DevButton metaData={data.componentMetaData} />
          </Suspense>
          <ShowCaseV2 data={data.componentData} />
        </>
      )
    default:
      return (
        <div className="border-1 rounded-30 border-gray-700 bg-my-white3 px-[30px] pb-[46px] pt-[66px] backdrop-blur-lg">
          <Suspense>
            <DevButton metaData={data.componentMetaData} />
          </Suspense>

          <h1>
            {data.componentMetaData.title
              ? data.componentMetaData.title
              : "Showcase"}
          </h1>

          <div className="flex flex-col-reverse rounded-5px bg-white p-6 text-black sm:p-10 lg:pl-14 xl:flex-row">
            <RenderShowcase data={data.componentData} />
          </div>
        </div>
      )
  }
}

function populateMetaData(data: ComponentDataProps) {
  data.componentMetaData.dataProvided = data.componentData
  // Get the relative path of the current file
  data.componentMetaData.rendering =
    "sites/norg-website/content/heartcore/components/showcase/showcaseComponent.tsx"

  // Get the name of the current function
  data.componentMetaData.renderingExportFunction = "showcaseComponent"
}
