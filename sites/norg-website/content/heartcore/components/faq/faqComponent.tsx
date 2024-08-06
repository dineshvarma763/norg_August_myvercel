import { Suspense } from "react"

import AccordionFaqLoader from "@/ui-base/components/ui/accordion/accordionLoader"
import DevButton from "@/ui-base/components/ui/developer/devButton"
import { ComponentDataProps } from "@/ui-base/lib/services/data/componentMetaDataService"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { getSectionBackgroundColour } from "@/ui-base/lib/util/getSectionBackgroundColour"

const log = getLogger("ui-base.cms.heartcore.content.faq")

export default function faqComponent(data: ComponentDataProps) {
  log.trace("faq data passed in:", JSON.stringify(data))
  populateMetaData(data)
  let matchingData = data.componentData

  if (!matchingData) {
    matchingData = {}
  }

  let faqList = matchingData.faqsList

  return (
    <>
      <div
        id="faqs"
        className="container relative my-1 w-full pb-24 pt-14 font-urbanist text-my-brown-grey md:mb-2 md:mt-0 md:pb-28 md:pt-20"
      >
        <Suspense>
          <DevButton metaData={data.componentMetaData} />
        </Suspense>
        <div className="">
          <AccordionFaqLoader
            faqList={faqList}
            languageSite={data.globalData?.languageSite}
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
    "sites/norg-website/content/heartcore/components/faq/faqComponent.tsx"
  // Get the name of the current function
  data.componentMetaData.renderingExportFunction = "faqComponent"
}
