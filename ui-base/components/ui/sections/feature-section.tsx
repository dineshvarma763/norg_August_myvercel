import React from "react"
import Image from "next/image"
import Link from "next/link"
import InlineSVG from "@/sites/norg-website/components/InlineSVG"

import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { getSectionTextColour } from "@/ui-base/lib/util/getSectionTextColour"
import { checkPrefetchAvailability } from "@/ui-base/lib/util/prefetch"
import {
  cn,
  getBackgroundClass,
  getSectionalign,
  parseText,
} from "@/ui-base/lib/util/utils"

const log = getLogger("headless.components.featureSection")

interface FeatureCardProps {
  children?: React.ReactNode
  imageSrc: string
  typetitle: string
  title: string
  description?: string
  imageWidth?: number
  imageHeight?: number
  className?: string
  wrapperClassName?: string
  imageClassName?: string
  imageWrapperClassName?: string
  bodyWrapperClassName?: string
  titleClassName?: string
  descriptionClassName?: string
  useNextImage?: boolean
  renderCTA?: () => React.ReactNode
  altText: string
  feature?: string
  featureClassName?: string
  renderMBS?: () => React.ReactNode
  renderMDS?: () => React.ReactNode
}

export interface FeatureSectionProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  innerClassName?: string
  children?: React.ReactNode
  data?: any
}

const FeatureSection = ({
  children,
  className = "",
  innerClassName = "",
  ...rest
}: FeatureSectionProps) => {
  return (
    <section className={cn(`py-12 sm:py-16 lg:py-20 ${className}`)} {...rest}>
      <div className={cn("container mx-auto px-4", innerClassName)}>
        {children}
      </div>
    </section>
  )
}

const FeatureSectionHeadline = ({
  children,
  className,
  align,
}: {
  children: React.ReactNode
  className?: string
  align?: string
}) => {
  return children ? (
    <h2
      className={cn(
        "mb-6 text-center text-[22px] font-600 leading-[26px] md:text-h2 md:leading-[40px] lg:text-h2 lg:leading-[55px]",
        className,
        getSectionalign(align, "text-center")
      )}
    >
      {children}
    </h2>
  ) : null
}

const FeatureSectionDescription = ({
  children,
  className,
  align,
}: {
  children: React.ReactNode
  className?: string
  align?: string
}) => {
  return children ? (
    <p
      className={cn(
        "max-w-xl text-center font-inter text-[13px] font-400 leading-body3 md:text-body1 md:leading-[28px]",
        className,
        getSectionalign(align, "text-center")
      )}
    >
      {children}
    </p>
  ) : null
}

const FeatureCard = ({
  imageWidth,
  imageHeight,
  imageSrc,
  typetitle,
  title,
  description,
  className,
  wrapperClassName,
  imageClassName,
  imageWrapperClassName,
  bodyWrapperClassName,
  titleClassName,
  descriptionClassName,
  useNextImage = true,
  renderCTA,
  children,
  altText,
  feature,
  featureClassName = "",
  renderMBS,
  renderMDS,
}: FeatureCardProps) => {
  const ImageComponent = useNextImage ? Image : "img"
  return (
    <div
      className={cn(
        "!flex flex-wrap items-center justify-between",
        wrapperClassName
      )}
    >
      <div
        className={cn(
          "flex w-full items-center justify-end rounded-5px",
          imageWrapperClassName ?? ""
        )}
      >
        {imageSrc && imageSrc?.endsWith(".svg") ? (
          <div
            className={cn(
              "object-contain text-my-black hover:text-my-yellow",
              imageClassName
            )}
          >
            <InlineSVG
              src={imageSrc}
              width={imageWidth ?? 350}
              height={imageHeight ?? 350}
              alt={altText}
            />
          </div>
        ) : (
          imageSrc && (
            <ImageComponent
              className={cn("object-contain", imageClassName)}
              alt={altText}
              src={imageSrc}
              loading="lazy"
              quality={75}
              width={imageWidth ?? 350}
              height={imageHeight ?? 350}
              sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 30vw"
            />
          )
        )}
      </div>

      <div
        className={cn(
          "test flex w-full flex-col px-0 lg:w-1/2 lg:pl-9 xl:pl-12 ",
          bodyWrapperClassName ?? ""
        )}
      >
        <h3
          className={cn(
            "w-full text-xs font-400 capitalize leading-10 text-my-lighterIndigo",
            { hidden: !typetitle }
          )}
        >
          {typetitle}
        </h3>
        <h4
          className={cn(
            "mt-0 w-full text-xl font-400 capitalize leading-h4 text-my-white lg:mt-2.5 lg:text-h4",
            titleClassName,
            { hidden: !title }
          )}
        >
          {title}
        </h4>
        <p className={cn("text-center", descriptionClassName)}>
          {parseText(description).text}
        </p>
        {feature ? (
          <div
            className={featureClassName}
            dangerouslySetInnerHTML={{
              __html: <>{stripAndUpdateTags(feature)}</>,
            }}
          />
        ) : null}
        {children}

        {renderCTA ? renderCTA() : null}
        {renderMDS ? renderMDS() : null}
        {renderMBS ? renderMBS() : null}
      </div>
    </div>
  )
}

export default Object.assign(FeatureSection, {
  Headline: FeatureSectionHeadline,
  Description: FeatureSectionDescription,
  Card: FeatureCard,
})

export const renderMBS = (objButtons?, className = "", wrapperClass = "") => {
  return objButtons?.map(({ content }) => (
    <div key={content?.buttonText} className={cn("max-w-max", wrapperClass)}>
      <Link
        className={cn(
          "lg:body3 box-border inline-block w-full rounded-[8px] bg-my-indigo px-0 py-2.5 text-center text-xs font-500 capitalize leading-nav transition hover:bg-my-lighterIndigo hover:text-my-white lg:px-5 lg:text-body3",
          className,
          getBackgroundClass(content?.buttonBackgroundColour),
          getSectionTextColour(content?.buttonFontColour, "text-my-white")
        )}
        href={content?.buttonsURL?.url ?? ""}
        prefetch={checkPrefetchAvailability(content?.url)}
        data-attr-prefetch={checkPrefetchAvailability(content?.url)}
      >
        {content?.buttonText ?? ""}
      </Link>
    </div>
  ))
}

export const renderMDS = (objDigits, className = "") => {
  return objDigits?.map(({ content }) => (
    <div
      key={content.casestudydigits}
      className={cn("mr-[10px] rounded-5px border border-gray-700 px-5 py-3 last:mr-0 xl:mr-[22px]", className)}
    >
      <p className="text-[24px] font-600 leading-[36px]">
        {content.casestudydigits}
      </p>
      <p className="text-xxs font-400 leading-[15px]">
        {content.casestudydigitTitle}
      </p>
    </div>
  ))
}
// Original function with the anchor tags processing removed
export function stripAndUpdateTags(html: string) {
  if (!html && typeof html !== "string") {
    return ""
  }
  // console.log("HTML is : ", html);
  const strippedHTML = html
    .replace(/<style[^>]*>.*<\/style>/g, "")
    // Remove script tags and content
    .replace(/<script[^>]*>.*<\/script>/g, "")
    // Remove all opening, closing and orphan HTML tags
    .replace(/<[^>]+>/g, "")
    // Remove leading spaces and repeated CR/LF
    .replace(/([\r\n]+ +)+/g, "\n")
    // Remove any leftover leading spaces and newlines
    .replace(/^[\n ]+/g, "")
  // console.log("Stripped HTML is : ", strippedHTML);

  // Split the stripped text into an array of lines
  const lines = strippedHTML.split("\n")

  // Create the HTML string for the <ul> element
  let ulHTML =
    '<ul class="grid h-full grid-cols-1 items-center justify-items-center">'

  // Iterate through the lines and create <li> elements
  lines.forEach((line) => {
    ulHTML += `<li class="w-full text-[13px] md:text-body2 font-400 mt-2 pt-px md:mt-6 leading-body3 md:leading-body2 text-my-grey">${line}</li>`
  })

  ulHTML += "</ul>"

  // console.log("The HTML unordered list is: ", ulHTML);
  return ulHTML
}
