import { buildMegaMenu } from "../components/MegaMenu"
import Home from "../views/home"
import { NorgLayout } from "../views/layout"

export function Homepage<HomepageProps>({ data }) {
  return (
    <NorgLayout
      className={"flex w-full flex-col items-center"}
      data={data}
      isMegamenu={true}
 
      megaMenuMenu={buildMegaMenu(
        data?.data?.navItems,
        data?.data?.stickyNavItems,
        data?.data?.languageSite
      )}
    >
      <Home data={data} />
    </NorgLayout>
  )
}
