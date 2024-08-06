import React from "react"
import Image from "next/image"
import { GalleryComp } from "@/sites/norg-website/content/heartcore/components/gallery/galleryComponent"

import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"
import { ProductI } from "@/ui-base/lib/interfaces/ecommerce/ProductI"
import ProductAccordion from "./ProductAccordion"

interface ProductProps {
  product: ProductI
  languageSite: LanguageSite
}

const ProductComponent: React.FC<ProductProps> = ({
  product,
  languageSite,
}) => {
  const galleryData = {
    componentData: { images: product.images, showHeading: false },
    componentMetaData: {
      dataProvided: {},
      url: product.url,
      typeName: product.__typename,
      rendering:
        "sites/norg-website/content/heartcore/components/gallery/galleryComponent.tsx",
      id: product.id,
      variant: "Product Page Gallery",
      name: "GalleryComponent",
      queryFileLocation:
        "sites/norg-website/graphql/heartcore/ecommerce/productDetails.ts",
      query: "Same as the Product Page",
      liveDocumentation: "/library/6-gallery",
      youtubeVideo: "https://www.youtube.com/watch?v=penPUgksQPU",
      renderingExportFunction: "productDetails",
      isInsideGrid: false,
    },
  }

  return (
    <div className="product font-urbanist text-my-blue">
      {product.features && (
        <div className="w-full py-14 md:py-28" id="key-features">
          <h2 className="mb-14 text-center font-urbanist text-3xl font-800 leading-[45px] text-my-brown-grey md:text-h3 md:leading-h3">
            Key Features
          </h2>
          <div className="flex flex-wrap justify-evenly">
            {product.features?.map((featureHolder, index) => {
              if (
                featureHolder.content.contentTypeAlias ===
                "headingImageRichTextCOMP"
              ) {
                return (
                  <div
                    key={index}
                    className="mb-14 flex w-full flex-col items-center px-0 last:mb-0 md:mb-0 md:w-3/12 md:px-8"
                  >
                    <Image
                      alt={
                        featureHolder?.content?.image?.media?.altText != ""
                          ? featureHolder?.content?.image?.media?.altText
                          : featureHolder?.content?.image?.media?.name != ""
                          ? featureHolder?.content?.image?.media?.name
                          : featureHolder?.content?.heading
                      }
                      src={featureHolder?.content?.image?.url}
                      width={95}
                      height={95}
                    />
                    <h3 className="mt-6 text-center text-h4 font-800 leading-h4">
                      {featureHolder.content.heading}
                    </h3>
                    <div
                      className="mt-5 text-sm leading-[21px] [&>p>strong]:font-semibold [&>p]:mb-2"
                      dangerouslySetInnerHTML={{
                        __html: featureHolder.content.description,
                      }}
                    />
                  </div>
                )
              }
              return null
            })}
          </div>
        </div>
      )}
      {product.images && product.images.length > 0 && (
        <div className="pb-20">
          <GalleryComp data={galleryData} />
        </div>
      )}

      <ProductAccordion product={product} languageSite={languageSite} />
    </div>
  )
}

export default ProductComponent

export function getSpecificationsTableComponent(
  specifications
): React.ReactNode {
  return (
    <table className="relative table w-full table-fixed border-separate rounded-xl border border-slate-300 bg-white font-urbanist">
      <tbody className="w-full">
        {specifications?.map((spec, index, _arr) => {
          const isSameCategory =
            _arr[index - 1]?.content?.category?.toLowerCase() ===
            spec.content.category?.toLowerCase()
          return (
            <tr
              key={index}
              className="border-black-300 flex w-full justify-between first:rounded-t-xl last:rounded-b-xl"
            >
              <td className="w-32 whitespace-normal break-all border-r border-slate-300 text-xs font-800 leading-[18px] md:w-96 md:text-base">
                {isSameCategory ? "" : spec.content.category}
              </td>
              <td className="w-3/5 whitespace-normal break-all border-r border-slate-300 text-xs font-400 leading-[18px] text-black80 md:text-sm md:leading-[21px]">
                {LinkFormatter(spec.content.title)}
              </td>
              <td className="w-3/5 whitespace-normal break-all border-slate-300 text-xs font-400 leading-[18px] md:text-sm md:leading-[21px]">
                {LinkFormatter(spec.content.value)}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

const LinkFormatter = (text) => {
  const isInternalLink = text.startsWith("Link:/")
  const isExternalLink =
    text.startsWith("http://") || text.startsWith("https://")

  if (isInternalLink) {
    const link = text.replace("Link:/", "/")
    return (
      <a
        href={link}
        className="inline-block pb-2 font-medium text-my-yellow underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {link}
      </a>
    )
  } else if (isExternalLink) {
    return (
      <a
        href={text}
        className="inline-block pb-2 font-medium text-my-yellow underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {text}
      </a>
    )
  } else {
    return text
  }
}
