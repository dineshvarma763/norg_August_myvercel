import React, { ReactElement } from "react"
import Link from "next/link"

export type BreadcrumbsItemProps = React.LiHTMLAttributes<HTMLLIElement> & {
  href?: string
  prefetch?: boolean
  useNextLink?: boolean
  seperatorIcon?: React.ReactNode
  itemClassName?: string
}

const BreadcrumbsItem = React.forwardRef<HTMLLIElement, BreadcrumbsItemProps>(
  (
    {
      children,
      href,
      prefetch,
      useNextLink = false,
      className = "",
      seperatorIcon = DefaultSeperatorIcon,
      ...props
    },
    ref
  ): JSX.Element => {
    const LinkComponent = useNextLink ? Link : "a"
    const childComponent = seperatorIcon as ReactElement
    
    const prefetchVal = typeof(prefetch) === 'undefined' || prefetch ? true : false;
    return (
      <li role="link" className={className} {...props} ref={ref}>
        {href ? (
          <LinkComponent data-attr-prefetch={prefetchVal}  href={href} prefetch={prefetchVal}>{children}</LinkComponent>
        ) : (
          children
        )}

        {/* in global css only span selected */}
        {React.cloneElement(childComponent, {}).type === "span" ? (
          seperatorIcon
        ) : (
          <span>{seperatorIcon}</span>
        )}
      </li>
    )
  }
)

BreadcrumbsItem.displayName = "BreadcrumbsItem"

export default BreadcrumbsItem

const DefaultSeperatorIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="inline-block w-4 h-4 stroke-current"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
)
