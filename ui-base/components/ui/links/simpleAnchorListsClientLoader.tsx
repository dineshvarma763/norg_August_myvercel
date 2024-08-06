"use client"

import dynamic from "next/dynamic"

export default function SimpleAnchorListsClientLoader({
  links,
  className,
  useNextLink,
  linkClassName = "",
  languageSite,
}) {
  const SimpleAnchorLists = dynamic(() => import("./SimpleAnchorLists"))
  return (
    <>
      <SimpleAnchorLists
        links={links ?? []}
        className={className ?? ""}
        useNextLink={useNextLink}
        linkClassName={linkClassName ?? ""}
        languageSite={languageSite}
      />
    </>
  )
}
