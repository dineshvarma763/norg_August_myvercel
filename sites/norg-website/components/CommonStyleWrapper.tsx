import React from "react"

import { getSectionBackgroundColour } from "@/ui-base/lib/util/getSectionBackgroundColour"
import { cn } from "@/ui-base/lib/util/utils"

type CommonStyleWrapperProps = React.HTMLAttributes<HTMLDivElement> & {
  backgroundColor: string
  children: React.ReactNode
  className: string
  lightTextClass?: string
  darkTextClass?: string
  bottomRounded?: boolean
  topRounded?: boolean
}

const CommonStyleWrapper: React.FC<CommonStyleWrapperProps> = ({
  backgroundColor,
  children,
  className,
  lightTextClass = "text-my-black",
  darkTextClass = "text-my-white",
  topRounded,
  bottomRounded,
  ...rest
}) => {
  const bgColor = getSectionBackgroundColour(backgroundColor, "bg-my-blue")
  const textColor = bgColor?.toLowerCase().includes("white")
    ? lightTextClass
    : darkTextClass
  return (
    <div
      className={cn(className, bgColor, textColor, {
        "rounded-t-[30px]": topRounded,
        "rounded-b-[30px]": bottomRounded,
      })}
      {...rest}
    >
      {children}
    </div>
  )
}

export default CommonStyleWrapper
