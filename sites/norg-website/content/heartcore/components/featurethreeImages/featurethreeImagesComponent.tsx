import { Suspense } from "react"
import Image from "next/image"

import DevButton from "@/ui-base/components/ui/developer/devButton"
import { ComponentDataProps } from "@/ui-base/lib/services/data/componentMetaDataService"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { alignmentClasses, cn } from "@/ui-base/lib/util/utils"

const log = getLogger("ui-base.cms.heartcore.content.featurethreeImages")

export default function featurethreeImagesComponent(data: ComponentDataProps) {
  log.trace("featurethreeImages data passed in:", JSON.stringify(data))

  populateMetaData(data)
  let matchingData = data.componentData

  if (!matchingData) {
    matchingData = {}
  }

  data.componentMetaData.dataProvided = matchingData

  const align = data?.componentData?.align || "center"
  const { textAlignClass, objectPositionClass } = alignmentClasses({ align })

  return (
    <>
      <div
        className="relative w-full pb-9 pt-16 font-urbanist md:pb-16 md:pt-16"
        style={{ backgroundColor: `#${matchingData?.backgroundColour}` }}
      >
        <Suspense>
          <DevButton metaData={data.componentMetaData} />
        </Suspense>
        <h2
          className={`leading-12 container mb-12 font-urbanist text-3xl font-800 text-my-brown-grey md:text-h3 md:leading-h3 ${textAlignClass}`}
        >
          {matchingData.name}
        </h2>
        <div className="container w-full break-after-auto">
          <div className="flex flex-wrap justify-between">
            {matchingData.featureThreeImagesSectionListing.map(
              (featurethreeImages, index) => (
                <div
                  key={index}
                  className="mb-16 flex w-full flex-col sm:max-w-sm md:mb-[0]"
                >
                  <Image
                    className={`mb-[24px] max-h-60 w-full object-contain md:mb-[32px] ${objectPositionClass}`}
                    src={featurethreeImages.content.featureImage?.url}
                    sizes="(max-width: 600px) 354px, (min-width: 601px) 354px"
                    height={240}
                    width={354}
                    loading="lazy"
                    alt={
                      featurethreeImages.content.featureImage?.media?.altText !=
                      ""
                        ? featurethreeImages.content.featureImage?.media
                            ?.altText
                        : featurethreeImages.content.featureImage?.media
                            ?.name != ""
                        ? featurethreeImages.content.featureImage?.media?.name
                        : featurethreeImages.name
                    }
                    priority={false}
                  />
                  <div
                    className={cn(
                      `text-base leading-6 text-my-brown-grey md:text-xl md:leading-[30px] ${textAlignClass}`,
                      {
                        "[&>*]:!text-left":
                          textAlignClass.includes("text-left"),
                        "[&>*]:!text-center":
                          textAlignClass.includes("text-center"),
                        "[&>*]:!text-right":
                          textAlignClass.includes("text-right"),
                      }
                    )}
                    dangerouslySetInnerHTML={{
                      __html: featurethreeImages.content.featureDescription,
                    }}
                  ></div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function populateMetaData(data: ComponentDataProps) {
  data.componentMetaData.dataProvided = data.componentData
  // Get the relative path of the current file
  data.componentMetaData.rendering =
    "sites/norg-website/content/heartcore/components/featurethreeImages/featurethreeImagesComponent.tsx"
  // Get the name of the current function
  data.componentMetaData.renderingExportFunction = "ctalistComponent"
}
