"use client"

import { MinusIcon, PlusIcon } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/ui-base/components/ui/accordion"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"

const log = getLogger("ui-base.cms.heartcore.content.accordionClient")

export default function AccordionClient({ accordionData, globalData }) {
  return (
    <>
      <Accordion className="AccordionRoot mt-8" type="single" collapsible>
        {accordionData?.map(({ name, renderedComponent }, index) => {
          return (
            <AccordionItem
              className="AccordionItem border-t border-my-blue pr-1"
              value={`feature-${index}`}
              key={`feature-${name}-${index}`}
            >
              <AccordionTrigger
                className="text-h5 font-800 uppercase leading-h5 tracking-0.1em hover:no-underline"
                collapsedIcon={<PlusIcon className="text-my-yellow" />}
                expandedIcon={<MinusIcon className="text-my-yellow" />}
                hasChild={true}
              >
                {name}
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 gap-4">
                  {renderedComponent}
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </>
  )
}
