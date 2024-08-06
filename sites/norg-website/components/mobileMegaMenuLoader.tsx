"use client"

import dynamic from "next/dynamic"

export default function MobileMegaMenuLoader({
  navItems,
  stickyNavData,
  languageSite,
  className = "",
}) {
  const MobileMegaMenu = dynamic(() => import("./MobileMegaMenu"))
  return (
    <>
      <MobileMegaMenu
        navItems={navItems}
        stickyNavData={stickyNavData}
        languageSite={languageSite}
        className={className}
      />
    </>
  )
}
