
import { PageSubComponents } from "@/ui-base/lib/services/contentRendererServiceTSX"

interface Props {
  className?: string
  data: any
}

const Home = (props: Props) => {
  return (
    <div className={props.className}>
      <PageSubComponents data={props.data} />
    </div>
  )
}

export default Home
