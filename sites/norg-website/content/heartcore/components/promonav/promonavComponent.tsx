"use client"

import { Suspense, use, useState } from "react"
import useIsMobile from "@/hooks/useIsMobile"
import RenderShowcase from "@/sites/norg-website/components/RenderShowcase"
import ResponsiveTabs from "@/sites/norg-website/components/ResponsiveTabs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs"

import DevButton from "@/ui-base/components/ui/developer/devButton"
import FeatureSection, {
  renderMBS,
  renderMDS,
} from "@/ui-base/components/ui/sections/feature-section"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui-base/components/ui/select"
import { ComponentDataProps } from "@/ui-base/lib/services/data/componentMetaDataService"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"

const log = getLogger("sites.norg-website.content.promonav")

export default function promonavComponent(data) {
  log.trace("promonavComponent data passed in:", JSON.stringify(data))
  populateMetaData(data)

  return (
    <div className="border-1 rounded-30 border-gray-700 bg-my-white3 px-[20px] pb-[40px] pt-[54px] backdrop-blur-lg md:px-[30px] md:pb-[46px] md:pt-[66px]">
      <Suspense>
        <DevButton metaData={data.componentMetaData} />
      </Suspense>

      <h1 className="mb-[51px] mt-[66px] w-full text-center font-comfortaa text-h3 font-semibold leading-h3 text-my-black-33 md:text-h2 md:leading-h2">
        {data.componentData?.header}
      </h1>

      <ResponsiveTabs data={data.componentData?.components}>
        {data.componentData?.components?.map(({ content }, index) => {
          if (!content?.component?.length) return null
          const data = content?.component[0]?.content
          if (data.__typename === "CaseStudyBlock") {
            return (
              <TabsContent
                key={`${content?.title}-${index}`}
                value={index.toString()}
              >
                <div className="TabsContent rounded-5px bg-white p-6 !text-black sm:p-10">
                  <FeatureSection.Card
                    wrapperClassName="container"
                    imageSrc={data?.casestudyImage.url}
                    altText={data?.casestudyImage.media.altText}
                    typetitle={data?.casestudyType}
                    title={data?.casestudyTitle}
                    imageWrapperClassName={`flex h-full items-center justify-end rounded-5px bg-my-indigo p-4 pr-0 lg:w-1/2`}
                    imageClassName={`max-h-[386px] w-full max-w-[494px]`}
                    description={data?.casestudyDescription}
                    titleClassName="text-my-grey2"
                    descriptionClassName="w-full pb-2.5 pt-6 text-left font-inter text-base font-400 leading-[1.375] text-my-grey3"
                    renderMDS={() => (
                      <div className="mt-5 hidden w-full flex-wrap justify-self-start text-center text-my-grey2 md:hidden lg:flex">
                        {renderMDS(data?.casestudyAnalysis)}
                      </div>
                    )}
                    renderMBS={() => (
                      <div className="mt-7 flex w-full flex-wrap text-white lg:mt-10">
                        {renderMBS(data?.buttons)}
                      </div>
                    )}
                  />
                </div>
              </TabsContent>
            )
          }
          return (
            <TabsContent
              key={`${content?.title}-${index}`}
              value={index.toString()}
            >
              <div className="TabsContent flex flex-col-reverse rounded-5px bg-white p-6 text-black sm:p-10 lg:pl-14 xl:flex-row">
                <RenderShowcase data={data} />
              </div>
            </TabsContent>
          )
        })}
      </ResponsiveTabs>
    </div>
  )
}

function populateMetaData(data: ComponentDataProps) {
  data.componentMetaData.dataProvided = data.componentData
  // Get the relative path of the current file
  data.componentMetaData.rendering =
    "sites/norg-website/content/heartcore/components/promonav/promonavComponent.tsx"

  // Get the name of the current function
  data.componentMetaData.renderingExportFunction = "promonavComponent"
}
