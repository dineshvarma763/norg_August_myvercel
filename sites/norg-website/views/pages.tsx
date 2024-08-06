// import Breadcrumbs from "@/ui-base/components/ui/breadcrumbs/Breadcrumbs"
// import { ExampleCodeJSON } from "@/ui-base/components/ui/code"
import { renderComponentContent } from "@/ui-base/lib/services/components/pageComponentRenderService"
import { PageSubComponents } from "@/ui-base/lib/services/contentRendererServiceTSX"

interface Props {
  className?: string
  data: any
}

const Pages = (props: Props) => {
  return (
    <div className={props.className}>
      {/* <div className="w-full container">
        <Breadcrumbs
          data={props.data?.data?.breadcrumbItems}
          seperatorIcon={<span>/</span>}
          itemClassName="uppercase font-urbanist text-my-blue font-500 text-xs tracking-0.1em"
        />
      </div> */}
      {/* {JSON.stringify(dynamicCmsData)} */}
      {/* {subComponentContent}
        {gridPageContent} */}
      <>
        <PageSubComponents data={props.data} />
        {renderComponentContent(props.data?.data)}        
        <PageSubComponents data={props.data} location="Bottom" />
      </>
    </div>
  )
}

export default Pages
