"use client"

import dynamic from "next/dynamic"

export default function StickyNavigationLoader({
  stickyNavItems,
  languageSite,
}) {
  const StickyNavigation = dynamic(() => import("./StickyNavigation"))
  return (
    <>
      <StickyNavigation data={stickyNavItems} languageSite={languageSite} />
    </>
  )
}
