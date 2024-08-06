import React from "react"
import Image from "next/image"

import { GetSite } from "../../services/siteContextService"
import { extractUmbracoGuid } from "./tools/extractUmbracoGuid"
import { GetDynamicServerComponent } from "../../services/pageToSiteContextService"
import { LanguageSite } from "../../interfaces/LanguageSite"
import { filterAndUpdateClass } from "./filterAndUpdateClass"
import { getLogger } from "../../services/logging/LogConfig"

const log = getLogger("headless.graphql.heartcore.components.umbraco-heartcore-grid")

interface ControlProps {
  value: any
  editor: {
    name: string
    alias: string
  }
}

interface AreaProps {
  grid: string
  controls: ControlProps[]
  variant?: string
}

interface RowProps {
  id: string
  name: string
  areas: AreaProps[]
  variant?: string
}

interface SectionProps {
  grid: string
  rows: RowProps[]
  variant?: string
}

interface FlexProps {
  name: string
  sections: SectionProps[]
  variant?: string
  mainData?: any
  languageSite: LanguageSite
}

const RenderControls = ({
  controls,
  variant,
  mainData,
  languageSite,
}: {
  controls: ControlProps[]
  variant?: string
  mainData?: any,
  languageSite: LanguageSite
}) => (
  <>
    {controls?.map((control, index) => {
      switch (control.editor.alias) {
        // case 'headline-h1':
        //   return <h1 className='text-h1' key={index}>{control.value}</h1>;
        // case 'headline-h3-centred':
        //   return <h3 className='text-h3 text-center font-extrabold my-6' key={index}>{control.value}</h3>;
        // case 'my-headline':
        //   return <h4 className='text-h4' key={index}>{control.value}</h4>;
        // case 'headline-h4-centered':
        //   return <h4 className='text-h4 text-center font-extrabold my-6' key={index}>{control.value}</h4>;
        // case 'my-quote':
        //   return <blockquote key={index}>{control.value}</blockquote>;
        case "my-image":
          if (variant === "Grid Content - Small Images") {
            return (
              <div className="my-4 flex w-full items-center justify-center">
                {control?.value?.url && (
                <Image
                  data-variant={variant}
                  loading="lazy"
                  style={{ objectFit: "contain" }}
                  width={60}
                  height={60}
                  key={index}
                  src={control?.value?.url}
                  alt={control?.value?.altText}
                />
                )}
              </div>
            )
          } else {
            return (
              <div className="text-center">
                {control?.value?.url && (
                <Image
                  data-variant={variant}
                  loading="lazy"
                  style={{ objectFit: "contain" }}
                  width={1600}
                  height={400}
                  key={index}
                  src={control?.value?.url}
                  alt={control?.value?.altText}
                />
                )}
              </div>
            )
          }
        case "my-rte":
          return (
            <div
              key={index}
              dangerouslySetInnerHTML={{
                __html: filterAndUpdateClass(control.value, languageSite),
              }}
            />
          )
        case "horizonal-rule":
          return <hr key={index} className="my-10" />
        case "component-picker":
          return renderGridSubComponentContent(control.value, mainData)
        default:
          return <div key={index}>{control.value}</div>
      }
    })}
  </>
)

const RenderArea = ({
  area,
  variant,
  mainData,
  languageSite
}: {
  area: AreaProps
  variant?: string
  mainData?: any,
  languageSite: LanguageSite
}) => {
  // Note: Tailwind may not pick up the below  https://stackoverflow.com/questions/68953892/tailwind-grid-cols-not-working-in-production-with-next

  // const gridClass = `col-span-${area.grid} my-4`;

  let gridClass = ""
  switch (area.grid) {
    case "3":
      gridClass = "col-span-12 lg:col-span-3"
      break
    case "4":
      gridClass = "col-span-12 lg:col-span-4"
      break
    case "6":
      gridClass = "col-span-12 lg:col-span-6"
      break
    case "8":
      gridClass = "col-span-12 lg:col-span-8"
      break
    case "12":
      gridClass = "col-span-12"
      break
    default:
      gridClass = "col-span-12"
      break
  }

  return (
    <div className={gridClass}>
      <RenderControls
        controls={area.controls}
        variant={variant}
        mainData={mainData}
        languageSite={languageSite}
      />
    </div>
  )
}

const RenderRow = ({
  row,
  variant,
  mainData,
  languageSite
}: {
  row: RowProps
  variant: string
  mainData?: any,
  languageSite: LanguageSite
}) => {
  return (
    <div className="grid grid-cols-12 gap-4">
      {row?.areas?.map((area, index) => (
        <RenderArea
          key={index}
          area={area}
          variant={variant}
          mainData={mainData}
          languageSite={languageSite}
        />
      ))}
    </div>
  )
}

const RenderSection = ({
  section,
  variant,
  mainData,
  languageSite
}: {
  section: SectionProps
  variant?: string
  mainData?: any
  languageSite: LanguageSite
}) => (
  <>
    {section?.rows?.map((row, index) => (
      <RenderRow key={index} row={row} variant={variant} mainData={mainData} languageSite={languageSite} />
    ))}
  </>
)

const UmbracoFlexGrid: React.FC<FlexProps> = ({
  name,
  sections,
  variant,
  mainData,
  languageSite
}) => (
  <>
    <div className="invisible col-span-1 col-span-10 col-span-11 col-span-12 col-span-2 col-span-3 col-span-4 col-span-5 col-span-6 col-span-7 col-span-8 col-span-9"></div>
    {typeof sections !== "undefined" &&
      sections?.map((section, index) => (
        <RenderSection
          key={index}
          section={section}
          variant={variant}
          mainData={mainData}
          languageSite={languageSite}
        />
      ))}
  </>
)

function renderGridSubComponentContent(data, mainData) {
  const udi = extractUmbracoGuid(data)
  const matchingComponent = mainData.childComponents.filter((item) => {
    return item.id === udi
  })

  if (matchingComponent.length > 0) {
    const componentMatch = matchingComponent[0];

    if(!componentMatch || typeof(componentMatch.componentData) === "undefined" || typeof(componentMatch.componentData) === "undefined"){
      log.error('GRID No matching component found for: ', udi)
      return <></>
    }

    const typeName = componentMatch?.componentData?.__typename
      ? componentMatch?.componentData?.__typename
      : componentMatch?.componentData?.contentTypeAlias

    if(!typeName){
      log.error('GRID No matching component found for: ', udi)
      return <></>
    }

    const Component = GetDynamicServerComponent({siteName: GetSite().name})
    return (
      <>
        <Component
          data={componentMatch}
          globalData={data.globalData}
          componentId={typeName}
        />
      </>
    )
  }else{
    console.log('GRID No matching component found for: ', udi)
  }
  return <></>
}

export default UmbracoFlexGrid
