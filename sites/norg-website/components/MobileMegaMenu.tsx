"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"

import { NavItemInterface } from "@/ui-base/components/ui/navigation/NavItem"
import { filterNavItem } from "@/ui-base/components/ui/navigation/navMegaMenuV1"
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"
import { processURLForNavigation } from "@/ui-base/lib/services/urlService"
import { cn } from "@/ui-base/lib/util/utils"
import { CloseIcon, HamburgerIcon, SearchIcon } from "./Icon"
import SearchBox from "./SearchBox"
import { StickyNavDataI } from "./StickyNavigation"

interface MobileMegaMenuProps {
  navItems: NavItemInterface[]
  stickyNavData?: StickyNavDataI
  className?: string
  languageSite?: LanguageSite
}

export default function MobileMegaMenu({
  navItems,
  stickyNavData,
  languageSite,
  className = "",
}: MobileMegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  return (
    <>
      <div
        className={cn(
          "flex h-full w-full items-center justify-between px-4",
          {
            "bg-my-yellow relative": isSearchOpen,
          },
          className
        )}
      >
        {isSearchOpen ? (
          <Suspense fallback={<></>}>
            <SearchBox
              variant="mobile"
              languageSite={languageSite}
              placeholder={stickyNavData?.searchText ?? ""}
              showSearch
              autoFocus
              // onClose={() => setIsSearchOpen(false)}
              // onBlur={() => setIsSearchOpen(false)}
            />
          </Suspense>
        ) : (
          <>
            <span
              className="block flex-1 cursor-pointer text-white lg:hidden"
              onClick={(e) => {
                e.preventDefault()
                setIsOpen(!isOpen)
              }}
            >
              {!isOpen ? (
                <HamburgerIcon  />
              ) : (
                <CloseIcon  />
              )}
            </span>
            <Link href={processURLForNavigation("/", languageSite)}>
              <Image
                src="/norg-website/images/logo.png"
                alt={"Logo"}
                width={140}
                height={38}
                className="lg:max-w-140 -mb-1 flex-1 object-contain md:max-w-[140px] xl:max-w-full"
              />
            </Link>
            {/* <SearchIcon onClick={() => setIsSearchOpen((prev) => !prev)} /> */}
            <div className="block flex-1 lg:hidden" />
          </>
        )}
      </div>
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } absolute inset-0  top-[75px] z-20 flex flex-col bg-[#6366f0]`}
      >
        <div className="flex flex-1 flex-col overflow-y-auto py-4">
          <NestedList data={navItems} />
        </div>
      </div>
    </>
  )
}

function NestedList({ data }: { data: NavItemInterface[] }) {
  const [activeIndex, setActiveIndex] = useState<number[]>([])

  const currentData = useMemo(
    () =>
      activeIndex.reduce((acc: any, index) => {
        if (acc?.children) {
          return acc?.children?.[index]
        }
        return acc?.[index]
      }, data),
    [activeIndex, data]
  )

  function handleItemClick(index: number) {
    setActiveIndex((prev) => [...prev, index])
  }

  function handleBackClick() {
    setActiveIndex((prev) => prev.slice(0, -1))
  }

  function renderList(currentData) {
    let _currentData = currentData?.children || currentData
    return (
      <ul className="w-full">
        {activeIndex.length > 0 && (
          <p
            aria-label="button"
            onClick={handleBackClick}
            className="flex items-center space-x-2 px-4 py-3 font-comfortaa text-nav font-medium uppercase leading-nav tracking-0.1em text-my-white"
          >
            <ChevronLeftIcon className="h-4 w-4" /> <span>Back</span>
          </p>
        )}

        {currentData?.name ? (
          <li className="flex w-full items-center justify-between whitespace-nowrap bg-my-lighterIndigo px-4 py-3 font-comfortaa text-nav font-600 uppercase leading-nav tracking-0.1em text-white">
            <Link
              className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap"
              href={currentData?.url}
              target={currentData?.target}
              prefetch={currentData?.prefetch}
              data-attr-prefetch={currentData?.prefetch}
            >
              {currentData?.name}
            </Link>
          </li>
        ) : null}

        {_currentData?.map((item, index) => {
          const { visible, children: childItems } = filterNavItem(item)
          const hasChildren = childItems?.length > 0
          const target = item?.target ? item.target : "_self"
          const prefetch =
            item?.prefetch || typeof item.prefetch === "undefined"
              ? true
              : false

          return visible ? (
            <li
              onClick={() => hasChildren && handleItemClick(index)}
              key={`${item?.name}-${index}`}
              className="flex w-full cursor-pointer items-center justify-between whitespace-nowrap px-4 py-3 font-comfortaa text-nav uppercase leading-nav tracking-0.1em text-white"
            >
              <Link
                className="overflow-hidden text-ellipsis whitespace-nowrap"
                onClick={(e) => hasChildren && e.preventDefault()}
                href={item?.url}
                target={target}
                prefetch={prefetch}
                data-attr-prefetch={prefetch}
              >
                {item?.name}
              </Link>
              {hasChildren ? (
                <ChevronRightIcon className="h-5 w-5 text-my-white" />
              ) : null}
            </li>
          ) : null
        })}
      </ul>
    )
  }

  if (activeIndex.length > 0) {
    return <>{renderList(currentData)}</>
  } else {
    return renderList(data)
  }
}
