"use client"

import { Fragment, Suspense, useState } from "react"
import Image from "next/image"
import useIsMobile from "@/hooks/useIsMobile"

import DevButton from "@/ui-base/components/ui/developer/devButton"
import { renderMBS } from "@/ui-base/components/ui/sections/feature-section"
import { ComponentDataProps } from "@/ui-base/lib/services/data/componentMetaDataService"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { getSectionTextColour } from "@/ui-base/lib/util/getSectionTextColour"
import { alignmentClasses, cn } from "@/ui-base/lib/util/utils"
import ProductListDetailsWIthMedia from "./ProductListDetailsWIthMedia"
import { ProductSlider } from "./ProductSlider"

const log = getLogger("sites.norg-website.content.productslist")

export default function productsListComponent(data: ComponentDataProps) {
  log.trace("products data passed in:", JSON.stringify(data))

  const globalData = data.globalData

  populateMetaData(data)
  const matchingData = data.componentData

  if (data.componentMetaData.variant === "Product - Details Listing") {
    // return renderProductDetailsListing(data, matchingData, globalData)
    return (
      <RenderProductDetailsListing
        data={data}
        matchingData={matchingData}
        globalData={globalData}
      />
    )
  } else if (
    data.componentMetaData.variant ===
    "Product - Left Image & Right Details Listing"
  ) {
    return (
      <RenderProductLeftImageRightDetailsListing
        data={data}
        matchingData={matchingData}
        globalData={globalData}
      />
    )
  } else if (
    data.componentMetaData.variant ===
    "Product - Left Image & Right Details With Social Media Listing"
  ) {
    return (
      <ProductListDetailsWIthMedia
        data={data}
        matchingData={matchingData}
        globalData={globalData}
      />
    )
  } else {
    return <></>
  }
}

const RenderProductDetailsListing = ({ data, matchingData, globalData }) => {
  const align = data?.componentData?.align || "center"
  const { textAlignClass, objectPositionClass } = alignmentClasses({ align })
  const isMobile = useIsMobile()

  return (
    <div className="relative z-10 w-full py-[50px]">
      <Suspense>
        <DevButton metaData={data.componentMetaData} />
      </Suspense>
      <div className="product-slider container">
        <h2
          className={`mb-6 font-comfortaa text-[22px] font-600 leading-[26px] text-my-white2 md:text-h2 md:leading-[55px] ${textAlignClass}`}
        >
          {matchingData.name}
        </h2>
        <ProductSlider
          isMobile={isMobile}
          className="grid grid-cols-1 place-items-start gap-9 sm:grid-cols-2 md:grid-cols-3"
        >
          {matchingData.products.map((product, index) => (
            <div key={index} className="flex flex-col">
              <Image
                className={`max-sm:min-h-[485px]w-full m-auto  max-h-[652px] object-contain sm:max-w-[398px] ${objectPositionClass}`}
                src={product.content.productImage?.url}
                height={652}
                width={398}
                loading="lazy"
                alt={
                  product.content.productImage?.media?.altText != ""
                    ? product.content.productImage?.media?.altText
                    : product.content.productImage?.media?.name != ""
                    ? product.content.productImage?.media?.name
                    : product.content.productTitle
                }
                priority={false}
              />
              <div
                className={cn("relative flex cursor-pointer flex-col", {
                  "border border-gray-700 bg-[#272f4e]/80 rounded-5px px-6 py-4 text-left":
                    isMobile,
                })}
              >
                <div className="max-sm:max-h-[160px] max-sm:min-h-[160px]">
                  <h3
                    className={`mb-2 font-inter text-[22px] font-500 leading-[30px] text-my-white md:mb-2.5 md:text-[20px] md:leading-normal ${
                      isMobile ? "text-left" : textAlignClass
                    }`}
                  >
                    {product.content.productTitle}
                  </h3>

                  <div
                    className={cn(
                      `text-[13px] font-400 leading-[18px] text-my-grey max-sm:line-clamp-6 md:text-[14px] md:leading-[20px] [&>p>strong]:font-600 [&>p>strong]:text-white ${
                        isMobile ? "text-left" : textAlignClass
                      }`
                    )}
                    dangerouslySetInnerHTML={{
                      __html: product.content.productDescription || "",
                    }}
                  />
                </div>

                {isMobile ? (
                  <div className="mt-[20px] flex items-center md:mt-[75px]">
                    {matchingData.productListLinks
                      ? renderMBS(
                          matchingData.productListLinks,
                          "max-w-max px-5 py-2.5 whitespace-nowrap leading-[21px] bg-my-indigo hover:bg-my-black text-my-white font-500 hover:font-500 rounded-lg"
                        )
                      : null}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </ProductSlider>

        {isMobile ? null : (
          <div className="mt-[40px] flex items-center justify-center md:mt-[75px]">
            {matchingData.productListLinks
              ? renderMBS(
                  matchingData.productListLinks,
                  "max-w-max px-5 py-2.5 whitespace-nowrap leading-[21px] bg-my-indigo hover:bg-my-black text-my-white font-500 hover:font-500 rounded-lg"
                )
              : null}
          </div>
        )}
      </div>
    </div>
  )
}

const RenderProductLeftImageRightDetailsListing = ({
  data,
  matchingData,
  globalData,
}) => {
  const align = data?.componentData?.align || "center"
  const { textAlignClass, objectPositionClass } = alignmentClasses({ align })
  const [selectedItem, setSelectedItem] = useState(0)
  const isMobile = useIsMobile()

  const getBgColorOfButton = (product) => {
    const productButtons = product?.content?.productButtons
    const firstButtonWithColor = productButtons?.find(
      ({ content }) => content?.buttonBackgroundColour
    )
    return firstButtonWithColor?.content?.buttonBackgroundColour
  }

  return (
    <div className="min-h-12 relative z-10 w-full">
      <Suspense>
        <DevButton metaData={data.componentMetaData} />
      </Suspense>
      <div className="container my-6">
        <h2
          className={`mb-6 font-comfortaa text-[22px] font-600 leading-[26px] text-my-white2 md:text-h2 md:leading-[55px] ${textAlignClass}`}
        >
          {matchingData.name}
        </h2>
        <div className="flex flex-col items-center justify-between md:flex-row">
          {!isMobile ? (
            <Image
              className={`max-sm:min-h-[485px]w-full  max-h-[652px] object-contain sm:max-w-[398px] ${objectPositionClass}`}
              src={
                matchingData.products[selectedItem].content.productImage?.url
              }
              height={652}
              width={398}
              loading="lazy"
              alt={
                matchingData.products[selectedItem].content.productImage?.media
                  ?.altText != ""
                  ? matchingData.products[selectedItem].content.productImage
                      ?.media?.altText
                  : matchingData.products[selectedItem].content.productImage
                      ?.media?.name != ""
                  ? matchingData.products[selectedItem].content.productImage
                      ?.media?.name
                  : matchingData.products[selectedItem].content.productTitle
              }
              priority={false}
            />
          ) : null}
          <div className="product-slider flex w-full max-w-screen-md flex-1 shrink-0 flex-col gap-4 font-inter">
            <ProductSlider isMobile={isMobile}>
              {matchingData.products.map((product, index) => (
                <Fragment key={index}>
                  {isMobile ? (
                    <Image
                      className={`max-h-[652px]  w-full object-contain max-sm:min-h-[485px] sm:max-w-[398px] ${objectPositionClass}`}
                      src={product?.content.productImage?.url}
                      height={652}
                      width={398}
                      loading="lazy"
                      alt={
                        product?.content.productImage?.media?.altText != ""
                          ? product?.content.productImage?.media?.altText
                          : product?.content.productImage?.media?.name != ""
                          ? product?.content.productImage?.media?.name
                          : product?.content.productTitle
                      }
                      priority={false}
                    />
                  ) : null}
                  <div
                    onClick={() => !isMobile && setSelectedItem(index)}
                    className={cn(
                      "relative flex cursor-pointer flex-col gap-5 rounded-5px border border-gray-700 bg-charcoal px-6 py-4 sm:flex-row sm:items-center sm:gap-6",
                      {
                        "bg-[#272f4e]/60": isMobile
                          ? false
                          : selectedItem !== index,
                      }
                    )}
                  >
                    <div
                      className={cn("absolute inset-0 hidden bg-[#272f4e]/60", {
                        "sm:block": selectedItem !== index,
                      })}
                    />

                    <div
                      className={cn(
                        "flex flex-1 flex-col max-sm:max-h-[160px] max-sm:min-h-[160px]"
                      )}
                    >
                      <h3
                        className={cn(
                          `text-left font-inter text-[22px] font-500 leading-[24px] text-my-white md:text-[26px] md:leading-[38px]`,
                          isMobile || index === selectedItem
                            ? getSectionTextColour(getBgColorOfButton(product))
                            : ""
                        )}
                      >
                        {product.content.productTitle}
                      </h3>

                      <div
                        className={cn(
                          `mb-[9px] mt-2.5 !text-left text-[13px] font-400 leading-[18px] text-my-grey max-sm:line-clamp-6 md:mb-[14px] md:mt-4 md:text-[16px] md:leading-[22px]`
                        )}
                        dangerouslySetInnerHTML={{
                          __html: product.content.productDescription || "",
                        }}
                      />
                    </div>
                    {product.content.productButtons
                      ? renderMBS(
                          product?.content?.productButtons,
                          "min-w-max whitespace-nowrap px-4",
                          "m-0 sm:mt-[20px] md:mt-0 md:p-0 max-w-full md:max-w-max shrink-0 pr-[70px]"
                        )
                      : null}
                  </div>
                </Fragment>
              ))}
            </ProductSlider>
          </div>
        </div>
      </div>
    </div>
  )
}

function populateMetaData(data: ComponentDataProps) {
  data.componentMetaData.dataProvided = data.componentData
  // Get the relative path of the current file
  data.componentMetaData.rendering =
    "sites/norg-website/content/heartcore/components/productslist/productslistComponent.tsx"
  // Get the name of the current function
  data.componentMetaData.renderingExportFunction = "productslistComponent"
}
