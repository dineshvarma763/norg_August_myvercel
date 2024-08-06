import Image from "next/image"
import Link from "next/link"

import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import DevButton from "@/ui-base/components/ui/developer/devButton"
import { ComponentDataProps } from "@/ui-base/lib/services/data/componentMetaDataService"
import { Suspense } from "react"

const log = getLogger("ui-base.cms.heartcore.content.productList")

export default function productListComponent(data:ComponentDataProps) {
  log.debug("productsData data passed in:", JSON.stringify(data))
  log.debug("productsData", data.componentData)

  populateMetaData(data);

  return (
    <div className="w-full container">
      <Suspense><DevButton metaData={data.componentMetaData} /></Suspense>
      <div className="my-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {data.componentData.map((product) => (
          <Link
            href={product?.url}
            key={product.id}
            className="overflow-hidden rounded-lg bg-white shadow"
          >
            <Image
              src={product.imageUrl}
              alt={product.altText}
              className="h-48 w-full object-cover"
              width={product.imageWidth ?? 500}
              height={product.imageHeight ?? 500}
            />
            <div className="p-4">
              <h2 className="mb-2 text-xl font-semibold">{product.name}</h2>
              <ul className="list-inside list-disc">
Tech list has moved
              </ul>
              <div className="mt-4">
                <h3 className="text-sm font-medium">Description:</h3>
                <div
                  className="mt-1 max-h-16 overflow-hidden text-sm text-gray-600"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function populateMetaData(data: ComponentDataProps) {
  
  data.componentMetaData.dataProvided = data.componentData;
  // Get the relative path of the current file
  data.componentMetaData.rendering = "ui-base/lib/cms/heartcore/content/ecommerce/productListComponent.tsx";
  // Get the name of the current function
  data.componentMetaData.renderingExportFunction = "productListComponent";
}