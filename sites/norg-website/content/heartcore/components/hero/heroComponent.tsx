import { Suspense } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import BackToTopAndChatLoader from "@/sites/norg-website/components/backToTopAndChatLoader"

import Breadcrumbs from "@/ui-base/components/ui/breadcrumbs/Breadcrumbs"
import DevButton from "@/ui-base/components/ui/developer/devButton"
import Hero from "@/ui-base/components/ui/hero/Hero"
import LinksList, {
  LinksListLinkProps,
} from "@/ui-base/components/ui/links/LinksList"
import {
  filterAndUpdateClass,
  formatHeading,
} from "@/ui-base/lib/cms/heartcore/filterAndUpdateClass"
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"
import { ComponentDataProps } from "@/ui-base/lib/services/data/componentMetaDataService"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { getSectionBackgroundColour } from "@/ui-base/lib/util/getSectionBackgroundColour"
import { getSectionTextColour } from "@/ui-base/lib/util/getSectionTextColour"
import { checkPrefetchAvailability } from "@/ui-base/lib/util/prefetch"
import { alignmentClasses, cn } from "@/ui-base/lib/util/utils"

const log = getLogger("sites.norg-website.content.hero")

export default function heroComponent(data: ComponentDataProps) {
  log.trace("hero data passed in:", JSON.stringify(data))

  const globalData = data.globalData

  populateMetaData(data)
  const matchingData = data.componentData

  if (data.componentMetaData.variant === "Hero - Image Highlight") {
    return renderImageHighlightHero(data, matchingData, globalData)
  } else if (data.componentMetaData.variant === "Hero - Image Highlight + Description") {
    return renderImageHighlightDescrtipionHero(data, matchingData, globalData)
  } else if (data.componentMetaData.variant === "Hero - Hero CTA Buttons") {
    return renderHeroCTAButtons(data, matchingData, globalData)
  } else if (data.componentMetaData.variant === "Hero - Right Image Hero") {
    return renderRightImageHero(data, matchingData, globalData)
  } else if (
    data.componentMetaData.variant === "Hero - Faded Information Hero"
  ) {
    return renderFadedInformationHero(data, matchingData, globalData)
  } else if (data.componentMetaData.variant === "Hero - Title Only") {
    return renderTitleOnlyHero(data, matchingData, globalData)
  } else if (data.componentMetaData.variant === "Hero - Slim Background") {
    return renderSlimBackgroundHero(data, matchingData, globalData)
  } else if (
    data.componentMetaData.variant === "Hero - Title, Description & Button"
  ) {
    return renderTitleDescriptionButtonHero(data, matchingData, globalData)
  } else if (
    data.componentMetaData.variant === "Hero - Title, Description & Image"
  ) {
    return renderTitleDescriptionImageHero(data, matchingData, globalData)
  } else if (data.componentMetaData.variant === "Hero - Image Only") {
    return renderImageHero(data, matchingData, globalData)
  } else if (data.componentMetaData.variant === "Hero - Image and Button") {
    return renderImageButtonHero(data, matchingData, globalData)
  } else if (
    data.componentMetaData.variant ===
    "Hero - Title, Description & Button With BG Blue Gradient"
  ) {
    return renderTitleDescriptionButtonwithBGBlueGradiantHero(
      data,
      matchingData,
      globalData
    )
  } else if (data.componentMetaData.variant === "Hero - Description & Button") {
    return renderTDescriptionButton(data, matchingData, globalData)
  } else {
    return <></>
  }
}

const renderImageHighlightHero = (data, matchingData, globalData) => {
  const { textAlignClass, justifyClass } = alignmentClasses(matchingData)

  return (
    <>
      <Suspense>
        <DevButton metaData={data.componentMetaData} />
      </Suspense>
      <Hero className="relative z-10 h-[calc(100vh-75px)] overflow-hidden bg-charcoal bg-blend-multiply md:h-[calc(100vh-175px)]">
        {matchingData?.image?.url && (
          <div className="absolute h-full w-full object-scale-down">
            <Image
              src={matchingData.image.url}
              sizes="(max-width: 600px) 90vw, (min-width: 601px) 100vw"
              loading="eager"
              alt={
                matchingData?.image?.media?.altText != ""
                  ? matchingData?.image?.media?.altText
                  : matchingData?.image?.media?.name != ""
                  ? matchingData?.image?.media?.name
                  : matchingData?.name
              }
              fill={true}
              quality={75}
              style={{ objectFit: "cover", objectPosition: "center" }}
              priority={true}
            />
            <div
              style={{ background: "rgba(0,0,0,0.5)" }}
              className="absolute h-full w-full"
            ></div>{" "}
            {/* Add this div */}
          </div>
        )}
        {!matchingData?.hideBreadcrumbs && (
          <Breadcrumbs
            className="!container relative z-10 row-start-1 my-8 w-full self-baseline "
            data={globalData.breadcrumbItems}
            seperatorIcon={<span>/</span>}
            itemClassName="font-comfortaa text-xs font-500 uppercase tracking-0.1em"
            slug={globalData.slug}
          />
        )}
        <Hero.Content className={`!container row-start-2 self-start`}>
          <div
            className={`relative z-100 flex h-full w-full items-center ${justifyClass}`}
          >
            <h1
              style={{
                fontSize: `${matchingData?.fontSize}px`,
                lineHeight: `${matchingData?.lineHeight}px`,
                fontWeight: `${matchingData?.fontWeight}`,
              }}
              className={`font-comfortaa text-h3 font-800 leading-h3 md:text-h1 md:leading-h1 ${textAlignClass}`}
              dangerouslySetInnerHTML={{
                __html: formatHeading(matchingData.heading),
              }}
            />            
          </div>
          <BackToTopAndChatLoader />
        </Hero.Content>
      </Hero>
    </>
  )
}


const renderImageHighlightDescrtipionHero = (data, matchingData, globalData) => {
  const { textAlignClass, justifyClass } = alignmentClasses(matchingData)

  return (
    <>
      <Suspense>
        <DevButton metaData={data.componentMetaData} />
      </Suspense>
      <Hero className="relative z-10 h-[calc(100vh-75px)] overflow-hidden bg-charcoal bg-blend-multiply md:h-[calc(100vh-175px)]">
        {matchingData?.image?.url && (
          <div className="absolute h-full w-full object-scale-down">
            <Image
              src={matchingData.image.url}
              sizes="(max-width: 600px) 90vw, (min-width: 601px) 100vw"
              loading="eager"
              alt={
                matchingData?.image?.media?.altText != ""
                  ? matchingData?.image?.media?.altText
                  : matchingData?.image?.media?.name != ""
                  ? matchingData?.image?.media?.name
                  : matchingData?.name
              }
              fill={true}
              quality={75}
              style={{ objectFit: "cover", objectPosition: "center" }}
              priority={true}
            />
            <div
              style={{ background: "rgba(0,0,0,0.5)" }}
              className="absolute h-full w-full"
            ></div>{" "}
            {/* Add this div */}
          </div>
        )}
        {!matchingData?.hideBreadcrumbs && (
          <Breadcrumbs
            className="!container relative z-10 row-start-1 my-8 w-full self-baseline "
            data={globalData.breadcrumbItems}
            seperatorIcon={<span>/</span>}
            itemClassName="font-comfortaa text-xs font-500 uppercase tracking-0.1em"
            slug={globalData.slug}
          />
        )}
        <Hero.Content className={`!container row-start-2 self-start`}>
          <div
            className={`relative z-100 flex h-full w-full items-center ${justifyClass} flex-col`}
          >
            <h1
              style={{
                fontSize: `${matchingData?.fontSize}px`,
                lineHeight: `${matchingData?.lineHeight}px`,
                fontWeight: `${matchingData?.fontWeight}`,
              }}
              className={`font-comfortaa text-h3 font-800 leading-h3 md:text-h1 md:leading-h1 ${textAlignClass}  w-full`}
              dangerouslySetInnerHTML={{
                __html: formatHeading(matchingData.heading),
              }}
            />
            <div
              style={{
                fontSize: `16px`,
                lineHeight: `32px`
              }}
              className={`mt-6 font-comfortaa text-h3 font-800 leading-h3 md:text-h1 md:leading-h1 ${textAlignClass} w-full`}
              dangerouslySetInnerHTML={{
                __html: formatHeading(matchingData.description),
              }}
            />
            
          </div>
          <BackToTopAndChatLoader />
        </Hero.Content>
      </Hero>
    </>
  )
}

const renderHeroCTAButtons = (data, matchingData, globalData) => {
  const { textAlignClass, justifyClass } = alignmentClasses(globalData)
  return (
    <>
      <Suspense>
        <DevButton metaData={data.componentMetaData} />
      </Suspense>
      <Hero className="relative overflow-hidden sm:min-h-96">
        {!matchingData?.hideBreadcrumbs && (
          <Breadcrumbs
            className="!container row-start-1 my-8 w-full self-baseline "
            data={globalData.breadcrumbItems}
            seperatorIcon={<span>/</span>}
            itemClassName="font-comfortaa text-xs font-500 uppercase tracking-0.1em"
            slug={globalData.slug}
          />
        )}
        <Hero.Content
          className={cn("!container row-start-2 mb-12 self-start md:mb-20")}
        >
          <div
            className={cn("flex w-full flex-col", {
              // "sm:justify-center sm:items-center" : matchingData?.centerAlign
            })}
          >
            <h1
              style={{
                fontSize: `${matchingData?.fontSize}px`,
                lineHeight: `${matchingData?.lineHeight}px`,
                fontWeight: `${matchingData?.fontWeight}`,
              }}
              className={`text-h3 font-800 leading-h3 md:text-h2 md:leading-h2 ${textAlignClass}`}
              dangerouslySetInnerHTML={{
                __html: formatHeading(matchingData.heading),
              }}
            />
            <div
              className={`sm: mt-6 flex flex-col gap-4 sm:flex-row sm:items-center${justifyClass}`}
            >
              {heroLinks(matchingData?.heroButtonUrls)}
            </div>
            {/* // if description / "on this page data" is rich text then render it as html  */}
            <div className={`flex w-full ${justifyClass}`}>
              <div
                className={cn(
                  "mt-6 grid w-full grid-cols-1 gap-y-1 sm:mt-8 sm:w-1/2 md:w-4/6 [&>*]:my-0",
                  {
                    hidden: !matchingData?.description,
                    [textAlignClass]: textAlignClass,
                  }
                )}
                dangerouslySetInnerHTML={{
                  __html: filterAndUpdateClass(
                    matchingData?.description,
                    data.globalData?.languageSite
                  ),
                }}
              />
            </div>
          </div>
          <BackToTopAndChatLoader />
        </Hero.Content>
      </Hero>
    </>
  )
}

// dynamic alignment style for this component is not needed as the image is always on the right
const renderRightImageHero = (data, matchingData, globalData) => {
  const linksListData = { links: [] }
  linksListData.links = matchingData?.pageSectionListing?.map(
    ({ content: { pageSectionTitle, pageSectionURL } }) => {
      return {
        name: pageSectionTitle,
        url: pageSectionURL,
      }
    }
  )
  return (
    <>
      <Suspense>
        <DevButton metaData={data.componentMetaData} />
      </Suspense>
      <Hero className="bg-charcoal20 relative overflow-hidden sm:min-h-96">
        {!matchingData?.hideBreadcrumbs && (
          <Breadcrumbs
            className="!container row-start-1 my-8 w-full self-baseline "
            data={globalData.breadcrumbItems}
            seperatorIcon={<span className="mx-1.5">/</span>}
            itemClassName="font-comfortaa text-xs font-500 uppercase tracking-0.1em before:!hidden last:invisible [&>a]:visible"
            slug={globalData.slug}
          />
        )}
        <Hero.Content className="!container relative row-start-2 mb-4 self-start sm:my-14 md:mb-14">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="flex flex-col">
              <h1
                style={{
                  fontSize: `${matchingData?.fontSize}px`,
                  lineHeight: `${matchingData?.lineHeight}px`,
                  fontWeight: `${matchingData?.fontWeight}`,
                }}
                className="text-h3 font-800 leading-h3 md:text-h2 md:leading-h2"
                dangerouslySetInnerHTML={{
                  __html: formatHeading(matchingData.heading),
                }}
              />

              {/* // if description is rich text then render it as html  */}
              <div
                className={cn(
                  "mt-4 grid grid-cols-1 justify-items-start sm:mt-6 [&>*]:mt-0",
                  {
                    hidden: !matchingData?.description,
                  }
                )}
                dangerouslySetInnerHTML={{
                  __html: filterAndUpdateClass(
                    matchingData?.description,
                    globalData.languageSite
                  ),
                }}
              />
              <div
                className={cn("mt-6 hidden sm:mt-8 sm:block", {
                  "!hidden":
                    !linksListData?.links || linksListData?.links?.length < 0,
                })}
              >
                {renderLinkList(
                  linksListData,
                  "SimpleLinkList",
                  globalData.languageSite
                )}
              </div>
            </div>
            <div className="mb-6 flex items-start justify-center">
              <Image
                src={matchingData?.image?.url}
                alt={
                  matchingData?.image?.media?.altText != ""
                    ? matchingData?.image?.media?.altText
                    : matchingData?.image?.media?.name != ""
                    ? matchingData?.image?.media?.name
                    : matchingData?.name
                }
                width={700}
                height={500}
                className="h-96 min-h-100 object-contain"
              />
            </div>
            <div
              className={cn("block sm:hidden", {
                "!hidden":
                  !linksListData?.links || linksListData?.links?.length < 0,
              })}
            >
              {renderLinkList(
                linksListData,
                "SimpleLinkList",
                globalData.languageSite
              )}
            </div>
          </div>
          <BackToTopAndChatLoader />
        </Hero.Content>
      </Hero>
    </>
  )
}

const renderFadedInformationHero = (data, matchingData, globalData) => {
  var { textAlignClass, justifyClass } = alignmentClasses(matchingData)

  return (
    <>
      <Suspense>
        <DevButton metaData={data.componentMetaData} />
      </Suspense>
      <Hero
        className="relative overflow-hidden bg-blend-multiply"
        style={{
          backgroundImage: `url('${matchingData?.image?.url}')`,
        }}
      >
        <Hero.Content
          className={`min-h-81 w-full max-w-full bg-gradient-to-b from-gray-100 from-60% via-gray-100 via-30% px-0 pb-56 md:bg-gradient-to-r md:pb-0`}
        >
          <div className="container my-4 w-full text-left">
            <div
              className="absolute inset-y-[-3vh] left-0 -translate-x-1/2 opacity-80 mix-blend-normal md:inset-y-[-5vh] md:translate-x-[-8vw]"
              style={{ zIndex: 1 }}
            ></div>
            {!matchingData?.hideBreadcrumbs && (
              <Breadcrumbs
                className="w-full text-left"
                data={globalData.breadcrumbItems}
                seperatorIcon={<span>/</span>}
                innerProps={{
                  className: "float-left mb-8 sm:mb-12 w-full text-xs",
                }}
                itemClassName="font-comfortaa text-xs font-500 uppercase tracking-0.1em"
                slug={globalData.slug}
              />
            )}
            <div className={cn("relative flex h-full w-full", justifyClass)}>
              <div className="w-full md:w-3/4">
                <h1
                  style={{
                    fontSize: `${matchingData?.fontSize}px`,
                    lineHeight: `${matchingData?.lineHeight}px`,
                    fontWeight: `${matchingData?.fontWeight}`,
                  }}
                  className={`mb-12 font-comfortaa text-h3 font-800 leading-h3 text-my-brown-grey md:text-h2 md:leading-h2 ${textAlignClass}`}
                  dangerouslySetInnerHTML={{
                    __html: formatHeading(matchingData.heading),
                  }}
                />
                <div
                  className={`font-comfortaa text-base font-400 leading-6 text-my-brown-grey ${textAlignClass}`}
                  dangerouslySetInnerHTML={{
                    __html: filterAndUpdateClass(
                      matchingData?.description,
                      globalData.languageSite
                    ),
                  }}
                />
              </div>
            </div>
          </div>
          <BackToTopAndChatLoader />
        </Hero.Content>
      </Hero>
    </>
  )
}

function renderTitleOnlyHero(
  data: ComponentDataProps,
  matchingData: any,
  globalData: any
) {
  const { textAlignClass, alignItemsClass } = alignmentClasses(matchingData)
  return (
    <>
      <Suspense>
        <DevButton metaData={data.componentMetaData} />
      </Suspense>
      <Hero className="relative overflow-hidden">
        {!matchingData?.hideBreadcrumbs && (
          <Breadcrumbs
            className="!container row-start-1 my-8 w-full self-baseline "
            data={globalData.breadcrumbItems}
            seperatorIcon={<span>/</span>}
            itemClassName="font-comfortaa text-xs font-500 uppercase tracking-0.1em"
            slug={globalData.slug}
          />
        )}
        <Hero.Content className="!container row-start-2 self-start">
          <div className={`flex w-full flex-col ${alignItemsClass}`}>
            <h1
              style={{
                fontSize: `${matchingData?.fontSize}px`,
                lineHeight: `${matchingData?.lineHeight}px`,
                fontWeight: `${matchingData?.fontWeight}`,
              }}
              className={`md:font-700 mb-[26px] max-w-full font-comfortaa text-[22px] font-600 leading-[26px] md:mb-[27px] md:max-w-[850px] md:text-h2 md:leading-[40px] ${textAlignClass}`}
              dangerouslySetInnerHTML={{
                __html: formatHeading(matchingData.heading),
              }}
            />
          </div>
          <BackToTopAndChatLoader />
        </Hero.Content>
      </Hero>
    </>
  )
}

function renderSlimBackgroundHero(
  data: ComponentDataProps,
  matchingData: any,
  globalData: any
) {
  const { textAlignClass, justifyClass } = alignmentClasses(matchingData)

  return (
    <>
      <Suspense>
        <DevButton metaData={data.componentMetaData} />
      </Suspense>
      <Hero className="relative z-10 min-h-81 overflow-hidden bg-charcoal bg-blend-multiply">
        {matchingData?.image?.url && (
          <div className="absolute h-full w-full object-scale-down">
            <Image
              src={matchingData?.image?.url}
              sizes="(max-width: 600px) 90vw, (min-width: 601px) 100vw,(max-height: 325px) 90vw, (min-height: 325px) 100vw"
              loading="eager"
              alt={
                matchingData?.image?.media?.altText != ""
                  ? matchingData?.image?.media?.altText
                  : matchingData?.image?.media?.name != ""
                  ? matchingData?.image?.media?.name
                  : matchingData?.name
              }
              fill={true}
              quality={75}
              style={{ objectFit: "cover", objectPosition: "center" }}
              priority={true}
            />
            <div
              style={{ background: "rgba(0,0,0,0.5)" }}
              className="absolute h-full w-full"
            ></div>{" "}
            {/* Add this div */}
          </div>
        )}
        {!matchingData?.hideBreadcrumbs && (
          <Breadcrumbs
            className="!container relative z-10 row-start-1 my-8 mb-0 w-full self-baseline"
            data={globalData.breadcrumbItems}
            seperatorIcon={<span>/</span>}
            itemClassName="font-comfortaa text-xs font-500 uppercase tracking-0.1em text-my-white"
            slug={globalData.slug}
          />
        )}
        <Hero.Content className="!container row-start-2 self-start">
          <div
            className={`relative flex h-full w-full items-center ${justifyClass}`}
          >
            <h1
              style={{
                fontSize: `${matchingData?.fontSize}px`,
                lineHeight: `${matchingData?.lineHeight}px`,
                fontWeight: `${matchingData?.fontWeight}`,
              }}
              className={`font-comfortaa text-h3 font-800 leading-h3 text-white md:text-h2 md:leading-h1 ${textAlignClass}`}
              dangerouslySetInnerHTML={{
                __html: formatHeading(matchingData.heading),
              }}
            />
          </div>
          <BackToTopAndChatLoader />
        </Hero.Content>
      </Hero>
    </>
  )
}

function renderTitleDescriptionButtonHero(
  data: ComponentDataProps,
  matchingData: any,
  globalData: any
) {
  const { textAlignClass, justifyClass, alignItemsClass } =
    alignmentClasses(matchingData)
  return (
    <>
      <Suspense>
        <DevButton metaData={data.componentMetaData} />
      </Suspense>
      <Hero className="relative overflow-hidden py-[70px] md:py-[110px]">
        {!matchingData?.hideBreadcrumbs && (
          <Breadcrumbs
            className="!container row-start-1 my-8 w-full self-baseline "
            data={globalData.breadcrumbItems}
            seperatorIcon={<span>/</span>}
            itemClassName="font-comfortaa text-xs font-500 uppercase tracking-0.1em"
            slug={globalData.slug}
          />
        )}
        <Hero.Content className="container py-0">
          <div className={`flex w-full flex-col ${alignItemsClass}`}>
            <h1
              style={{
                fontSize: `${matchingData?.fontSize}px`,
                lineHeight: `${matchingData?.lineHeight}px`,
                fontWeight: `${matchingData?.fontWeight}`,
              }}
              className={`mb-[24px] max-w-full font-comfortaa text-[22px] font-600 leading-[26px] md:max-w-[850px] md:text-h2 md:leading-[55px] ${textAlignClass}`}
              dangerouslySetInnerHTML={{
                __html: formatHeading(matchingData.heading),
              }}
            />

            {/* // if description is rich text then render it as html  */}
            <div className={`flex w-full ${justifyClass}`}>
              <div
                className={cn(
                  "w-full max-w-full md:max-w-[625px] [&>p]:text-[13px] [&>p]:leading-[20px] [&>p]:md:text-[18px] [&>p]:md:leading-[28px]",
                  {
                    hidden: !matchingData?.description,
                    [textAlignClass]: textAlignClass,
                  }
                )}
                dangerouslySetInnerHTML={{
                  __html: filterAndUpdateClass(
                    matchingData?.description,
                    data.globalData?.languageSite
                  ),
                }}
              />
            </div>
            {/* // if button available then display  */}
            <div>{heroLinks(matchingData?.heroButtonUrls)}</div>
          </div>
          <BackToTopAndChatLoader />
        </Hero.Content>
      </Hero>
    </>
  )
}

function renderImageHero(
  data: ComponentDataProps,
  matchingData: any,
  globalData: any
) {
  const { alignItemsClass } = alignmentClasses(matchingData)
  return (
    <>
      <Suspense>
        <DevButton metaData={data.componentMetaData} />
      </Suspense>
      <Hero className="relative py-[50px]">
        {!matchingData?.hideBreadcrumbs && (
          <Breadcrumbs
            className="!container row-start-1 my-8 w-full self-baseline "
            data={globalData.breadcrumbItems}
            seperatorIcon={<span>/</span>}
            itemClassName="font-comfortaa text-xs font-500 uppercase tracking-0.1em"
            slug={globalData.slug}
          />
        )}
        <Hero.Content className="!container row-start-2 self-start">
          <div className={`flex w-full flex-col ${alignItemsClass}`}>
            {/* // if description is rich text then render it as html  */}
            {matchingData?.image?.url && (
              <Image
                src={matchingData.image.url}
                sizes="(max-width: 600px) 90vw, (min-width: 601px) 100vw"
                loading="eager"
                alt={
                  matchingData?.image?.media?.altText != ""
                    ? matchingData?.image?.media?.altText
                    : matchingData?.image?.media?.name != ""
                    ? matchingData?.image?.media?.name
                    : matchingData?.name
                }
                className="!relative"
                fill={true}
                quality={75}
                style={{ objectFit: "cover", objectPosition: "center" }}
                priority={true}
              />
            )}
          </div>

          <BackToTopAndChatLoader />
        </Hero.Content>
      </Hero>
    </>
  )
}

function renderImageButtonHero(
  data: ComponentDataProps,
  matchingData: any,
  globalData: any
) {
  const { alignItemsClass } = alignmentClasses(matchingData)
  return (
    <>
      <Suspense>
        <DevButton metaData={data.componentMetaData} />
      </Suspense>
      <Hero className="relative py-[50px]">
        {!matchingData?.hideBreadcrumbs && (
          <Breadcrumbs
            className="!container row-start-1 my-8 w-full self-baseline "
            data={globalData.breadcrumbItems}
            seperatorIcon={<span>/</span>}
            itemClassName="font-comfortaa text-xs font-500 uppercase tracking-0.1em"
            slug={globalData.slug}
          />
        )}
        <Hero.Content className="!container row-start-2 self-start">
          <div className={`flex w-full flex-col ${alignItemsClass}`}>
            {/* // if description is rich text then render it as html  */}
            {matchingData?.image?.url && (
              <Image
                src={matchingData.image.url}
                sizes="(max-width: 600px) 90vw, (min-width: 601px) 100vw"
                loading="eager"
                alt={
                  matchingData?.image?.media?.altText != ""
                    ? matchingData?.image?.media?.altText
                    : matchingData?.image?.media?.name != ""
                    ? matchingData?.image?.media?.name
                    : matchingData?.name
                }
                className="!relative"
                fill={true}
                quality={75}
                style={{ objectFit: "cover", objectPosition: "center" }}
                priority={true}
              />
            )}
            {/* // if button available then display  */}
            <div>{heroLinks(matchingData?.heroButtonUrls)}</div>
          </div>

          <BackToTopAndChatLoader />
        </Hero.Content>
      </Hero>
    </>
  )
}

function renderTitleDescriptionImageHero(
  data: ComponentDataProps,
  matchingData: any,
  globalData: any
) {
  const { textAlignClass, justifyClass, alignItemsClass } =
    alignmentClasses(matchingData)

  return (
    <>
      <Suspense>
        <DevButton metaData={data.componentMetaData} />
      </Suspense>
      <Hero className="relative py-[50px]">
        {!matchingData?.hideBreadcrumbs && (
          <Breadcrumbs
            className="!container row-start-1 my-8 w-full self-baseline "
            data={globalData.breadcrumbItems}
            seperatorIcon={<span>/</span>}
            itemClassName="font-comfortaa text-xs font-500 uppercase tracking-0.1em "
            slug={globalData.slug}
          />
        )}
        <Hero.Content className="!container row-start-2 self-start">
          <div className={`flex w-full flex-col ${alignItemsClass}`}>
            <h1
              style={{
                fontSize: `${matchingData?.fontSize}px`,
                lineHeight: `${matchingData?.lineHeight}px`,
                fontWeight: `${matchingData?.fontWeight}`,
              }}
              className={`mb-[24px] max-w-full font-comfortaa text-[22px] font-600 leading-[26px] md:max-w-[850px] md:text-h2 md:leading-[55px] ${textAlignClass}`}
              dangerouslySetInnerHTML={{
                __html: formatHeading(matchingData.heading),
              }}
            />

            {/* // if description is rich text then render it as html  */}
            <div className={`flex w-full ${justifyClass}`}>
              <div
                className={cn(
                  "mb-[24px] w-full max-w-full md:max-w-[625px] [&>p]:text-[13px] [&>p]:leading-[20px] [&>p]:md:text-[18px] [&>p]:md:leading-[28px]",
                  {
                    hidden: !matchingData?.description,
                    [textAlignClass]: textAlignClass,
                  }
                )}
                dangerouslySetInnerHTML={{
                  __html: filterAndUpdateClass(
                    matchingData?.description,
                    data.globalData?.languageSite
                  ),
                }}
              />
            </div>
            {matchingData?.image?.url && (
              <Image
                src={matchingData.image.url}
                sizes="(max-width: 600px) 90vw, (min-width: 601px) 100vw"
                loading="eager"
                alt={
                  matchingData?.image?.media?.altText != ""
                    ? matchingData?.image?.media?.altText
                    : matchingData?.image?.media?.name != ""
                    ? matchingData?.image?.media?.name
                    : matchingData?.name
                }
                className="!relative"
                fill={true}
                quality={75}
                style={{ objectFit: "cover", objectPosition: "center" }}
                priority={true}
              />
            )}
          </div>
          <BackToTopAndChatLoader />
        </Hero.Content>
      </Hero>
    </>
  )
}

function renderTitleDescriptionButtonwithBGBlueGradiantHero(
  data: ComponentDataProps,
  matchingData: any,
  globalData: any
) {
  const { textAlignClass, justifyClass, alignItemsClass } =
    alignmentClasses(matchingData)

  return (
    <div className="relative z-10 w-full bg-gradient-to-r from-indigo-500 to-indigo-600">
      <Suspense>
        <DevButton metaData={data.componentMetaData} />
      </Suspense>
      <Hero className="relative overflow-hidden bg-my-indigo pb-[71px] pt-[81px] md:pb-[93px] md:pt-[108px]">
        {!matchingData?.hideBreadcrumbs && (
          <Breadcrumbs
            className="!container row-start-1 my-8 w-full self-baseline "
            data={globalData.breadcrumbItems}
            seperatorIcon={<span>/</span>}
            itemClassName="font-comfortaa text-xs font-500 uppercase tracking-0.1em text-my-white"
            slug={globalData.slug}
          />
        )}
        <Hero.Content className="container py-0">
          <div className={`flex w-full flex-col ${alignItemsClass}`}>
            <h1
              style={{
                fontSize: `${matchingData?.fontSize}px`,
                lineHeight: `${matchingData?.lineHeight}px`,
                fontWeight: `${matchingData?.fontWeight}`,
              }}
              className={`mb-[13px] max-w-full text-center text-h4 font-600 leading-h4 text-my-white md:mb-[23px] md:max-w-full md:text-h1 md:leading-h1 ${textAlignClass}`}
              dangerouslySetInnerHTML={{
                __html: formatHeading(matchingData.heading),
              }}
            />

            {/* // if description is rich text then render it as html  */}
            <div className={`flex w-full ${justifyClass}`}>
              <div
                className={cn(
                  "w-full max-w-[288px] text-center md:max-w-[625px]",
                  {
                    hidden: !matchingData?.description,
                    [textAlignClass]: textAlignClass,
                  }
                )}
                dangerouslySetInnerHTML={{
                  __html: filterAndUpdateClass(
                    matchingData?.description,
                    data.globalData?.languageSite
                  ),
                }}
              />
            </div>
            {/* // if button available then display  */}
            <div>{heroLinks(matchingData?.heroButtonUrls)}</div>
          </div>
          <BackToTopAndChatLoader />
        </Hero.Content>
      </Hero>
    </div>
  )
}

function renderTDescriptionButton(
  data: ComponentDataProps,
  matchingData: any,
  globalData: any
) {
  const { textAlignClass, justifyClass, alignItemsClass } =
    alignmentClasses(matchingData)
  return (
    <div
      className={`relative w-full px-[20px] py-[43px] md:px-[30px] md:py-[73px]`}
    >
      <Suspense>
        <DevButton metaData={data.componentMetaData} />
      </Suspense>
      <Hero className="relative overflow-hidden">
        {!matchingData?.hideBreadcrumbs && (
          <Breadcrumbs
            className="!container row-start-1 my-8 w-full self-baseline "
            data={globalData.breadcrumbItems}
            seperatorIcon={<span>/</span>}
            itemClassName="text-xs font-500 uppercase tracking-0.1em"
            slug={globalData.slug}
          />
        )}
        <Hero.Content className="w-full !max-w-full rounded-[5px] border border-gray-700 bg-my-btntext pb-[92px] pt-[66px] md:py-[110px]">
          <div className={`flex w-full flex-col ${alignItemsClass}`}>
            {/* // if description is rich text then render it as html  */}
            <div className={`flex w-full ${justifyClass}`}>
              <div
                className={cn(
                  "w-full max-w-full text-center md:max-w-[1024px] [&>p]:!text-[18px] [&>p]:!leading-[26px] [&>p]:!tracking-[-1.3px] [&>p]:!text-my-grey4 [&>p]:md:!text-[28px] [&>p]:md:!leading-[40px] [&>p]:lg:!text-[34px]",
                  {
                    hidden: !matchingData?.description,
                    [textAlignClass]: textAlignClass,
                  }
                )}
                dangerouslySetInnerHTML={{
                  __html: filterAndUpdateClass(
                    matchingData?.description,
                    data.globalData?.languageSite
                  ),
                }}
              />
            </div>
            {/* // if button available then display  */}
            <div>{heroLinks(matchingData?.heroButtonUrls)}</div>
          </div>
          <BackToTopAndChatLoader />
        </Hero.Content>
      </Hero>
    </div>
  )
}

export const heroLinks = (data: any) => {
  return data?.map(({ content }) => (
    <div>
      <Link
        className={`mt-[22px] box-border inline-block w-full rounded-[8px] px-5 py-2.5 text-center text-[12px] font-500 capitalize leading-[18px] text-my-black-33 transition hover:bg-my-black hover:text-my-white md:mt-[46px] md:text-body3 md:leading-[21px] ${getSectionBackgroundColour(
          content?.buttonBackgroundColour,
          "bg-my-black"
        )} ${getSectionTextColour(content?.buttonFontColour, "bg-my-white")}`}
        href={content?.buttonsURL?.url ?? ""}
        prefetch={checkPrefetchAvailability(content?.url)}
        data-attr-prefetch={checkPrefetchAvailability(content?.url)}
      >
        {content?.buttonText
          ? content?.buttonText
          : content?.buttonsURL?.name
          ? content?.buttonsURL?.name
          : ""}
      </Link>
    </div>
  ))
}
export const renderLinkList = (
  data: { heading?: string; links: LinksListLinkProps[] },
  variant: string,
  languageSite: LanguageSite
) => {
  if (!data) return null
  if (variant === "SimpleLinkList") {
    const SimpleAnchorLists = dynamic(
      () =>
        import("@/ui-base/components/ui/links/simpleAnchorListsClientLoader")
    )
    return (
      <LinksList
        heading={data?.heading ?? "On this page:"}
        className="max-w-screen-md py-4 capitalize text-my-blue"
        headingClassName={
          "mb-2 text-body1 font-800 capitalize leading-body1 text-my-blue"
        }
      >
        <Suspense fallback={<div>Links Loading...</div>}>
          <SimpleAnchorLists
            links={data?.links ?? []}
            className="grid max-w-max grid-cols-1 gap-x-8 md:grid-cols-2"
            useNextLink
            languageSite={languageSite}
          />
        </Suspense>
      </LinksList>
    )
  }
  return null
}

function populateMetaData(data: ComponentDataProps) {
  data.componentMetaData.dataProvided = data.componentData
  // Get the relative path of the current file
  data.componentMetaData.rendering =
    "sites/norg-website/content/heartcore/components/hero/heroComponent.tsx"
  // Get the name of the current function
  data.componentMetaData.renderingExportFunction = "heroComponent"
}
