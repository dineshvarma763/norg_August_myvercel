
import { ComponentDataProps } from "@/ui-base/lib/services/data/componentMetaDataService";
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig";
import { filterAndUpdateClass } from "@/ui-base/lib/cms/heartcore/filterAndUpdateClass";
import DevButton from "@/ui-base/components/ui/developer/devButton";
import React, { Suspense } from 'react';

const log = getLogger("ui-base.cms.heartcore.content.googlemaps");

const IframeComponent = ({ src, width, height }) => {
  return (
    <iframe
      title="Embedded Content"
      src={src}
      width={width}
      height={height}
      frameBorder="0"
      loading="lazy"
      className="border-spacing-0 w-full h-100"
      allowFullScreen
    ></iframe>
  );
};

export default function googlemapsComponent(data: ComponentDataProps) {
  log.trace("googlemaps data passed in:", JSON.stringify(data));

  populateMetaData(data);

  let iframeCode = "";
  let componentData = data?.componentMetaData?.dataProvided ?? {};
  if (componentData.datasource != null) {
    let ds = data.componentMetaData.dataProvided.datasource
    if (ds.iframeCode) {
      iframeCode = ds.iframeCode;
    }
  }
  if (componentData.iframeCode) {
    iframeCode = componentData.iframeCode;
  }

  return (
    <>
      <div className={`relative p-8 w-full`}>
        <Suspense><DevButton metaData={data.componentMetaData} /></Suspense>
        <IframeComponent src={iframeCode} width="600" height="500" />
      </div>
    </>
  );
}

function populateMetaData(data: ComponentDataProps) {
  if (data) {
    data.componentMetaData.dataProvided = data.componentData;
    data.componentMetaData.rendering = "sites/norg-website/content/heartcore/components/googlemaps/googlemapsComponent.tsx";
    data.componentMetaData.renderingExportFunction = "googlemapsComponent";
  }
}
