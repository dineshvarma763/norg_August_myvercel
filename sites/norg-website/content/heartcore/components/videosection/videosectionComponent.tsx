import { Suspense } from "react"

import DevButton from "@/ui-base/components/ui/developer/devButton"
import { ComponentDataProps } from "@/ui-base/lib/services/data/componentMetaDataService"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { alignmentClasses } from "@/ui-base/lib/util/utils"
import { replaceString } from "@/ui-base/lib/util/replaceString"
import { getSectionBackgroundColour } from "@/ui-base/lib/util/getSectionBackgroundColour"

const log = getLogger("ui-base.cms.heartcore.content.videosection")

function getVideoIDfromURL(url: string) {
  // Regular expression pattern to match YouTube video ID
  const pattern =
    /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/

  // Extract the video ID using match() and the pattern
  const matches = url.match(pattern)
  const videoId = matches && matches[1]
  return videoId
}

const YouTubeEmbed = ({ videoId }) => {
  return (
    <div className="w-full" id={videoId}>
      <iframe
        title="YouTube Video"
        className="aspect-video h-full w-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  )
}
const VideoSection = ({ id, title, description, videoLink, bgColour, align }) => {
  const { alignItemsClass, textAlignClass } = alignmentClasses({
    align: align || "left",
  })

  if(id)
    id = "id-"+replaceString(id, "-", "");

  return (
    <section id={id} className={`py-20 odd:bg-white md:py-32 ${bgColour}`}>
      <div className={`container flex flex-col ${alignItemsClass}`}>
        <h2
          className={`mb-5 text-h4 font-extrabold leading-h4 text-my-blue md:mb-8 md:text-h3 md:leading-h3 ${textAlignClass}`}
        >
          {title}
        </h2>
        <p className={`mb-8 text-sm text-my-black ${textAlignClass}`}>
          {description}
        </p>
        {videoLink.map((video, index) => (
          <YouTubeEmbed key={index} videoId={getVideoIDfromURL(video.url)} />
        ))}
      </div>
    </section>
  )
}

export default function videoSectionComponent(data: ComponentDataProps) {
  /* log.debug("videosection data passed in:", JSON.stringify(data)); */
  populateMetaData(data)

  const backgroundColour = data?.componentData?.backgroundColour;
  return (
    <>
      <div className={`relative w-full`}>
        <Suspense>
          <DevButton metaData={data.componentMetaData} />
        </Suspense>
        <VideoSection
          id={data.componentData?.id}
          title={data.componentData.title}
          description={data.componentData.description}
          bgColour={getSectionBackgroundColour(backgroundColour, "")}
          videoLink={data.componentData.videoLink}
          align={data.componentData.align}
        />
      </div>
    </>
  )
}

function populateMetaData(data: ComponentDataProps) {
  data.componentMetaData.dataProvided = data.componentData
  // Get the relative path of the current file
  data.componentMetaData.rendering =
    "sites/norg-website/content/heartcore/components/videosection/videosectionComponent.tsx"
  // Get the name of the current function
  data.componentMetaData.renderingExportFunction = "videoSectionComponent"
}
