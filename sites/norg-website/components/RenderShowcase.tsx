"use client"

import { Fragment } from "react"
import Image from "next/image"
import useIsMobile from "@/hooks/useIsMobile"
import Testimonial from "@/sites/norg-website/components/Testimonial"
import { Check } from "lucide-react"

import { parseShowcaseHTMLContent } from "@/ui-base/lib/cms/heartcore/filterAndUpdateClass"
import { cn } from "@/ui-base/lib/util/utils"
import { renderCTA } from "../content/heartcore/components/ctalist/ctalistComponent"

const RenderShowcase = ({ data }) => {
  const isMobile = useIsMobile()
  const { listItems, paragraph } = parseShowcaseHTMLContent(
    data?.showcaseDescription
  )

  return (
    <>
      {isMobile ? (
        <div className="mt-4 flex w-full flex-col justify-center gap-y-4">
          {data?.showcaseTestimonials?.map((testimonial, index) => (
            <Testimonial
              key={index}
              data={testimonial.content}
              autorClassName="text-body3 font-semibold leading-[21px] text-my-black-33"
              timestampClassName="text-body3 font-semibold leading-[21px] text-my-grey md:text-my-grey"
              isSender={index % 2 === 0}
            />
          ))}
        </div>
      ) : null}

      <div className="w-full shrink-0 font-inter max-xl:flex-1 max-sm:mt-4 xl:max-w-[30%]">
        <div className="flex flex-col justify-center max-lg:mt-4 xl:max-w-md">
          <span className="mb-[5px] font-inter text-[13px] font-normal leading-normal text-my-indigo sm:mb-[21px] md:text-[20px]">
            {data?.showcaseType}
          </span>
          <h1 className="text-[20px] font-400 leading-[30px] text-my-grey2 sm:mb-[21px] md:text-[40px] md:leading-[45px]">
            {data?.showcaseTitle}
          </h1>
          <p className="mb-[25px] text-[13px] font-400 leading-[20px] text-my-grey3 md:text-[18px] md:leading-[26px]">
            {paragraph}
          </p>
          {listItems.length > 0 ? (
            <ul className="mb-[25px] text-[13px] font-400 leading-[20px] text-my-grey3 md:text-[16px] md:leading-[24px]">
              {listItems.map((item, index) => (
                <li key={index} className="mb-1.5 md:mb-2.5">
                  <Check className="mr-[19px] inline-block h-5 w-5 font-600 text-green-500" />
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {data?.showcaseCTAList?.map(({ content }, index) => (
              <Fragment key={index}>
                {renderCTA(
                  {
                    ...content.link,
                    name: content.heading || content?.link?.name,
                  },
                  null,
                  "text-sm max-sm:m-0 whitespace-nowrap mt-0"
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
      <div className="relative flex w-full justify-end max-xl:flex-1 xl:max-w-[70%]">
        {!isMobile ? (
          <div className="absolute inset-y-0 right-1/2 flex max-w-[400px] flex-col justify-center gap-y-4 lg:translate-x-8 xl:translate-x-0 2xl:translate-x-16 min-[1750px]:translate-x-1/2">
            {data?.showcaseTestimonials?.map((testimonial, index) => (
              <Testimonial
                key={index}
                data={testimonial.content}
                autorClassName={cn(
                  "text-body3 font-semibold leading-[21px] text-my-black-33",
                  {
                    "text-white": index % 2 !== 0,
                  }
                )}
                timestampClassName={cn(
                  "text-body3 font-semibold leading-[21px] text-my-grey",
                  {
                    "text-white": index % 2 !== 0,
                  }
                )}
                isSender={index % 2 === 0}
              />
            ))}
          </div>
        ) : null}
        <Image
          width={642}
          height={428}
          className="border-1 shrink-0 rounded-[10px] border-[#F3F4F6] object-contain"
          src={data?.showcaseImage?.url || ""}
          alt="Showcase Image"
        />
      </div>
    </>
  )
}

export default RenderShowcase
