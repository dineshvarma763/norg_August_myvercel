import { NavMegaMenuV1 } from "@/ui-base/components/ui/navigation/navMegaMenuV1"
import StickyNavigation from "./StickyNavigation"
import MobileMegaMenuLoader from "./mobileMegaMenuLoader"

export function buildMegaMenu(navItems, stickyNavItems, languageSite?) {
  return (
    <header className="h-[91px] w-full">
      {/* <StickyNavigation data={navItems} languageSite={languageSite} /> */}
      <MobileMegaMenuLoader
        navItems={navItems}
        stickyNavData={stickyNavItems}
        languageSite={languageSite}
        className="flex h-[91px] w-full items-center justify-between lg:hidden"
      />
      <NavMegaMenuV1
        navItems={navItems}
        className="hidden w-full flex-col items-center pt-0 lg:flex"
        languageSite={languageSite}
      />
    </header>
  )
}
