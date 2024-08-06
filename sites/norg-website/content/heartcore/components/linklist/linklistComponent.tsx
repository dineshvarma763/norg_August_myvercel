import DevButton from "@/ui-base/components/ui/developer/devButton"
import LinksList from "@/ui-base/components/ui/links/LinksList"
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"
import { ComponentDataProps, getComponentMetaData } from "@/ui-base/lib/services/data/componentMetaDataService"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { getSectionBackgroundColour } from "@/ui-base/lib/util/getSectionBackgroundColour"
import dynamic from "next/dynamic"
import { Suspense } from "react"

const log = getLogger("sites.norg-website.content.linklist")

export default function linklistComponent(data: ComponentDataProps) {
  let newData = Object.assign({}, data);

  let languageSite = data.globalData?.languageSite ? data.globalData.languageSite : data?.componentMetaData?.languageSite;

  if(!newData.componentMetaData){
    newData.componentMetaData = getComponentMetaData();
  }
  populateMetaData(newData);

  let matchingData = newData.componentData

  if (!matchingData) {
    matchingData = {}
  }

  const classWrapper = getWrapperClasses(newData.componentMetaData.isInsideGrid)
  let variant = newData.componentMetaData.variant ? newData.componentMetaData.variant : newData.componentData.selectableVariant;

  if (variant === "Links Listing - Button Links") {
    return renderButtonsLinks(newData, matchingData, classWrapper, languageSite)
  } else if (
    variant === "Links Listing - Download Links"
  ) {
    return renderDownloadLinks(newData, matchingData, classWrapper, languageSite)
  } else if (
    variant === "Links Listing - Simple Anchor Lists"
  ) {
    return renderAnchorLinks(newData, matchingData, classWrapper, languageSite)
  }else if (
    variant === "Links Listing - Small Download Lists"
  ) {
    return renderSmallDownloadLists(newData, matchingData, classWrapper, languageSite)
  } else {
    return (<></>)
  }
}

function renderButtonsLinks(
  data: ComponentDataProps,
  matchingData: any,
  classWrapper: string,
  languageSite: LanguageSite
) {
  return (
    <div className={`${classWrapper} ${getSectionBackgroundColour(matchingData?.backgroundColour, "")}`}  >
      <Suspense><DevButton metaData={data.componentMetaData} /></Suspense>
      <LinksList
        className=""
        innerClassName="grid grid-cols-1 gap-4 sm:grid-cols-2"
        // heading={
        //   matchingData.heading ??
        //   matchingData?.linksListings[0]?.content?.heading
        // }
        headingClassName="font-urbanist text-h4 font-800 leading-h4 text-black"
      >
        {matchingData?.linksListings?.map((column, index) => (
          <LinksList.ButtonLinksList
            key={index}
            links={column.content.links}
            className="p-0 font-urbanist"
            linkClassName="mb-4 bg-my-yellow px-4 py-3 text-center font-urbanist text-base font-800 uppercase tracking-0.1em text-my-blue transition hover:bg-my-blue hover:text-my-white md:mb-6"
            useNextLink
            languageSite={languageSite}
          />
        ))}
      </LinksList>
    </div>
  )
}

function renderDownloadLinks(
  data: ComponentDataProps,
  matchingData: any,
  classWrapper: string,
  languageSite: LanguageSite
) {
  return (
    <div className={`${classWrapper} ${getSectionBackgroundColour(matchingData?.backgroundColour, "")}`}>
      <Suspense><DevButton metaData={data.componentMetaData} /></Suspense>
      {matchingData?.linksListings?.map((item, index) => {
        const links = item?.content?.mediaLinks?.map((link) => ({
          ...link?.media,
          icon: item?.content?.icon?.url,
        }))

        return (
          <LinksList
            key={index}
            heading={item.content.heading}
            headingClassName="mb-10 text-h4 font-bold capitalize leading-h4 text-my-blue"
            className={`p-8 ${getSectionBackgroundColour(matchingData?.backgroundColour, "bg-charcoal20")} mb-24 w-full md:mb-20 md:w-72`}
          >
            <LinksList.DownloadLinks
              links={links}
              className="items-start p-0 font-urbanist"
              linkClassName="text-button leading-button flex items-start font-500 text-my-blue underline [&>img]:m-0.5"
              useNextLink={false}
              languageSite={languageSite}
            />
          </LinksList>
        )
      })}
    </div>
  )
}

function renderAnchorLinks(
  data: ComponentDataProps,
  matchingData: any,
  classWrapper: string,
  languageSite: LanguageSite
) {
  const SimpleAnchorLists = dynamic(() => import('@/ui-base/components/ui/links/simpleAnchorListsClientLoader'));
  return (
    <div
      className={`${classWrapper} grid grid-cols-1 gap-8 md:grid-cols-2 ${getSectionBackgroundColour(matchingData?.backgroundColour, "")}`}>
      <Suspense><DevButton metaData={data.componentMetaData} /></Suspense>
      {matchingData?.linksListings?.map((item, index) => (
        <LinksList
          key={index}
          heading={item.content.heading}
          className=" py-4 capitalize text-my-blue"
          headingClassName="mb-2 text-body1 font-800 capitalize leading-body1 text-my-blue"
        >
          <SimpleAnchorLists
            links={item.content.links}
            className="grid max-w-max grid-cols-1 gap-x-8 font-urbanist md:grid-cols-2"
            linkClassName=""
            useNextLink
            languageSite={languageSite}
          />
        </LinksList>
      ))}
    </div>
  )
}

function renderSmallDownloadLists(
  data: ComponentDataProps,
  matchingData: any,
  classWrapper: string,
  languageSite: LanguageSite
) {
  return (
    <div className={`${classWrapper} ${getSectionBackgroundColour(matchingData?.backgroundColour, "")}`}>
      <Suspense><DevButton metaData={data.componentMetaData} /></Suspense>
      {matchingData?.linksListings?.map((item, index) => {
        const links = item.content.mediaLinks?.map((link) => ({
          ...link?.media,
          icon: item?.content?.icon?.url,
        }))

        return (
          <LinksList
            key={index}
            heading={item.content.heading}
            className=" -m-1 inline-block w-full px-2 py-4 pb-10 align-top capitalize text-my-blue md:w-1/4"
            headingClassName="mb-2 text-body1 font-800 capitalize leading-body1 text-my-blue"
          >
            <LinksList.DownloadLinks
              links={links}
              className="items-start p-0 font-urbanist"
              linkClassName="text-button leading-button flex items-start font-500 text-my-blue underline [&>img]:m-0.5"
              useNextLink={false}
              languageSite={languageSite}
            />
          </LinksList>
        )
      })}
    </div>
  )
}

function getWrapperClasses(isGridWrapper: boolean) {
  let wrapper = "relative w-full container"

  if (isGridWrapper) {
    wrapper = "relative w-full sm:pl-6"
  }
  return wrapper
}

function populateMetaData(data: ComponentDataProps) {

  data.componentMetaData.dataProvided = data.componentData;
  // Get the relative path of the current file
  data.componentMetaData.rendering = "sites/norg-website/content/heartcore/components/linklist/linklistComponent.tsx";
  // Get the name of the current function
  data.componentMetaData.renderingExportFunction = "linklistComponent";
}
