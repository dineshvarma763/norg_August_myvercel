"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "../../lib/util/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      "border-b border-b-slate-200 font-urbanist text-my-blue dark:border-b-slate-700",
      className
    )}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

interface AccordionTriggerProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {
  className?: string
  collapsedIcon?: React.ReactElement
  expandedIcon?: React.ReactElement
  hasChild?:boolean
}

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, collapsedIcon, expandedIcon,hasChild, ...props}, ref) => {
  let collapsedIconWithClass: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.FunctionComponentElement<any>;
  let expandedIconWithClass: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.FunctionComponentElement<any>;
 if (hasChild) {
   collapsedIconWithClass = React.cloneElement(
   
    collapsedIcon ?? <ChevronDown />,
    {
      className: `${collapsedIcon?.props?.className} collapsedIcon`,
    }
  ) }else {  collapsedIconWithClass = null;}
  if (hasChild) {
   expandedIconWithClass = React.cloneElement(
    expandedIcon ?? <ChevronUp />,
    {
      className: `${expandedIcon?.props?.className} expandedIcon`,
    }
  )
} else {  expandedIconWithClass = null;}
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          "flex flex-1 items-center justify-between py-4 font-urbanist font-800 transition-all hover:underline [&[data-state=closed]>svg.expandedIcon]:hidden [&[data-state=open]>svg.collapsedIcon]:hidden",
          className
        )}
        {...props}
      >
        {children}
        {collapsedIconWithClass}
        {expandedIconWithClass}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
})

AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      className
    )}
    {...props}
  >
    <div className="mb-8 mt-4">{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
