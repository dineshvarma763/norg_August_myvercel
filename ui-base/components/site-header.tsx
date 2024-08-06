import Link from "next/link"

import { processURLForNavigation } from "../lib/services/urlService"
import { GlobalTailwindNavigationMenu } from "./ui/global-navigation"
import Logo from "./ui/media/logo"

export function SiteHeader({ data, isMegamenu = false, megaMenuMenu }) {

  let navItems = []
  if (data?.data?.navItems) {
    navItems = data.data.navItems
  } else if (data?.navItems) {
    navItems = data.navItems
  }

  if (navItems.length === 0) {
    return <></>
  }

  if (isMegamenu && megaMenuMenu) {
    return <>{megaMenuMenu}</>
  } else {
    return (
      <>
        <div data-role="Header" className="flex w-full flex-col items-center">
          <header className="z-50 mx-auto flex w-[100%] max-w-screen-lg items-center justify-between px-4 py-8">
            <Link href={processURLForNavigation("/", data.languageSite)}>
              <Logo
                image={data?.data.siteSettings.siteConfig.logo}
                className="w-100 object-cover"
              />
            </Link>
            <GlobalTailwindNavigationMenu
              navClasses={"flex flex-row items-start"}
              navItems={navItems}
            />
            {data?.data.siteSettings.hideStoreButtons === false && (
              <div className="home-container01"></div>
            )}
          </header>
        </div>
      </>
    )
  }
}
