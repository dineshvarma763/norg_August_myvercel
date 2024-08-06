import { Suspense } from "react"

import DevButton from "@/ui-base/components/ui/developer/devButton"
import Carousel from "@/ui-base/components/ui/sections/carousel/carousel"
import FeatureSection from "@/ui-base/components/ui/sections/feature-section"
import { filterAndUpdateClass } from "@/ui-base/lib/cms/heartcore/filterAndUpdateClass"
import { ComponentDataProps } from "@/ui-base/lib/services/data/componentMetaDataService"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { alignmentClasses, cn } from "@/ui-base/lib/util/utils"

const log = getLogger("ui-base.cms.heartcore.content.keyfeatures")

const columnClasses = {
  "Key Features - Four Column":
    "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  "Key Features - Three Column": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
}

export default function keyfeaturesComponent(data: ComponentDataProps) {
  log.trace("key features data passed in:", JSON.stringify(data))

  let matchingData = data.componentData

  if (!matchingData) {
    matchingData = {}
  }

  data.componentMetaData.dataProvided = matchingData

  return (
    <>
      <div className="relative w-full" id="key-features">
        <Suspense>
          <DevButton metaData={data.componentMetaData} />
        </Suspense>
        <KeyFeatures
          data={matchingData}
          languageSite={data.globalData.languageSite}
        />
      </div>
    </>
  )
}

const KeyFeatures = ({ data, languageSite }) => {
  const align = data?.align || "center"
  const { textAlignClass, alignItemsClass } = alignmentClasses({ align })

  return (
    <FeatureSection
      className="py-8"
      style={{ backgroundColor: `#${data?.backgroundColour}` }}
    >
      <div className={`flex w-full flex-col ${alignItemsClass}`}>
        <FeatureSection.Headline className="mb-6 max-w-screen-lg text-3xl leading-normal sm:mb-8 sm:!text-h3 sm:!leading-h3">
          {data?.heading}
        </FeatureSection.Headline>
        <div
          className={cn(`mb-10 max-w-screen-md sm:mb-16 ${textAlignClass}`, {
            "[&>*]:!text-left": textAlignClass.includes("text-left"),
            "[&>*]:!text-center": textAlignClass.includes("text-center"),
            "[&>*]:!text-right": textAlignClass.includes("text-right"),
          })}
          dangerouslySetInnerHTML={{
            __html: filterAndUpdateClass(data?.text, languageSite),
          }}
        />
      </div>
      <div
        className={cn(
          "hidden grid-cols-1 justify-items-center gap-8 font-urbanist sm:grid sm:grid-cols-2",
          columnClasses[data?.selectableVariant]
        )}
      >
        {renderCards(data?.keyFeatures, languageSite, align)}
      </div>
      <div className="w-full px-4 sm:hidden">
        <Carousel
          settings={{
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: false,
            arrow: true,
          }}
        >
          {renderCards(data?.keyFeatures, languageSite, align)}
        </Carousel>
      </div>
    </FeatureSection>
  )
}

const renderCards = (data, languageSite, align = "center") => {
  const { textAlignClass, justifyGridClass, objectPositionClass } =
    alignmentClasses({ align })

  return data?.map(({ content }, index) => (
    <FeatureSection.Card
      key={index}
      imageSrc={content.image.url}
      typetitle=""
      title={content.heading}
      imageHeight={60}
      imageWidth={60}
      className={`w-full gap-4 ${justifyGridClass}`}
      imageClassName={`${objectPositionClass}`}
      titleClassName={`my-0 mt-4 self-start !text-h4 font-800 leading-h4 text-my-blue ${textAlignClass}`}
      descriptionClassName="hidden" // description added as child
      altText={
        content?.image?.media?.altText != ""
          ? content?.image?.media?.altText
          : content?.image?.media?.name != ""
          ? content?.image?.media?.name
          : content?.heading
      }
    >
      <div
        // className={`${textAlignClass}`}
        className={cn(textAlignClass, {
          "[&>*]:!text-left": textAlignClass.includes("text-left"),
          "[&>*]:!text-center": textAlignClass.includes("text-center"),
          "[&>*]:!text-right": textAlignClass.includes("text-right"),
        })}
        dangerouslySetInnerHTML={{
          __html: filterAndUpdateClass(content?.description, languageSite),
        }}
      />
    </FeatureSection.Card>
  ))
}

function populateMetaData(data: ComponentDataProps) {
  data.componentMetaData.dataProvided = data.componentData
  // Get the relative path of the current file
  data.componentMetaData.rendering =
    "sites/norg-website/content/heartcore/components/keyfeatures/keyfeaturesComponent.tsx"
  // Get the name of the current function
  data.componentMetaData.renderingExportFunction = "keyfeaturesComponent"
}
