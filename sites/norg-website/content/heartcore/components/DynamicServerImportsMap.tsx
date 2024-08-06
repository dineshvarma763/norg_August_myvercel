import dynamic from "next/dynamic"
import CommonStyleWrapper from "@/sites/norg-website/components/CommonStyleWrapper"

import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"

const componentMappings = {
  'hero': dynamic(() => import('./hero/heroComponent'), { loading: () => (<div role="banner" className="hero relative z-[50] h-[calc(100vh-75px)] overflow-hidden md:h-[calc(100vh-175px)]">Loading Hero....</div>)}),
  'featurethreeimagessection': dynamic(() => import('./featurethreeImages/featurethreeImagesComponent'), { loading: () => (<p>Loading...</p>) }),
  'ctalist': dynamic(() => import('./ctalist/ctalistComponent'), { loading: () => (<p>Loading...</p>) }),
  'gallery': dynamic(() => import('./gallery/galleryComponent'), { loading: () => (<p>Loading...</p>) }),
  'keyfeatures': dynamic(() => import('./keyfeatures/keyfeaturesComponent'), { loading: () => (<p>Loading...</p>) }),
  'linkslistings': dynamic(() => import('./linklist/linklistComponent'), { loading: () => (<p>Loading...</p>) }),
  'motto': dynamic(() => import('./motto/mottoComponent'), { loading: () => (<p>Loading...</p>) }),
  'testimonials': dynamic(() => import('./testimonial/testimonialComponent'), { loading: () => (<p>Loading...</p>) }),
  'phoneblock': dynamic(() => import('./phoneblock/phoneblockComponent'), { loading: () => (<p>Loading...</p>) }),
  'norgassistantchat': dynamic(() => import('./norgassistantchat/norgassistantchatComponent'), { loading: () => (<p>Loading...</p>) }),
  'norgdemocreation': dynamic(() => import('./norgdemocreation/norgdemocreationComponent'), { loading: () => (<p>Loading...</p>) }),
  'videosection': dynamic(() => import('./videosection/videosectionComponent'), { loading: () => (<p>Loading...</p>) }),
  //'faq': dynamic(() => import('./faq/faqComponent'), { loading: () => (<p>Loading...</p>) }),
  'livechat': dynamic(() => import('./livechat/livechatComponent'), { loading: () => (<p>Loading...</p>) }),
  'googlemaps': dynamic(() => import('./googlemaps/googlemapsComponent'), { loading: () => (<p>Loading...</p>) }),
  'specificationtable': dynamic(() => import('./specificationtable/specificationtableComponent'), { loading: () => (<p>Loading...</p>) }),
  'advancedspecificationtable': dynamic(() => import('./advancedspecificationtable/advancedspecificationtableComponent'), { loading: () => (<p>Loading...</p>) }),
  'accordion': dynamic(() => import('../../../../../ui-base/lib/cms/heartcore/content/components/accordion/accordionComponent'), { loading: () => (<p>Loading...</p>) }),
  'grid': dynamic(() => import('../../../../../ui-base/lib/cms/heartcore/content/components/grid/gridComponent'), { loading: () => (<p>Loading...</p>) }),
  'richtext': dynamic(() => import('../../../../../ui-base/lib/cms/heartcore/content/components/richtext/richtextComponent'), { loading: () => (<p>Loading...</p>) }),
  //'sitesearch': dynamic(() => import('../../../../../ui-base/lib/cms/heartcore/content/sitesearch/sitesearchComponent'), { loading: () => (<p>Loading...</p>) }),
  'gridcontent': dynamic(() => import('../../../../../ui-base/lib/cms/heartcore/content/components/grid/gridComponent'), { loading: () => (<p>Loading...</p>) }),
  'form': dynamic(() => import('../../../../../ui-base/lib/cms/heartcore/content/components/form/formComponent'), { loading: () => (<p>Loading...</p>) }),
  'exploretherange': dynamic(() => import('../../../../../ui-base/lib/cms/heartcore/content/ecommerce/exploreTheRangeComponent'), { loading: () => (<p>Loading...</p>) }),
  'productdownloads': dynamic(() => import('../../../../../ui-base/lib/cms/heartcore/content/ecommerce/productdownloadsComponent'), { loading: () => (<p>Loading...</p>) }),
  'productcategorylist': dynamic(() => import('../../../../../ui-base/lib/cms/heartcore/content/ecommerce/productCategoryListComponent'), { loading: () => (<p>Loading...</p>) }),
  'productlist': dynamic(() => import('../../../../../ui-base/lib/cms/heartcore/content/ecommerce/productListComponent'), { loading: () => (<p>Loading...</p>) }),
  'productvideos': dynamic(() => import('../../../../../ui-base/lib/cms/heartcore/content/ecommerce/productvideosComponent'), { loading: () => (<p>Loading...</p>) }),
  'casestudy': dynamic(() => import('./casestudy/casestudyComponent'), { loading: () => (<p>Loading...</p>) }),
  'showcase': dynamic(() => import('./showcase/showcaseComponent'), { loading: () => (<p>Loading...</p>) }),
  'promonav': dynamic(() => import('./promonav/promonavComponent'), { loading: () => (<p>Loading...</p>) }),
  'pricingsection': dynamic(() => import('./pricingsection/pricingsectionComponent'), { loading: () => (<p>Loading...</p>) }),
  'productslist': dynamic(() => import('./productslist/productslistComponent'), { loading: () => (<p>Loading...</p>) }),
};


const log = getLogger("sites.norg-website.content.dynamicserver")

export function RenderATADynamicServerImport({
  data,
  componentId,
  globalData,
}) {
  if (!componentId) {
    return null
  }
  componentId = componentId.toLowerCase()
  log.trace(
    "DynamicServerImportsMap 53 > renderATADynamicImport : componentId ------------------- ",
    componentId
  )

  const Component = componentMappings[componentId]
  if (!Component) {
    log.warn(`DynamicServerImportsMap 59 > No component found for id "${componentId}"`)
    return null
  }
  const pageUrl = data.componentData?.url?.split("/").filter(Boolean).pop()

  return (
    <div
      style={{
        background: `linear-gradient(to bottom,  #${data.componentData?.prevBackgroundColour} 50%, #${data.componentData?.nextBackgroundColour} 50%)`,
      }}
    >
      <CommonStyleWrapper
        id={pageUrl}
        className="relative z-10 w-full"
        backgroundColor={data.componentData?.backgroundColour}
        bottomRounded={data.componentData?.bottomRounded}
        topRounded={data.componentData?.topRounded}
      >
        <Component
          componentData={data.componentData}
          componentMetaData={data.componentMetaData}
          globalData={globalData}
        />
      </CommonStyleWrapper>
    </div>
  )
}
