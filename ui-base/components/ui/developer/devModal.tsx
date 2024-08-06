import { useState } from "react"
import ResponsiveTabs from "@/sites/norg-website/components/ResponsiveTabs"
import { faVideo } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { ComponentMetaData } from "@/ui-base/lib/services/data/componentMetaDataService"
import { capitalizeFirstChars, convertToDate } from "@/ui-base/lib/util/utils"
import { ExampleCodeJSON } from "../code"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tabs"

const Modal = ({
  onClose,
  metaData,
}: {
  onClose: () => void
  metaData: ComponentMetaData
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center text-black">
      <div className="max-h-500 relative z-10 mx-auto w-2/3 rounded-md bg-white p-6 shadow-md max-sm:max-h-[90vh]  max-sm:min-w-[300px]">
        <button
          onClick={onClose}
          className="absolute right-2 top-2 text-gray-400 hover:text-gray-500"
        >
          &times;
        </button>

        <ResponsiveTabs
          data={[
            { content: { title: "General" } },
            { content: { title: "Content Editor" } },
            { content: { title: "Developer" } },
          ]}
        >
          <TabsContent value={"0"}>{GetGeneralDetails(metaData)}</TabsContent>
          <TabsContent value={"1"}>
            {GetContentEditorInformation(metaData)}
          </TabsContent>
          <TabsContent value={"2"} className="max-sm:max-h-[75vh] max-sm:overflow-scroll">
            {GetDeveloperInformation(metaData)}
          </TabsContent>
        </ResponsiveTabs>
      </div>
      <div
        className="fixed inset-0 z-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
    </div>
  )
}

export default Modal

function GetDeveloperInformation(metaData: ComponentMetaData) {
  return (
    <>
      {metaData && (
        <div className="columns-1 text-black text-xs">
          <div className="w-full">
            <strong>Rendering file:</strong> {metaData.rendering}
            {" ✓"}
          </div>
          <div className="w-full">
            <strong>Rendering file function name:</strong>{" "}
            {metaData.renderingExportFunction}()
          </div>
          <div className="w-full">
            <strong>CMS ID:</strong> {metaData.id}
          </div>
          <div className="w-full">
            <strong>CMS Data:</strong>
            <pre
              className={`max-h-500 mt-1 h-[10rem] min-h-100 overflow-y-scroll  rounded-md border border-gray-300 p-2 text-xxs`}
            >
              <ExampleCodeJSON language="json">
                {metaData.dataProvided}
              </ExampleCodeJSON>
            </pre>
          </div>
          <div className="w-full">
            <strong>Query file location:</strong> {metaData.queryFileLocation}
          </div>
          <div className="w-full">
            <strong>GraphQL query:</strong>
            <pre
              className={`max-h-500 mt-1 h-[10rem] min-h-100 overflow-y-scroll  rounded-md border border-gray-300 p-2 text-xxs`}
            >
              {metaData.query}
            </pre>
          </div>
        </div>
      )}
    </>
  )
}

function GetContentEditorInformation(
  metaData: ComponentMetaData
): import("react").ReactNode {
  if (metaData === undefined) return <> </>
  return (
    <>
      {metaData.liveDocumentation !== "" && (
        <p className="mb-4">
          Component Documentation Page:{" "}
          <a
            href={metaData.liveDocumentation}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Documentation
          </a>
        </p>
      )}
      {/* <p className="font-semibold mb-4">CMS: {capitalizeFirstChars(process.env.NEXT_PUBLIC_CMS_VARIANT)}</p> */}
      <p className="mb-4">
        CMS Login:{" "}
        <a
          target="_blank"
          className="underline"
          href={capitalizeFirstChars(process.env.NEXT_PUBLIC_CMS_LOGIN)}
        >
          Login
        </a>
      </p>
      <p className="mb-4">CMS URL: {metaData.url}</p>
      {metaData.lastUpdated !== "" && (
        <p className="mb-4 font-semibold">
          Last updated: {convertToDate(metaData.lastUpdated)}
        </p>
      )}
      {metaData.youtubeVideo !== "" && (
        <>
          <div className="mb-4 flex items-center">
            <FontAwesomeIcon
              size={"xs"}
              style={{ width: "32px", height: "32px" }}
              icon={faVideo}
              className="mr-2 text-red-500"
            />
            <a
              href={metaData.youtubeVideo}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              YouTube Help Video
            </a>
          </div>
        </>
      )}
    </>
  )
}

function GetGeneralDetails(
  metaData: ComponentMetaData
): import("react").ReactNode {
  return (
    <>
      {metaData && (
        <>
          <h2 className="mb-4 text-xl font-semibold">{metaData.name}</h2>
          <h3 className="mb-4">Type:: {metaData.typeName}</h3>
          <h4 className="mb-4">Variant:: {metaData.variant}</h4>
        </>
      )}
    </>
  )
}
