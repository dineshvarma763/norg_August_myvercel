"use client"

import { useState } from "react"
import useIsMobile from "@/hooks/useIsMobile"
import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui-base/components/ui/select"

const ResponsiveTabs = ({ data, children }) => {
  const isMobile = useIsMobile()
  const [selectedTab, setSelectedTab] = useState("0")

  if (isMobile) {
    return (
      <Tabs
        value={selectedTab}
        className="flex w-full flex-col gap-y-5"
      >
        <Select
          defaultValue="0"
          onValueChange={(value) => {
            setSelectedTab(value)
          }}
        >
          <SelectTrigger className="w-full rounded-5px bg-white text-center text-my-purple [&>span]:flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {data?.map(({ content }, index) => {
                if (!content?.title) return null
                return (
                  <SelectItem key={content?.title} value={index.toString()}>
                    {content?.title}
                  </SelectItem>
                )
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        {children}
      </Tabs>
    )
  }

  return (
    <Tabs defaultValue="0" className="flex w-full flex-col gap-y-5">
      <TabsList className="TabsList rounded-5px bg-white text-black">
        {data?.map(({ content }, index) => {
          if (!content?.title) return null
          return (
            <TabsTrigger
              key={content?.title}
              className="TabsTrigger"
              value={index.toString()}
            >
              {content?.title}
            </TabsTrigger>
          )
        })}
      </TabsList>
      {children}
    </Tabs>
  )
}

export default ResponsiveTabs
