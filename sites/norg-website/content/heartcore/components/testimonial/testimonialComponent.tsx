import { Suspense } from "react"

import DevButton from "@/ui-base/components/ui/developer/devButton"
import { ComponentDataProps } from "@/ui-base/lib/services/data/componentMetaDataService"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import TestimonialClientLoader from "./testimonialClientLoader"

const log = getLogger("ui-base.cms.heartcore.content.testimonial")

export default function testimonialComponent(data: ComponentDataProps) {
  log.trace("testimonial data passed in:", JSON.stringify(data))

  populateMetaData(data)
  let matchingData = data.componentData
  let childPageTestimonial: any;
  let targetPage: any;
  let dataSource: any;
  let pageVisitCount: any;

  if(data.componentData.isPersonalisationEnabled){
    childPageTestimonial = matchingData.children.edges
    dataSource = matchingData.targets[0].content.dataSource
    pageVisitCount = matchingData.targets[0].content.targetNumber
    targetPage = matchingData.targets[0].content.targetPage
  }

  if (!matchingData) {
    matchingData = {}
  }  

  data.componentMetaData.dataProvided = matchingData

  return (
    <>
      <div
        className={`relative w-full py-12 font-inter md:py-28`}
        id="testimonials"
      >
        <Suspense>
          <DevButton metaData={data.componentMetaData} />
        </Suspense>
        <div className="w-full pb-4 pt-0 md:py-4" data-carousel="slide">
          <TestimonialClientLoader
            pageTestimonial={matchingData.pageTestimonial}
            testimonialChildContent = {childPageTestimonial}
            dataSource = {dataSource}
            pageVisitCount = {pageVisitCount}
            targetPage = {targetPage}
            variant={data.componentData.selectableVariant}
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
    "sites/norg-website/content/heartcore/components/testimonial/testimonialComponent.tsx"
  // Get the name of the current function
  data.componentMetaData.renderingExportFunction = "testimonialComponent"
}
