import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"

import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"
import { processURLForNavigation } from "@/ui-base/lib/services/urlService"
import NavItem, { NavItemInterface } from "./NavItem"

interface NavigationProps {
  navItems: NavItemInterface[]
  className?: string
  languageSite: LanguageSite
}

export const filterNavItem = (
  navItem: NavItemInterface | undefined
): {
  visible: boolean
  children: any
} => {
  const shouldShow = (): boolean => {
    if (
      typeof navItem.url !== "undefined" &&
      typeof navItem.showInNavigation !== "undefined" &&
      navItem.showInNavigation === true
    ) {
      return true
    }
    return false
  }

  return {
    visible: shouldShow(),
    children: navItem.children?.filter((item) => filterNavItem(item).visible),
  }
}

// render a tailwind navigation menu
const NavMegaMenuV1 = ({
  navItems,
  className,
  languageSite,
}: NavigationProps) => {
  if (typeof navItems === "undefined") {
    return <></>
  }

  return (
    <nav
      className={`fixed top-0 z-50 w-full bg-my-indigo text-sm ${className}`}
    >
      <div className="relative h-full w-full px-[50px] pb-2.5 pt-10">
        <ul className="h-full w-full items-center justify-between overflow-hidden lg:flex">
          <li className="mr-4 flex min-w-max items-center md:pb-4 lg:pb-0 xl:mr-[5%]">
            <Link href={processURLForNavigation("/", languageSite)}>
              <Image
                src="/norg-website/images/logo.png"
                alt="Logo"
                width={140}
                height={38}
                className="lg:max-w-140 flex-1 object-contain md:max-w-[140px] xl:max-w-full"
              />
            </Link>
          </li>
          <li className="h-full flex-1 lg:pl-4">
            <ul className="flex h-full w-full items-center justify-end whitespace-nowrap text-nav font-medium uppercase leading-nav tracking-0.1em text-my-blue">
              {navItems.map((item, index) => (
                <Suspense
                  key={`${item.id}-${index}`}
                  fallback={<div>Loading...</div>}
                >
                  <NavItem {...item} />
                </Suspense>
              ))}
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export { NavMegaMenuV1 }
