"use client"

import { Fragment, Suspense, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import useIsMobile from "@/hooks/useIsMobile"

import DevButton from "@/ui-base/components/ui/developer/devButton"
import { renderMBS } from "@/ui-base/components/ui/sections/feature-section"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { getSectionTextColour } from "@/ui-base/lib/util/getSectionTextColour"
import { checkPrefetchAvailability } from "@/ui-base/lib/util/prefetch"
import { alignmentClasses, cn } from "@/ui-base/lib/util/utils"
import { ProductSlider } from "./ProductSlider"

const log = getLogger("sites.norg-website.content.productslist")

const ProductListDetailsWIthMedia = ({ data, matchingData, globalData }) => {
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
      <div className="container">
        <h2
          className={`mb-6 font-comfortaa text-[22px] font-600 leading-[26px] text-my-white2 md:text-h2 md:leading-[55px] ${textAlignClass}`}
        >
          {matchingData.name}
        </h2>
        <div className="flex flex-col items-center justify-between md:flex-row">
          {!isMobile ? (
            <Image
              className={`max-h-[652px] w-full max-w-[398px] object-contain max-sm:min-h-[485px] ${objectPositionClass}`}
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
          <div className="product-slider relative flex w-full max-w-screen-md flex-1 shrink-0 flex-col gap-4 font-inter max-sm:mb-5">
            <ProductSlider isMobile={isMobile}>
              {matchingData.products.map((product, index) => (
                <Fragment key={index}>
                  {isMobile ? (
                    <Image
                      className={`max-h-[652px] w-full max-w-[398px] object-contain max-sm:min-h-[485px] ${objectPositionClass}`}
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
                    onClick={() => setSelectedItem(index)}
                    className={cn(
                      "relative flex cursor-pointer flex-col gap-5 rounded-5px border border-gray-700 bg-charcoal px-6 py-4 sm:flex-row sm:items-center sm:gap-6 sm:pb-9",
                      {
                        "bg-[#272f4e]/60 !pb-4": isMobile
                          ? false
                          : selectedItem !== index,
                      }
                    )}
                  >
                    <div
                      className={cn(
                        "absolute inset-0 bg-[#272f4e]/60 max-sm:hidden",
                        {
                          "sm:hidden": selectedItem === index,
                        }
                      )}
                    />

                    <div
                      className={cn(
                        "flex flex-1 flex-col",
                        {
                          "gap-y-0": isMobile ? false : index !== selectedItem,
                        }
                      )}
                    >
                      <div className="max-sm:max-h-[160px] max-sm:min-h-[160px]">
                        <h3
                          className={cn(
                            `text-left font-inter text-[22px] font-500 leading-[24px] text-my-white md:text-[26px] md:leading-[38px]`,
                            isMobile
                              ? getSectionTextColour(
                                  getBgColorOfButton(product)
                                )
                              : index === selectedItem
                              ? getSectionTextColour(
                                  getBgColorOfButton(product)
                                )
                              : ""
                          )}
                        >
                          {product.content.productTitle}
                        </h3>

                        <div
                          className={cn(
                            `mb-[9px] mt-2.5 !text-left text-[13px] font-400 leading-[18px] text-my-grey max-sm:line-clamp-6 md:mb-[14px] md:mt-4 md:text-[16px] md:leading-[22px]`,
                            {
                              "sm:hidden": !isMobile && index !== selectedItem,
                            }
                          )}
                          dangerouslySetInnerHTML={{
                            __html: product.content.productDescription || "",
                          }}
                        />
                      </div>

                      <div className="flex shrink-0 flex-col justify-between sm:flex-row sm:items-end">
                        {index === selectedItem || isMobile ? (
                          product?.content?.productCTAList?.length > 0 ? (
                            <div className="flex flex-col justify-self-end">
                              <p
                                className={cn(
                                  "mb-4 font-inter text-[12px] font-normal uppercase leading-[40px]",
                                  getSectionTextColour(
                                    getBgColorOfButton(product)
                                  )
                                )}
                              >
                                Can be used with
                              </p>
                              <div className="mb- flex items-center justify-start gap-x-2 md:gap-x-4">
                                {product?.content?.productCTAList?.map(
                                  ({ content: node }, index) => (
                                    <Fragment key={node.id ?? index}>
                                      <Link
                                        href={node?.link?.url ?? "#"}
                                        prefetch={checkPrefetchAvailability(
                                          node?.link?.url
                                        )}
                                        data-attr-prefetch={checkPrefetchAvailability(
                                          node?.link?.url
                                        )}
                                        className="h-10 w-10 rounded-5px border border-gray-700 bg-charcoal p-2.5 md:h-16 md:w-16 md:p-4"
                                      >
                                        <Image
                                          src={node?.icon?.url}
                                          width={30}
                                          height={30}
                                          alt={
                                            node?.icon?.media?.altText != ""
                                              ? node?.icon?.media?.altText
                                              : node?.icon?.media?.name != ""
                                              ? node?.icon?.media?.name
                                              : node?.heading || "Logo"
                                          }
                                        />
                                        <p className="text-center underline">
                                          {node.heading}
                                        </p>
                                      </Link>
                                    </Fragment>
                                  )
                                )}
                              </div>
                            </div>
                          ) : null
                        ) : null}
                        {product.content.productButtons
                          ? renderMBS(
                              product?.content?.productButtons,
                              cn("min-w-max whitespace-nowrap px-4", {
                                "sm:hidden":
                                  !isMobile && index !== selectedItem,
                              }),
                              "m-0 mt-[20px] md:mt-0 md:p-0 max-w-full md:max-w-max shrink-0 pr-[70px]"
                            )
                          : null}
                      </div>
                    </div>
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

export default ProductListDetailsWIthMedia
