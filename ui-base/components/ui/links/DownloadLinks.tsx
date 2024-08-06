import React from "react"
import Image from "next/image"
import Link from "next/link"

import { cn } from "@/ui-base/lib/util/utils"
import { LinksListChildrenProps } from "./LinksList"

const DownloadLinks = ({
  links,
  className,
  linkClassName = "",
  useNextLink = true,
}: LinksListChildrenProps) => {
  const LinkComponent = useNextLink ? Link : "a"
  return (
    <div className={cn("flex flex-col items-start p-4", className)}>
      {links?.map((link) => (
        <LinkComponent
          href={link?.url ?? ""}
          key={link?.url}
          className={cn(
            "mb-2 box-border flex cursor-pointer items-center",
            linkClassName
          )}
        >
          {React.isValidElement(link.icon) ? (
            <>
              {link.icon}
              <span className="ml-2">{link.name}</span>
            </>
          ) : (
            <>
              {link.icon && (
                <Image
                  alt={link.name}
                  src={String(link?.icon)}
                  width={16}
                  height={21}
                  className="h-5 w-4 object-contain"
                />
              )}
              <span className="ml-2">{link.name}</span>
            </>
          )}
        </LinkComponent>
      ))}
    </div>
  )
}

export default DownloadLinks
