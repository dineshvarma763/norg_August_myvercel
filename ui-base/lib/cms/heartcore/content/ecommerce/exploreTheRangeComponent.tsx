import React, { Suspense } from "react"
import Link from "next/link"
import { renderCTA } from "@/sites/norg-website/content/heartcore/components/ctalist/ctalistComponent"

import DevButton from "@/ui-base/components/ui/developer/devButton"
import FeatureSection from "@/ui-base/components/ui/sections/feature-section"
import { ComponentDataProps } from "@/ui-base/lib/services/data/componentMetaDataService"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { getSectionBackgroundColour } from "@/ui-base/lib/util/getSectionBackgroundColour"
import { alignmentClasses, cn } from "@/ui-base/lib/util/utils"
import ExploreTheRangeComponentSliderLoader from "./exploreTheRangeSliderLoader"

const log = getLogger("ui-base.cms.heartcore.content.productList")

export default function exploreTheRangeComponent(data: ComponentDataProps) {
  log.debug("productsData data passed in:", JSON.stringify(data))
  log.debug("productsData", data.componentData)

  populateMetaData(data)

  return (
    <div className="w-full">
      <Suspense><DevButton metaData={data.componentMetaData} /></Suspense>
      {data.componentData?.explore?.map(({ content }) => (
        <div
          className={`inline-block w-full py-14 align-top font-urbanist text-my-blue md:py-28 ${getSectionBackgroundColour(
            content?.fullSectionBackgroundColour,
            ""
          )}`}
        >
          <div
            className={`container w-full ${getSectionBackgroundColour(
              content?.fullSectionBackgroundColour,
              ""
            )}`}
          >
            <div className={`my-4 flex flex-wrap font-urbanist`}>
              <h3 className="mb-6 text-3xl font-800 leading-[45px] md:mb-8 md:text-h3 md:leading-h3">
                {content.heading}
              </h3>
              <div
                className="flex w-full flex-col items-center gap-6 p-8 sm:flex-row sm:justify-between"
                style={{ backgroundColor: `#${content?.backgroundColour}` }}
              >
                <p
                  className={cn(
                    "text-sm font-400 leading-body2 text-my-black md:text-base",
                    {
                      hidden: !content?.introductionText,
                    }
                  )}
                >
                  {content.introductionText}
                </p>
                {content?.button && (
                  <Link
                    className="box-border w-full max-w-sm shrink-0 rounded-full bg-my-blue px-8 py-3 text-center text-body1 font-800 uppercase leading-body1 tracking-0.1em text-white transition hover:bg-my-yellow hover:text-my-blue sm:max-w-max"
                    href={content?.button?.url}
                  >
                    {content.button.name}
                  </Link>
                )}
              </div>
              <ShouldShowSlider
                childrenProducts={content?.childrenProducts}
                languageSite={data.globalData?.languageSite}
                slug={data?.globalData?.slug}
                align={data.componentData?.align}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ShouldShowSlider({
  childrenProducts,
  languageSite,
  slug,
  align = "center",
}) {
  log.debug(
    "Explore the range ShouldShowSlider: ",
    childrenProducts?.length,
    slug
  )
  if (childrenProducts?.length > 3) {
    return (
      <>
        <ExploreTheRangeComponentSliderLoader>
          {renderProducts(childrenProducts, languageSite, align)}
        </ExploreTheRangeComponentSliderLoader>
      </>
    )
  } else {
    return (
      <div
        className={`container hidden grid-cols-1 gap-8 py-4 sm:grid-cols-2 md:grid lg:grid-cols-3`}
      >
        {renderProducts(childrenProducts, languageSite, align)}
      </div>
    )
  }
}

const renderProducts = (childrenProducts, languageSite, align) => {
  const { alignItemsClass, justifyGridClass, objectPositionClass } =
    alignmentClasses({ align : align || "center" })
  return childrenProducts?.map((card, index) => (
    <>
      <FeatureSection.Card
        key={index}
        imageSrc={card?.imageUrl}
        altText={card?.altText}
        typetitle=""
        title={card?.name}
        wrapperClassName={alignItemsClass}
        className={`w-full gap-4 ${justifyGridClass}`}
        imageClassName={`h-52 w-full ${objectPositionClass}`}
        description={card?.description}
        feature={card?.feature}
        titleClassName="my-0 self-start text-base font-800 uppercase text-my-blue"
        descriptionClassName="self-start !text-body2 font-bold  capitalize leading-body2 text-my-black"
        renderCTA={() =>
          renderCTA({ url: card?.url, name: "Learn More" }, languageSite)
        }
      >
      </FeatureSection.Card>
    </>
  ))
}

function populateMetaData(data: ComponentDataProps) {
  data.componentMetaData.dataProvided = data.componentData
  // Get the relative path of the current file
  data.componentMetaData.rendering =
    "ui-base/lib/cms/heartcore/content/ecommerce/exploreTheRangeComponent.tsx"
  // Get the name of the current function
  data.componentMetaData.renderingExportFunction = "exploreTheRangeComponent"
}
