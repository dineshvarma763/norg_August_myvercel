import DemoCreateComponent from "@/sites/norg-website/components/demo/create-demo"
import { Button } from "@/ui-base/components/ui/button"
import { Input } from "@/ui-base/components/ui/input"
import { Label } from "@/ui-base/components/ui/label"
import Meteors from "@/ui-base/components/ui/loaders/meteor"
import { Progress } from "@/ui-base/components/ui/progress"
import { GetComponentsByTypeName } from "@/ui-base/lib/services/contentRendererServiceTSX"
import { ComponentDataProps } from "@/ui-base/lib/services/data/componentMetaDataService"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { getSectionBackgroundColour } from "@/ui-base/lib/util/getSectionBackgroundColour"

const log = getLogger("ui-base.cms.heartcore.content.norgdemocreationComponent")

export default function norgdemocreationComponent(data: ComponentDataProps) {
  return (
    <>
      <NorgDemoCreationComponent
        componentData={data.componentData}
        componentMetaData={data.componentMetaData}
      />
    </>
  )
}

const NorgDemoCreationComponent = (data?: ComponentDataProps) => {
  log.trace(
    "NorgDemoCreationComponent data passed in:",
    JSON.stringify(data?.componentData)
  )

  return (
    <>
      <div
        className={`${getSectionBackgroundColour(
          data?.componentData?.backgroundColour,
          ""
        )} container`}
      >
        <DemoCreateComponent />
      </div>
      <div id="meteor-loader">
        <MeteorDemo />
      </div>
    </>
  )
}

function MeteorDemo() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="bg-background relative flex h-full w-full max-w-[32rem] items-center justify-center overflow-hidden rounded-lg border p-20 md:shadow-xl">
        <Meteors number={30} />
        <p className="z-10 whitespace-pre-wrap text-center text-5xl font-medium tracking-tighter text-white dark:text-white">
          Demo Component Loader ....
        </p>
      </div>
    </div>
  )
}

export { NorgDemoCreationComponent }

