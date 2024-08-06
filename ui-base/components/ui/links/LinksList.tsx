import React from "react"

import { cn } from "@/ui-base/lib/util/utils"
import ButtonLinksList from "./ButtonLinksList"
import DownloadLinks from "./DownloadLinks"
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"

export interface LinksListChildrenProps {
  links: LinksListLinkProps[]
  className?: string
  linkClassName?: string
  useNextLink?: boolean
  languageSite: LanguageSite
}

export interface LinksListLinkProps {
  url: string
  udi: string
  name: string
  icon?: React.ReactElement | string
}

interface LinksListProps {
  heading?: string
  headingClassName?: string
  className?: string
  innerClassName?: string
  children:
    | React.ReactElement<LinksListChildrenProps>
    | React.ReactElement<LinksListChildrenProps>
    | React.ReactElement<LinksListChildrenProps>
}

const LinksList: React.FC<LinksListProps> = ({
  heading,
  headingClassName = "",
  className = "",
  innerClassName = "",
  children,
}) => {
  return (
    <div className={cn("flex flex-col", className)}>
      <h2 className={headingClassName}>{heading}</h2>
      <div className={cn("flex flex-col", innerClassName)}>{children}</div>
    </div>
  )
}

export default Object.assign(LinksList, {
  ButtonLinksList,
  DownloadLinks,
})
