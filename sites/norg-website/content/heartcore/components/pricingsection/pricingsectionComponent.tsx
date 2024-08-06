"use client"

import Link from "next/link"
import { Suspense } from "react"
import DevButton from "@/ui-base/components/ui/developer/devButton"
import { ComponentDataProps } from "@/ui-base/lib/services/data/componentMetaDataService"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"

const log = getLogger("sites.norg-website.content.pricingsection")

export function TickIcon(props){
	return (
		<svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0 text-green-400"><g clipPath="url(#a)"><path d="M4.078 9.667a.573.573 0 0 1-.438-.214L.69 5.981a.781.781 0 0 1-.138-.244.898.898 0 0 1-.051-.29.851.851 0 0 1 .178-.539.58.58 0 0 1 .44-.229.573.573 0 0 1 .445.216l2.517 2.96 5.356-6.306a.574.574 0 0 1 .445-.215.58.58 0 0 1 .441.229c.116.144.18.338.178.54a.845.845 0 0 1-.19.534L4.516 9.453a.573.573 0 0 1-.437.214Z" fill="currentColor"></path></g><defs><clipPath id="a"><path fill="#fff" d="M.5.5h10v10H.5z"></path></clipPath></defs></svg>)
}

export function FlowbiteButton({text}) {
	return (
		<Link href={`https://portal.norg.ai/auth/signin?callbackUrl=https%3A%2F%2Fportal.norg.ai%2Fpricing`}>
			<button type="button" className="group flex items-center justify-center p-0.5 text-center font-medium relative focus:z-10 focus:outline-none text-white focus:ring-blue-300 bg-blue-600 hover:bg-blue-700 focus:ring-blue-800 rounded-lg focus:ring-2 w-full "><span className="flex items-center transition-all duration-200 rounded-md text-sm px-4 py-2">{text}</span></button>
  </Link>
	)
}
function renderSwitch(index: number) {
  switch(index) {
    case 0:
      return 'Start for Free';
    case 1:
      return 'Subscribe for Standard';
    case 2:
      return 'Enquire for Sales Pro';
    default:
      return 'Start for Free';
  }
}

export default function pricingsectionComponent(data) {
  log.trace("pricingsectionComponent data passed in:", JSON.stringify(data))
  populateMetaData(data)
	const componentData = data.componentData;
	// console.log("Pricing data : " , JSON.stringify(componentData.pricingdata));
	if (componentData.pricingdata == null || componentData.pricingdata == undefined)
		return (<> </>)

  return (
		<>
      <Suspense>
        <DevButton metaData={data.componentMetaData} />
      </Suspense>
      <section className="bg-gray-900">
        <div className="py-8 px-4 mx-auto lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-white">
              {componentData?.pricingdata?.title}
            </h2>
            <p className="mb-5 font-light sm:text-xl text-gray-400">
              {componentData?.pricingdata?.description}
            </p>
          </div>
          <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
            {componentData?.pricingdata.pricing.map((pricingItem, index) => (
              <div
                key={index}
                className="flex flex-col justify-between p-6 mx-auto max-w-lg text-center rounded-lg border shadow border-gray-600 xl:p-8 bg-gray-800 text-white"
              >
                <div className="flex flex-col">
                  <h3 className="mb-4 text-2xl font-semibold">
                    {pricingItem.title}
                  </h3>
                  <p className="font-light sm:text-lg text-gray-400">
                    {pricingItem.description}
                  </p>
                  <div className="flex justify-center items-baseline my-8">
                    <span className="text-5xl font-extrabold">
                      {pricingItem.price || 'Free'}
                    </span>
                    {parseInt(pricingItem.price, 10) > 0 && (
                      <span className="text-lg font-normal text-gray-400">
                        /month
                      </span>
                    )}
                  </div>
                  <ul role="list" className="mb-8 space-y-4 text-left">
                    {pricingItem.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <TickIcon className="w-4 h-4 shrink-0 text-green-400" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {pricingItem.restrictions.map((restriction, restrictionIndex) => (
                      <li
                        key={restrictionIndex}
                        className="flex items-center space-x-3 line-through"
                      >
                        <TickIcon className="w-4 h-4 shrink-0 text-gray-400" />
                        <span>{restriction}</span>
                      </li>
                    ))}
                  </ul>
                </div>

								<FlowbiteButton text={renderSwitch(index)}/>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function populateMetaData(data: ComponentDataProps) {
  data.componentMetaData.dataProvided = data.componentData
  // Get the relative path of the current file
  data.componentMetaData.rendering =
    "sites/norg-website/content/heartcore/components/pricingsection/pricingsectionComponent.tsx"

  // Get the name of the current function
  data.componentMetaData.renderingExportFunction = "pricingsectionComponent"
}
