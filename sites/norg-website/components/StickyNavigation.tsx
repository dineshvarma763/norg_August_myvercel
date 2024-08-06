"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"
import { processURLForNavigation } from "@/ui-base/lib/services/urlService"
import { checkPrefetchAvailability } from "@/ui-base/lib/util/prefetch"
import { cn } from "@/ui-base/lib/util/utils"
import { CloseIcon, HamburgerIcon } from "./Icon"

interface Button {
  name: string
  target: string | null
  type: string
  url: string
}

export interface StickyNavDataI {
  url: string
  id: string
  contentTypeAlias: string
  __typename: string
  name: string
  phoneNumber: string
  buttons: Button[]
  showSearch: boolean
  searchText: string
}

interface StickyNavProps {
  data: StickyNavDataI
  languageSite: LanguageSite
}

const StickyNavigation = (props: StickyNavProps) => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Disable scrolling when mobile menu is open
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  let metaData
  if (props) {
    metaData = {
      name: "Stick Navigation",
      variant: "Top Stick Nav",
      query:
        "Look in >> @/ui-base/lib/cms/heartcore/graphql/stickynavigation/stickynavigation.ts",
      dataProvided: props,
      component: "Stick Navigation Top",
      queryFileLocation:
        "@/ui-base/lib/cms/heartcore/graphql/footer/stickynavigation.ts",
      localPath: "@/sites/norg-website/components/StickyNavigation.tsx",
      globalPath: "NA",
      id: props?.data?.id,
      url: props?.data.url,
      pathBeingUsed: "@/sites/norg-website/components/StickyNavigation.tsx",
      typeName: props?.data?.__typename,
    }
  }

  props["data"]["buttons"] = [
    { name: "Product", url: "/library/24-products/", target: null, type: "" },
    { name: "Case Studies", url: "/case-studies", target: null, type: "" },
    { name: "Services", url: "/library/", target: null, type: "" },
    { name: "Contact Us", url: "/contact-us", target: null, type: "button" },
  ]

  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-my-indigo text-sm">
        <div className="flex flex-col items-center justify-between px-[50px] pb-2.5 pt-10 lg:flex-row">
          <div className="flex w-full items-center justify-between lg:w-auto">
            <span
              onClick={() => setIsOpen(!isOpen)}
              className="block flex-1 cursor-pointer text-white lg:hidden"
            >
              {isOpen ? <CloseIcon width={22} /> : <HamburgerIcon width={22} />}
            </span>
            <Link href={processURLForNavigation("/", props?.languageSite)}>
              <Image
                src="/norg-website/images/logo.png"
                alt="Logo"
                width={140}
                height={38}
                className="lg:max-w-140 flex-1 object-contain md:max-w-[140px] xl:max-w-full"
              />
            </Link>
            <div className="block flex-1 lg:hidden" />
          </div>
          <ul
            className={`${
              isOpen
                ? "mt-2 flex flex-col"
                : "hidden lg:flex lg:whitespace-nowrap"
            }  `}
          >
            {props?.data?.buttons?.map((item) => (
              <li key={item?.name}>
                <Link
                  prefetch={checkPrefetchAvailability(item?.url)}
                  href={item?.url}
                  className={cn(
                    "block px-5 py-[10.5px] font-comfortaa text-nav font-400 capitalize leading-[20px] text-my-white hover:font-400",
                    {
                      "ml-[39px] px-5 py-2.5 leading-[21px] bg-my-white2 hover:bg-my-black text-nav text-my-black-33 hover:text-my-white font-500 hover:font-500 rounded-lg":
                        item?.type === "button",
                    }
                  )}
                >
                  {item?.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <div className="hidden bg-transparent lg:block" />
    </>
  )
}

export default StickyNavigation
