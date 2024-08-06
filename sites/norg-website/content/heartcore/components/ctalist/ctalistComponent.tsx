import { Fragment, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import InlineSVG from "@/sites/norg-website/components/InlineSVG"

import DevButton from "@/ui-base/components/ui/developer/devButton"
import FeatureSection from "@/ui-base/components/ui/sections/feature-section"
import { ComponentDataProps } from "@/ui-base/lib/services/data/componentMetaDataService"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { getSectionBackgroundColour } from "@/ui-base/lib/util/getSectionBackgroundColour"
import { checkPrefetchAvailability } from "@/ui-base/lib/util/prefetch"
import {
  alignmentClasses,
  cn,
  getBackgroundClass,
  getImageDropShadowClass,
  parseText,
} from "@/ui-base/lib/util/utils"
import CtaSlider from "./ctaSlider"

const log = getLogger("sites.norg-website.content.ctaList")

export default function ctalistComponent(data: ComponentDataProps) {
  log.trace("ctaListComponent data passed in:", JSON.stringify(data))

  populateMetaData(data)

  let renderedVariant = <></>
  let altText = ""
  if (data.componentMetaData.variant === "Feature - Button CTAs") {
    renderedVariant = (
      <>
        <CtaButtons
          data={data.componentData}
          heading={data.componentData.heading}
          text={data.componentData.text}
          languageSite={data.globalData?.languageSite}
        />
      </>
    )
  } else if (data.componentMetaData.variant === "Feature - Icon CTAs") {
    renderedVariant = (
      <>
        <IconLinks
          data={data.componentData}
          languageSite={data.globalData?.languageSite}
        />
      </>
    )
  } else if (data.componentMetaData.variant === "Feature - LogoImage CTAs") {
    renderedVariant = (
      <>
        <FeaturesComponent
          data={data.componentData}
          languageSite={data.globalData?.languageSite}
        />
      </>
    )
  } else if (data.componentMetaData.variant === "Feature - Image Logos") {
    renderedVariant = (
      <>
        <ImageLogos
          data={data.componentData}
          languageSite={data.globalData?.languageSite}
        />
      </>
    )
  } else if (data.componentMetaData.variant === "Feature - Image CTAs") {
    renderedVariant = (
      <>
        <ImageCTA
          data={data.componentData}
          languageSite={data.globalData?.languageSite}
        />
      </>
    )
  } else if (data.componentMetaData.variant === "Feature - Block CTAs") {
    renderedVariant = (
      <>
        <CtaBlocks
          data={data.componentData}
          heading={data.componentData.heading}
          text={data.componentData.text}
          languageSite={data.globalData?.languageSite}
        />
      </>
    )
  }

  return (
    <div className="w-full text-white">
      <Suspense>
        <DevButton metaData={data.componentMetaData} />
      </Suspense>
      {renderedVariant}
    </div>
  )
}

const IconLinks = ({ data, languageSite }) => {
  const { justifyClass } = alignmentClasses({ align: data?.align || "center" })

  return (
    <div className="w-full py-10">
      <div
        className={cn(
          "container flex w-full flex-col items-center gap-6 sm:flex-row",
          {
            "justify-around": justifyClass?.includes("center"),
            [justifyClass]: !justifyClass?.includes("center"),
          }
        )}
      >
        {data?.callToActionItems?.map(({ content: node }, index) => (
          <div
            key={node.id ?? index}
            className="mx-4 last:pb-0 max-[639px]:pb-8"
          >
            {node.link?.url && (
              <Link
                href={node?.link?.url}
                prefetch={checkPrefetchAvailability(node?.link?.url)}
                data-attr-prefetch={checkPrefetchAvailability(node?.link?.url)}
                className="flex flex-col items-center font-inter text-body1 font-800 uppercase leading-body1 tracking-0.1em text-white"
              >
                {node?.icon?.url && node?.icon?.url.endsWith(".svg") ? (
                  <div className="mb-3 size-12">
                    <InlineSVG
                      src={node?.icon?.url}
                      width={48}
                      height={48}
                      className="hover:text-my-yellow"
                      alt={
                        node?.icon?.media?.altText != ""
                          ? node?.icon?.media?.altText
                          : node?.icon?.media?.name != ""
                          ? node?.icon?.media?.name
                          : node?.heading
                      }
                    />
                  </div>
                ) : (
                  <Image
                    src={node?.icon?.url}
                    width={48}
                    height={48}
                    className="mb-3 size-12"
                    alt={
                      node?.icon?.media?.altText != ""
                        ? node?.icon?.media?.altText
                        : node?.icon?.media?.name != ""
                        ? node?.icon?.media?.name
                        : node?.heading
                    }
                  />
                )}
                <p className="text-center underline">{node.heading}</p>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const CtaButtons = ({ data, heading, text, languageSite }) => {
  const { textAlignClass, alignItemsClass, justifyClass } = alignmentClasses({
    align: data?.align || "center",
  })

  return (
    <div className="w-full  p-4 py-12 font-inter">
      <div className={`container flex w-full flex-col ${alignItemsClass}`}>
        <h3
          className={`mb-8 ${textAlignClass} text-3xl font-800 md:text-h3 md:leading-h3`}
        >
          {heading}
        </h3>
        {text && text.trim() !== "" && (
          <h2
            className={`mb-8 max-w-screen-md ${textAlignClass} font-inter text-h4 font-medium leading-h4`}
            dangerouslySetInnerHTML={{ __html: text }}
          ></h2>
        )}
        <div
          className={`flex w-full flex-col items-center ${justifyClass} gap-6 sm:flex-row`}
        >
          {data?.callToActionItems?.map(({ content }, index) => (
            <Fragment key={content.id ?? index}>
              {renderCTA(
                content.link,
                languageSite,
                cn("mt-0 box-border w-full sm:max-w-max", {
                  "bg-my-yellow text-my-blue": index % 2 !== 0,
                  "bg-my-blue text-white hover:bg-my-yellow hover:text-my-blue transition":
                    index % 2 === 0,
                })
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

function ImageCTA({ data, languageSite }) {
  const {
    textAlignClass,
    alignItemsClass,
    justifyGridClass,
    objectPositionClass,
    justifyClass,
  } = alignmentClasses({ align: data?.align || "center" })
  let gridColsClass = "md:grid-cols-3"

  if (data?.maxItemsPerRow === 2) {
    gridColsClass = "md:grid-cols-2"
  }

  if (data?.callToActionItems?.length === 2) {
    gridColsClass = "md:grid-cols-2"
  }

  const isLightBg = getSectionBackgroundColour(
    data?.backgroundColour,
    ""
  ).includes("white")

  return (
    <FeatureSection className={`cta-list font-inter`}>
      <div className={`flex w-full flex-col ${alignItemsClass}`}>
        <FeatureSection.Headline
          className={`!font-comfortaa text-[22px] font-600 leading-[26px] md:text-h2 md:leading-[40px] lg:text-h2 lg:leading-[55px]  ${
            isLightBg ? "text-my-grey2" : ""
          }`}
          align={data?.align}
        >
          {data.heading}
        </FeatureSection.Headline>
        <FeatureSection.Description
          className={`mt-0 max-w-screen-md font-inter md:mb-16 ${
            isLightBg ? "text-my-grey2" : ""
          }`}
          align={data?.align}
        >
          {parseText(data.text).text}
        </FeatureSection.Description>
      </div>
      <div className="invisible grid-cols-2 md:grid-cols-3">
        This is present as tailwind doesn&apos;t like dynamic assignments of
        grid-cols
      </div>

      <CtaSlider
        settings={{
          adaptiveHeight: false,
        }}
        itemLength={data?.callToActionItems?.length}
        dotVaraint={isLightBg ? "dark" : "light"}
        className={`grid size-full grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 ${gridColsClass}`}
      >
        {data?.callToActionItems?.map(({ content: card }, index) => (
          <>
            <FeatureSection.Card
              key={index}
              imageSrc={card?.icon?.url}
              typetitle=""
              title={card?.heading}
              className={`w-full gap-4 !font-inter ${justifyGridClass}`}
              wrapperClassName={cn(
                "flex w-full flex-col flex-nowrap items-center justify-center gap-4 rounded-5px border border-transparent px-[35px] py-10",
                alignItemsClass,
                getBackgroundClass(card.backgroundColour ?? ""),
                {
                  "flex-col-reverse": data?.colReverse,
                }
              )}
              altText={
                card?.icon?.media?.altText != ""
                  ? card?.icon?.media?.altText
                  : card?.icon?.media?.name != ""
                  ? card?.icon?.media?.name
                  : card?.heading
              }
              description={card?.text}
              titleClassName={cn(
                "!mt-0 mb-[15px] w-full text-left text-strap font-400 capitalize leading-h4 text-my-white md:text-h4",
                textAlignClass,
                {
                  "text-my-lighterIndigo text-[18px] lg:text-[30px] leading-[30px] lg:leading-[40px]":
                    isLightBg,
                }
              )}
              imageClassName={`${objectPositionClass} h-auto max-h-80 w-full object-contain`}
              imageWrapperClassName={cn(
                "mb-[27px] flex w-full shrink-0 rounded-5px",
                textAlignClass,
                {
                  "mb-[0px]": isLightBg,
                }
              )}
              bodyWrapperClassName="!w-full flex-1 !pl-0"
              descriptionClassName={cn(
                "text-left text-[13px] font-400 leading-body3 text-my-grey lg:text-[16px] lg:leading-[22px]",
                textAlignClass,
                {
                  "text-my-grey3 text-[13px] lg:text-[18px] leading-[20px] lg:leading-[26px]":
                    isLightBg,
                }
              )}
              renderCTA={() => (
                <div
                  className={"flex flex-grow items-end" + " " + justifyClass}
                >
                  {renderCTA(card?.link, languageSite)}
                </div>
              )}
            />
          </>
        ))}
      </CtaSlider>
    </FeatureSection>
  )
}

function FeaturesComponent({ data, languageSite }) {
  const {
    textAlignClass,
    alignItemsClass,
    justifyGridClass,
    objectPositionClass,
  } = alignmentClasses({ align: data?.align || "center" })
  let gridColsClass = "md:grid-cols-3"
  if (data?.callToActionItems?.length === 2) {
    gridColsClass = "md:grid-cols-2"
  }

  return (
    <FeatureSection className={`bg-my-blue font-inter `}>
      <div className={`flex w-full flex-col ${alignItemsClass}`}>
        <FeatureSection.Headline
          className="max-w-screen-md !font-comfortaa text-[22px] font-600 leading-[26px] md:text-h2 md:leading-[40px] lg:text-h2 lg:leading-[55px]"
          align={data?.align}
        >
          {data.heading}
        </FeatureSection.Headline>
        <FeatureSection.Description
          className="mt-0 max-w-screen-md text-center font-inter md:mb-16"
          align={data?.align}
        >
          {parseText(data.text).text}
        </FeatureSection.Description>
      </div>
      <div className="invisible grid-cols-2 md:grid-cols-3">
        This is present as tailwind doesn&apos;t like dynamic assignments of
        grid-cols
      </div>

      <CtaSlider
        settings={{
          rows: data?.callToActionItems?.length > 3 ? 2 : 1,
          slidesPerRow: 1,
        }}
        itemLength={
          data?.callToActionItems?.length > 3
            ? Math.ceil(data?.callToActionItems?.length / 2)
            : data?.callToActionItems?.length
        }
        className={`grid grid-cols-1 justify-items-center gap-y-[28px] sm:grid-cols-2 md:!grid-cols-2 lg:!grid-cols-3 ${gridColsClass}`}
      >
        {data?.callToActionItems?.map(({ content: card }, index) => (
          <>
            <FeatureSection.Card
              key={index}
              imageSrc={card?.icon?.url}
              typetitle=""
              title={card?.heading}
              className={`w-full gap-4 ${justifyGridClass}`}
              wrapperClassName={`${alignItemsClass} flex-nowrap`}
              altText={
                card?.icon?.media?.altText != ""
                  ? card?.icon?.media?.altText
                  : card?.icon?.media?.name != ""
                  ? card?.icon?.media?.name
                  : card?.heading
              }
              description={card?.text}
              titleClassName="mt-0 w-full self-start whitespace-nowrap text-left font-inter text-[16px] font-400 capitalize leading-body3 text-my-white md:mb-3 md:text-strap md:leading-body3 lg:mt-0 lg:text-strap"
              imageClassName={`${objectPositionClass}`}
              imageWrapperClassName={cn(
                "m-5 flex !h-18 !w-18 shrink-0 items-center justify-center overflow-hidden rounded-5px border border-transparent bg-my-btntext",
                getImageDropShadowClass(card.imageDropShadow),
                getBackgroundClass(card.backgroundColour)
              )}
              imageWidth={54}
              imageHeight={54}
              bodyWrapperClassName="mx-0 my-5 !w-full flex-1 pl-[5px] xl:pl-[8px]"
              descriptionClassName="self-start text-left text-[13px] md:text-[16px] md:leading-body3"
              renderCTA={() => renderCTA(card?.link, languageSite)}
            />
          </>
        ))}
      </CtaSlider>
    </FeatureSection>
  )
}

export const renderCTA = (linkObj, languageSite, className = "") => {
  if (linkObj?.name) {
    const isInternalLink = linkObj?.url?.startsWith("/")

    if (isInternalLink) {
      return (
        <Link
          className={cn(
            "mt-8 block max-w-max rounded-lg bg-my-indigo px-5 py-2.5 font-500 capitalize leading-nav text-my-white hover:bg-my-black hover:font-500",
            className
          )}
          href={linkObj?.url ?? ""}
          prefetch={checkPrefetchAvailability(linkObj?.url)}
          data-attr-prefetch={checkPrefetchAvailability(linkObj?.url)}
        >
          {linkObj?.name ?? ""}
        </Link>
      )
    } else {
      return (
        <a
          className={cn(
            "mt-8 block max-w-max rounded-lg bg-my-indigo px-5 py-2.5 font-500 capitalize leading-nav text-my-white hover:bg-my-black hover:font-500",
            className
          )}
          href={linkObj?.url ?? ""}
        >
          {linkObj?.name ?? ""}
        </a>
      )
    }
  }
  return null
}

const CtaBlocks = ({ data, heading, text, languageSite }) => {
  const { textAlignClass, justifyClass } = alignmentClasses({
    align: data?.align || "center",
  })
  return (
    <div className={`w-full py-12 font-inter`}>
      <div className={`container flex w-full flex-col ${justifyClass}`}>
        <h3
          className={`mb-8 ${textAlignClass} text-3xl font-800 text-my-blue md:text-h3 md:leading-h3`}
        >
          {heading}
        </h3>
        <h2
          className={`${textAlignClass} text-lg font-medium`}
          dangerouslySetInnerHTML={{ __html: text }}
        ></h2>
      </div>
      <div className="container grid grid-cols-1 gap-x-14 gap-y-10 md:grid-cols-2 ">
        {data?.callToActionItems?.map(({ content }, index) => {
          let bg = getSectionBackgroundColour(content.backgroundColour, "")
          if (!bg) {
            bg = index % 2 === 0 ? "bg-my-black" : "bg-my-yellow" // Updated background colors
          }

          const lowercaseBg = bg ? bg.toLowerCase() : ""

          return (
            <div
              key={content.id ?? index}
              className={cn(
                "flex flex-col justify-center px-6 py-12 text-center ",
                bg
              )}
            >
              <p
                className={
                  "text-h4 md:text-h3 " +
                  cn("font-800 leading-h4 md:leading-h3 ", {
                    "text-white": lowercaseBg.includes("black"),
                    "text-my-black": lowercaseBg.includes("yellow"),
                  })
                }
              >
                {content.heading}
              </p>
              {renderCTA(
                content.link,
                languageSite,
                cn("mx-auto mt-6 sm:min-w-[236px]", {
                  "bg-white text-my-blue hover:bg-my-yellow hover:text-my-blue transition":
                    lowercaseBg.includes("black"), // White buttons for black background
                  "bg-my-black text-white hover:bg-white hover:text-my-blue transition":
                    lowercaseBg.includes("yellow"), // Black buttons for orange background
                })
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const IconDownloadCTA = ({ data }) => {
  return (
    <FeatureSection
      id="downloads"
      className="py-6 font-inter text-my-blue sm:py-8 md:py-10"
    >
      <div className="flex flex-wrap justify-evenly justify-items-center px-2 [&>*]:mb-4 [&>*]:w-full sm:[&>*]:w-3/6 md:[&>*]:w-2/6">
        {data?.downloads?.map(({ content }, index) => (
          <FeatureSection.Card
            key={index}
            titleClassName="text-h5 font-800 leading-h5"
            imageSrc={content?.image?.url}
            typetitle=""
            title={content.heading}
            altText={
              content?.image?.media?.altText != ""
                ? content?.image?.media?.altText
                : content?.image?.media?.name != ""
                ? content?.image?.media?.name
                : content?.heading
            }
            imageHeight={65}
            imageWidth={65}
            renderCTA={() => (
              <a
                href={content?.media?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-my-yellow px-4 py-2 text-center text-h5 font-800 uppercase leading-h5 tracking-0.1em transition hover:bg-my-brown-grey hover:text-my-white sm:px-6"
              >
                {content?.buttonText}
              </a>
            )}
          />
        ))}
      </div>
    </FeatureSection>
  )
}

function ImageLogos({ data, languageSite }) {
  const { textAlignClass, alignItemsClass } = alignmentClasses({
    align: data?.align || "center",
  })

  return (
    <div
      className={`flex w-full flex-col items-center gap-6 px-1 py-8 ${alignItemsClass}`}
    >
      <span
        className={cn(
          "mb-6 text-center !font-comfortaa text-zinc-300 sm:text-xl",
          textAlignClass
        )}
      >
        {data.heading}
      </span>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {data?.callToActionItems?.map(({ content: card }, index) => (
          <div key={card.id ?? index} className="flex items-center px-6">
            <Image
              src={card?.icon?.url}
              width={160}
              height={60}
              className="mb-5 h-10 w-auto max-w-170 object-contain brightness-0 invert transition-[all_.5s_ease] hover:brightness-100 hover:invert-0 lg:h-14"
              alt={
                card?.icon?.media?.altText != ""
                  ? card?.icon?.media?.altText
                  : card?.icon?.media?.name != ""
                  ? card?.icon?.media?.name
                  : card?.heading
              }
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function populateMetaData(data: ComponentDataProps) {
  data.componentMetaData.dataProvided = data.componentData
  // Get the relative path of the current file
  data.componentMetaData.rendering =
    "sites/norg-website/content/heartcore/components/ctalist/ctalistComponent.tsx"
  // Get the name of the current function
  data.componentMetaData.renderingExportFunction = "ctalistComponent"
}
