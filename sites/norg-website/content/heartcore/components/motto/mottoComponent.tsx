import { Fragment, Suspense } from "react"

import DevButton from "@/ui-base/components/ui/developer/devButton"
import { ComponentDataProps } from "@/ui-base/lib/services/data/componentMetaDataService"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { alignmentClasses } from "@/ui-base/lib/util/utils"

const log = getLogger("sites.norg-website.content.motto")

export default function mottoComponent(data: ComponentDataProps) {
  log.trace("motto data passed in:", JSON.stringify(data))

  populateMetaData(data)

  return (
    <div className="w-full">
      <Suspense><DevButton metaData={data.componentMetaData} /></Suspense>
      {/* <h6>Motto Component Site Only</h6>
      <div className="w-full break-after-auto py-4">
        Developer Please Connect up the data to components to complete the page:
        <ExampleCodeJSON language="json">{matchingData}</ExampleCodeJSON>
      </div> */}
      {/* Render a component that renderings matchingData.words  as a full screen, blue background, component.  words contains three words, each followed by a full stop. The full stops must be orange
       */}
      <CustomText
        text={data.componentData.words}
        align={data.componentData?.align}
      />
    </div>
  )
}

const CustomText = ({ text, align }) => {
  const { textAlignClass } = alignmentClasses({ align: align || "center" })
  const words = text.split(".").map((word, index, arr) => {
    const isLastWord = index === arr.length - 1
    return isLastWord ? (
      <Fragment key={index}>{word}</Fragment>
    ) : (
      <Fragment key={index}>
        {word}
        <span className="mr-4 text-my-yellow last:mr-0 lg:mr-20">.</span>
      </Fragment>
    )
  })

  return (
    <div className=" w-full break-after-auto bg-my-blue py-8 font-urbanist uppercase">
      <h2
        className={`w-full py-2 font-urbanist text-h4 font-800 leading-h4 text-white sm:container lg:py-12 lg:text-h2 lg:leading-h2 ${textAlignClass}`}
      >
        {words}
      </h2>
    </div>
  )
}

function populateMetaData(data: ComponentDataProps) {
  data.componentMetaData.dataProvided = data.componentData
  // Get the relative path of the current file
  data.componentMetaData.rendering =
    "sites/norg-website/content/heartcore/components/motto/mottoComponent.tsx"
  // Get the name of the current function
  data.componentMetaData.renderingExportFunction = "mottoComponent"
}
