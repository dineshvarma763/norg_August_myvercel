import { Fragment, Suspense } from "react"

import DevButton from "@/ui-base/components/ui/developer/devButton"
import FeatureSection, {
  renderMBS,
  renderMDS,
} from "@/ui-base/components/ui/sections/feature-section"
import { ComponentDataProps } from "@/ui-base/lib/services/data/componentMetaDataService"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { alignmentClasses } from "@/ui-base/lib/util/utils"
import CaseStudyComponentSlider from "./casestudySlider"

const log = getLogger("sites.norg-website.content.casestudy")

export default function casestudyComponent(data: ComponentDataProps) {
  log.trace("casestudyComponent data passed in:", JSON.stringify(data))

  populateMetaData(data)

  return (
    <div className="w-full">
      <Suspense>
        <DevButton metaData={data.componentMetaData} />
      </Suspense>

      <ShouldShowSlider
        childrenProducts={data?.componentData?.caseStudies}
        slug={data?.globalData?.slug}
        align={data.componentData?.align}
      />
    </div>
  )
}

function ShouldShowSlider({ childrenProducts, slug, align = "center" }) {
  log.debug("casestudy ShouldShowSlider: ", childrenProducts?.length, slug)

  if (childrenProducts?.length > 1) {
    return (
      <div className="flex w-full px-5 py-14 align-top font-inter text-my-white md:py-28">
        <div className="container w-full rounded-5px bg-my-charcoal px-5 py-7 font-inter md:px-9 md:py-10">
          <CaseStudyComponentSlider>
            {childrenProducts?.map((content, index) => (
              <Fragment key={index}>
                {renderCaseStudySection(content?.content, align)}
              </Fragment>
            ))}
          </CaseStudyComponentSlider>
        </div>
      </div>
    )
  }
  return (
    <div className="flex w-full bg-my-blue py-7 align-top font-inter text-my-white sm:py-14">
      <div className="container w-full font-inter">
        {childrenProducts?.map((content, index) => (
          <Fragment key={index}>
            {renderCaseStudySection(content?.content, align)}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

const renderCaseStudySection = (data, align = "center") => {
  const { alignItemsClass, objectPositionClass } = alignmentClasses({
    align: align,
  })

  return (
    <FeatureSection.Card
      imageSrc={data?.casestudyImage.url}
      altText={data?.casestudyImage.media.altText}
      typetitle={data?.casestudyType}
      title={data?.casestudyTitle}
      wrapperClassName={`${alignItemsClass} ${
        data?.imageOnRight ? "flex-row-reverse" : ""
      }`}
      imageWrapperClassName={`mb-[29px] flex h-auto max-w-[585px] justify-end bg-my-indigo lg:mb-0 lg:h-full lg:w-1/2`}
      imageClassName={`h-auto max-h-[430px] w-full max-w-[551px] object-contain lg:h-full ${objectPositionClass}`}
      description={data?.casestudyDescription}
      feature={data?.authorName}
      featureClassName="mt-1 [&_*]:!font-semibold"
      titleClassName=""
      descriptionClassName="mt-2 w-full text-left text-[13px] font-400 leading-body3 text-my-grey max-sm:line-clamp-6 max-sm:h-auto md:mt-6 md:text-body2 md:leading-body2"
      renderMDS={() => (
        <div className="mt-5 flex w-full flex-wrap gap-4 justify-self-start text-center max-sm:gap-2">
          {renderMDS(data?.casestudyAnalysis, "!mr-0 max-md:p-2 ")}
        </div>
      )}
      renderMBS={() => (
        <div className="mt-[30px] flex w-full max-w-max flex-wrap gap-x-2.5 md:gap-x-5 lg:mt-[45px]">
          {renderMBS(data?.buttons, "px-2.5")}{" "}
        </div>
      )}
    ></FeatureSection.Card>
  )
}

function populateMetaData(data: ComponentDataProps) {
  data.componentMetaData.dataProvided = data.componentData
  // Get the relative path of the current file
  data.componentMetaData.rendering =
    "sites/norg-website/content/heartcore/components/casestudy/casestudyComponent.tsx"
  // Get the name of the current function
  data.componentMetaData.renderingExportFunction = "casestudyComponent"
}
