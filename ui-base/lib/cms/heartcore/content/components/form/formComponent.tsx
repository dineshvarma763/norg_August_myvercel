import { Suspense } from "react"

import DevButton from "@/ui-base/components/ui/developer/devButton"
import { ComponentDataProps } from "@/ui-base/lib/services/data/componentMetaDataService"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { getSectionBackgroundColour } from "@/ui-base/lib/util/getSectionBackgroundColour"
import { stripPTags } from "../../../tools/urlTools"
import FormClientLoader from "./formClientLoader"

const log = getLogger("ui-base.cms.heartcore.content.form")

export default function formComponent(data: ComponentDataProps) {
  log.trace("form data passed in:", JSON.stringify(data))

  const formSpec = JSON.parse(stripPTags(data?.componentData?.formCode) || "{}")

  populateMetaData(data)

  return (
    <>
      {/* <script src="/norg-website/forms/loader.js"/>
      <div id="site-key-holder" data-value={formSpec?.recaptcha?.siteKey}></div> */}
      {/* <Script
        id="captcha_script"
        src="/norg-website/forms/recaptcha.js"
      />
      <Script src="https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit"></Script> */}

      <div className="relative w-full">
        <Suspense>
          <DevButton metaData={data.componentMetaData} />
        </Suspense>
        {renderFormVariant(
          formSpec,
          data?.componentData?.thankyouPage,
          data.globalData?.languageSite
        )}
      </div>
    </>
  )
}

function renderFormVariant(formSpec, returnPage, languageSite) {
  switch (formSpec.variant) {
    case "Contact-Form":
      return (
        <>
          <FormClientLoader
            formSpec={formSpec}
            returnPage={returnPage}
            languageSite={languageSite}
          />
        </>
      )

    default:
      return (
        <>
          <FormClientLoader
            formSpec={formSpec}
            returnPage={returnPage}
            languageSite={languageSite}
          />
        </>
      )
  }
}

function populateMetaData(data: ComponentDataProps) {
  data.componentMetaData.dataProvided = data.componentData
  // Get the relative path of the current file
  data.componentMetaData.rendering =
    "ui-base/lib/cms/heartcore/content/components/form/formComponent.tsx"
  // Get the name of the current function
  data.componentMetaData.renderingExportFunction = "formComponent"
}
