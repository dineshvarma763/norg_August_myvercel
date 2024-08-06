import Link from "next/link"

import { cn } from "@/ui-base/lib/util/utils"
import { LinksListChildrenProps } from "./LinksList"

const ButtonLinksList = ({
  links,
  className,
  languageSite,
  linkClassName = "",
  useNextLink = true,
}: LinksListChildrenProps) => {
  const LinkComponent = useNextLink ? Link : "a"

  return (
    <div className={cn("p-4", className)}>
      {links?.map((link) => (
        <LinkComponent
          href={link?.url}
          key={link?.url}
          className={cn(
            `mb-2 box-border block cursor-pointer rounded-full bg-gray-200 px-4 py-2 last:mb-0 ${linkClassName}`
          )}
        >
          {link.name}
        </LinkComponent>
      ))}
    </div>
  )
}

export default ButtonLinksList
