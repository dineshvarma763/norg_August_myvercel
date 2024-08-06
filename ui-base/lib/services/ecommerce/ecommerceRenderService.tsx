import ProductComponent from "@/ui-base/components/ui/ecommerce/Product"
import {
  COMPONENT_PRODUCT_DETAILS,
} from "../../cms/constants"
import DevButton from "@/ui-base/components/ui/developer/devButton"
import { Suspense } from "react";

export function detectAndRenderProductDetails(data: any) {
  if (data?.pageVariant === "productPage") {
    let productData = GetPageComponentData(data, COMPONENT_PRODUCT_DETAILS);

    let metaData = {
      name: productData?.name,
      variant:data?.pageVariant,
      query: "Look in >> sites/norg-website/graphql/heartcore/ecommerce/productDetails.ts",
      dataProvided: productData,
      component: "Product Page Body",
      queryFileLocation: "sites/norg-website/graphql/heartcore/ecommerce/productDetails.ts",
      rendering: "ui-base/lib/services/ecommerce/ecommerceRenderService.tsx",
      globalPath: null,
      id: productData?.id,
      url: productData?.url,
      typeName: productData?.__typename,
      liveDocumentation: '',
      youtubeVideo: null,
      lastUpdated: null,
      renderingExportFunction: "productDetails",
      isInsideGrid: false,
      isClientSide: false,
    }

    return (

        productData?.showStandardProductBody === true || typeof(productData?.showStandardProductBody) === 'undefined' ? (
          <>
          <div className="w-full w-full container">
            <div className="w-full break-after-auto py-4">
              <Suspense><DevButton metaData={metaData} /></Suspense>
            </div>
            <ProductComponent product={productData} languageSite={data.globalData?.languageSite} />
            </div>
          </>
        ) : <></>

    )
  }
  return <></>
}

export function GetPageComponentData(data, field) {
  const fieldName = field.toLowerCase()
  if (
    data?.data?.pageComponentData &&
    data?.data?.pageComponentData.hasOwnProperty(fieldName) &&
    data?.data?.pageComponentData[fieldName]
  ) {
    return data?.data?.pageComponentData[field]
  }
  if (
    data?.pageComponentData &&
    data?.pageComponentData.hasOwnProperty(fieldName) &&
    data?.pageComponentData[fieldName]
  ) {
    return data?.pageComponentData[fieldName]
  }
}
