"use client"

import { ChevronDownIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import { Fragment } from "react"

import { cn } from "@/ui-base/lib/util/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../dropdown-menu"
import { filterNavItem } from "./navMegaMenuV1"

export interface NavItemInterface {
  id?: string
  url?: string
  name: string
  _level?: number
  superAlias?: string
  target?: string
  prefetch?: boolean
  children?: NavItemInterface[]
  showInNavigation?: boolean
  className: string
  productPhoto?: any
  showAsButton?: boolean
}

interface NavItemProps extends NavItemInterface {
  _level?: number
}

const NavItem = (navItem: NavItemProps) => {
  const { url, name, productPhoto, className, _level = 1 } = navItem
  const { visible, children } = filterNavItem(navItem)

  const hasChildren = children && children.length > 0

  const target = navItem.target ? navItem.target : "_self"
  const prefetch =
    navItem?.prefetch || typeof navItem.prefetch === "undefined" ? true : false

  if (!visible) return null

  return (
    <DropdownMenuOrLi
      hasChildren={hasChildren}
      className={cn(
        "flex items-center justify-center text-sm transition duration-100 ease-in-out md:text-xxs lg:text-xs xl:text-sm",
        {
          "w-full box-border justify-start [&>a]:w-full": _level > 1,
        }
      )}
    >
      <Link
        href={url}
        target={target}
        prefetch={prefetch}
        data-attr-prefetch={prefetch}
        className={cn(
          "block overflow-hidden text-ellipsis whitespace-nowrap px-5 py-[10.5px]  font-comfortaa text-nav font-400 capitalize leading-[20px] ",
          {
            "text-my-white hover:font-400": _level === 1,
            "px-5 py-2.5 leading-[21px] bg-my-white2 hover:bg-my-black text-nav text-my-black-33 hover:text-my-white font-500 hover:font-500 rounded-lg":
              navItem?.showAsButton,
          }
        )}
      >
        {hasChildren ? (
          <DropdownMenuTrigger asChild>
            <span className={cn("flex items-center lg:gap-x-2")}>
              {name}
              {hasChildren && <ChevronDownIcon fontSize={18} />}
            </span>
          </DropdownMenuTrigger>
        ) : (
          name
        )}
      </Link>
      {hasChildren ? (
        <DropdownMenuContent className="m-4">
          <div className="no-scrollbar h-96 w-full max-w-xs overflow-y-auto">
            {hasChildren && renderChildOf(_level, children, navItem)}
          </div>
        </DropdownMenuContent>
      ) : null}
    </DropdownMenuOrLi>
  )
}

export default NavItem

const renderChildOf = (
  _level: number,
  navItemChilds: NavItemInterface[],
  self: any
) => {
  if (_level === 1) {
    return (
      <Fragment>
        {navItemChilds.map((item, idx) => (
          <DropdownMenuItem key={`${item.id}-${idx}`} className="w-full">
            <NavItem {...item} _level={_level + 1} />
          </DropdownMenuItem>
        ))}
      </Fragment>
    )
  }

  if (_level === 2) {
    return (
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <span>{self.name}</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            {navItemChilds.map((item, idx) => (
              <>
                <NavItem
                  {...item}
                  key={`${item.id}-${idx}`}
                  _level={_level + 1}
                />
              </>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    )
  }

  return <></>
}

const DropdownMenuOrLi = ({ children, className, hasChildren = false }) => {
  if (hasChildren) {
    return <DropdownMenu>{children}</DropdownMenu>
  }

  return <li className={className}>{children}</li>
}
