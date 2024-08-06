import React from "react"
import { SiteHeader } from "./site-header"

interface LayoutProps {
  children: React.ReactNode
  className?: string
  data: any
  isMegamenu?: boolean
  megaMenuMenu?: any
}

export function Layout({
  children,
  className,
  data,
  isMegamenu,
  megaMenuMenu,
}: LayoutProps) {
  return (
    <>
      <div className={className}>
        <SiteHeader
          data={data}
          isMegamenu={isMegamenu}
          megaMenuMenu={megaMenuMenu}
        />
      </div>
      <main>{children}</main>
    </>
  )
}
