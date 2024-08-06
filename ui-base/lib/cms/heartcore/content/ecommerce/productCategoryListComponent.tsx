import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import DevButton from "@/ui-base/components/ui/developer/devButton"

const log = getLogger("ui-base.cms.heartcore.content.productCategoryListComponent")

export default function productCategoryListComponent(data:ComponentDataProps) {
  log.debug("productCategoryListComponent data passed in:", JSON.stringify(data))
  log.debug("productCategoryListComponent", data.componentData)

  populateMetaData(data);

  return (
    <div className="w-full">
      <Suspense><DevButton metaData={data.componentMetaData} /></Suspense>
      <ProductCategory category={data.componentData} languageSite={data.globalData?.languageSite} />
    </div>
  )
}

import { FC, Suspense } from 'react';
import Image from 'next/image';
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"
import { ComponentDataProps } from "@/ui-base/lib/services/data/componentMetaDataService"

interface ProductCategoryProps {
  category: {
    name: string;
    category: any;
    productCategories: {
      id: string;
      url: string;
      name: string;
      description: string;
      children: {
        edges: {
          node: {
            __typename: string;
            name?: string;
            url?: string;
            productPhoto?: {
              url: string;
              media?:{
                name?:string;
                mediaTypeAlias?:string;
                altText?:string;
              }
            };
            productName?: string;
            productDescription?: string;
            productFeature?: string;
          };
        }[];
      };
    }[];
  };
  languageSite: LanguageSite;
}

const ProductCategory: FC<ProductCategoryProps> = ({ category, languageSite }) => {
  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">

        <div className="flex flex-wrap">
          {category.productCategories.map((productCategory) => (

          <div className="w-full" key={productCategory.id}>
            <div className="flex flex-wrap justify-between items-start mb-8">
              <div className="lg:w-1/3 mb-4 lg:mb-0">
                <div className="bg-white rounded-lg overflow-hidden shadow-md">
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2">{productCategory.name}</h3>
                    <p className="mb-4">{productCategory.description}</p>
                    <a
                      href={productCategory?.url}
                      className="inline-block text-sm text-white bg-yellow-500 py-2 px-4 rounded hover:bg-yellow-600 transition-colors duration-300"
                    >
                      View Category
                    </a>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 px-4 mb-8" key={productCategory.id}>
              {productCategory.children.edges.map((edge) => (
                <div className="bg-white rounded-lg overflow-hidden shadow-md mb-4" key={edge.node.url}>
                  {edge.node.productPhoto && (
                    <div className="relative h-48">
                      <Image src={edge.node.productPhoto.url} alt={edge?.node?.productPhoto?.media?.altText != "" ?  edge?.node?.productPhoto?.media?.altText :  edge?.node?.productPhoto?.media?.name != "" ?  edge?.node?.productPhoto?.media?.name : edge?.node?.productName} layout="fill" objectFit="cover" />
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="text-lg font-bold mb-2">{edge.node.productName || edge.node.name}</h4>
                    <div dangerouslySetInnerHTML={{ __html: edge.node.productDescription || '' }} />
                    <div className="mt-4">
                      <a
                        href={edge?.node?.url}
                        className="text-sm text-white bg-yellow-500 py-2 px-4 rounded hover:bg-yellow-600 transition-colors duration-300"
                      >
                        Learn More
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </div>

            
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { ProductCategory };

function populateMetaData(data: ComponentDataProps) {
  
  data.componentMetaData.dataProvided = data.componentData;
  // Get the relative path of the current file
  data.componentMetaData.rendering = "ui-base/lib/cms/heartcore/content/ecommerce/productCategoryListComponent.tsx";
  // Get the name of the current function
  data.componentMetaData.renderingExportFunction = "productCategoryListComponent";
}
