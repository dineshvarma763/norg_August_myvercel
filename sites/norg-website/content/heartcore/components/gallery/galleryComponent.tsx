import React , { Suspense } from "react";
import DevButton from "@/ui-base/components/ui/developer/devButton"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { getSectionBackgroundColour } from "@/ui-base/lib/util/getSectionBackgroundColour";
import { headers } from "next/dist/client/components/headers";
import GalleryClientLoader from "./galleryClientLoader";
import { ComponentDataProps } from "@/ui-base/lib/services/data/componentMetaDataService";

const log = getLogger("sites.norg-website.content.gallery")

export function GalleryComp({data}) {

  return (
    <>
      {galleryComponent(data)}
    </>
  )
}

export default function galleryComponent(data: ComponentDataProps) {
  log.trace("gallery data passed in:", JSON.stringify(data))
  const backgroundColour = getSectionBackgroundColour(
    data?.componentData?.backgroundColour,
    ""
  );

  populateMetaData(data);

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
          <Suspense><DevButton metaData={data.componentMetaData} /></Suspense>
          <GalleryClientLoader images={data.componentData?.images} backgroundColour={backgroundColour} heading={data.componentData?.heading}/>
      </Suspense>
    </>
  )
}

function populateMetaData(data: ComponentDataProps) {
  data.componentMetaData.dataProvided = data.componentData
  // Get the relative path of the current file
  data.componentMetaData.rendering =
    "sites/norg-website/content/heartcore/components/gallery/galleryComponent.tsx"
  // Get the name of the current function
  data.componentMetaData.renderingExportFunction = "galleryComponent"
}
