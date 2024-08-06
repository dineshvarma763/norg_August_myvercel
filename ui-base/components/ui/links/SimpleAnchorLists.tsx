"use client"

import Link from "next/link"
import { useMediaQuery } from "usehooks-ts"

import { cn } from "@/ui-base/lib/util/utils"
import { LinksListChildrenProps, LinksListLinkProps } from "./LinksList"

const SimpleAnchorLists = ({
  links,
  className,
  linkClassName = "",
  useNextLink = true,
}: LinksListChildrenProps) => {
  const matches = useMediaQuery("(min-width: 768px)")

  const LinkComponent = useNextLink ? Link : "a"

  const onLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    targetId = ""
  ) => {
    e.preventDefault()
    targetId = targetId?.toLowerCase()
    if (!targetId) return
    const target = document.querySelector(targetId)
    if (target) {
      const offset = matches ? -100 : -50
      const top =
        target.getBoundingClientRect().top + window.pageYOffset + offset
      window.scrollTo({
        top,
        behavior: "smooth",
      })
    }
    window.history.pushState({}, "", targetId)
  }

  const numItems = links.length
  const col1Items = Math.ceil(numItems / 2)
  const col2Items = Math.floor(numItems / 2)

  return (
    <div className={className}>
      <div className="flex flex-col">
        {links.slice(0, col1Items).map((link) => linkRenderer(link, LinkComponent, linkClassName, onLinkClick))}
      </div>
      <div className="flex flex-col">
        {links.slice(col1Items).map((link) => linkRenderer(link, LinkComponent, linkClassName, onLinkClick))}
      </div>
    </div>
  )
}

const linkRenderer = (link: LinksListLinkProps, LinkComponent: any, linkClassName: string, onLinkClick: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, targetId?: string) => void) => {
  const { isHashLink, targetId, url } = linkDiscovery(link)

  return (
    <LinkComponent
      href={url}
      key={url}
      className={cn("box-border cursor-pointer p-1 underline", linkClassName)}
      onClick={(e) => isHashLink && onLinkClick(e, targetId)}>
      {link.name}
    </LinkComponent>
  )
}

const linkDiscovery = (link: LinksListLinkProps) => {
  let url = link.url?.toLowerCase()
  let isHashLink = !!url?.length && url.length > 1
  let targetId = url
  if (isHashLink) {
    isHashLink = url?.startsWith("#") && url.length > 1
    const containsHashAndComponents = url?.indexOf("_components") > -1 && link.udi?.indexOf("umb://document") > -1
    if (containsHashAndComponents) {
      targetId = "#id-" + link.udi?.split("umb://document/")[1]
      isHashLink = true
      url = targetId
    }
  }
  return { isHashLink, targetId, url }
}

export default SimpleAnchorLists
