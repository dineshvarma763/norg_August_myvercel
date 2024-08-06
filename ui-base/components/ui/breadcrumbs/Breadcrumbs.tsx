import React, { Key, ReactElement } from "react"

import { cn } from "@/ui-base/lib/util/utils"
import BreadcrumbsItem, { BreadcrumbsItemProps } from "./BreadcrumbsItem"
//import { usePathname } from "next/navigation"
import "@/ui-base/styles/breadcrumb.css"

const exludedPaths = ["/", "/au"]

export type BreadcrumbsProps = React.HTMLAttributes<HTMLDivElement> & {
  data?: {
    links?: {
      href: string
      text: string
      prefetch?: boolean
      icon?: string
    }[]
    iconObject?: {
      [key: string]: ReactElement
    }
  }
  children?:
    | ReactElement<BreadcrumbsItemProps>
    | ReactElement<BreadcrumbsItemProps>[]
  innerRef?: React.Ref<HTMLUListElement>
  innerProps?: React.HTMLAttributes<HTMLUListElement>
  useNextLink?: boolean
  itemClassName?: string
  seperatorIcon?: ReactElement
  slug: string
}

const Breadcrumbs = React.forwardRef<HTMLDivElement, BreadcrumbsProps>(
  (
    {
      children,
      data,
      className,
      innerProps,
      innerRef,
      useNextLink = true,
      seperatorIcon,
      slug,
      itemClassName,
      ...props
    },
    ref
  ): JSX.Element => {
    const classes = cn("breadcrumbs [&>ul]:flex-wrap", "text-sm", className)

    slug = `/${slug}`
    if (exludedPaths.includes(slug)) return <></>

    return (
      <div
        role="navigation"
        aria-label="Breadcrumbs"
        className={classes}
        ref={ref}
        {...props}
      >
        <ul {...innerProps} ref={innerRef}>
          {data?.links
            ? data.links?.map((item: any, idx: Key) => (
                <>
                  <BreadcrumbsItem
                    key={idx}
                    href={item.href}
                    prefetch={item.prefetch}
                    useNextLink
                    className={itemClassName}
                    seperatorIcon={seperatorIcon}
                  >
                    {item.icon && data.iconObject[item.icon]}
                    {item.text}
                  </BreadcrumbsItem>
                </>
              ))
            : children}
        </ul>
      </div>
    )
  }
)

Breadcrumbs.displayName = "Breadcrumbs"

export default Object.assign(Breadcrumbs, { Item: BreadcrumbsItem })
