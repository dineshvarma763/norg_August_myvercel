"use client"

import { filterAndUpdateClass } from "@/ui-base/lib/cms/heartcore/filterAndUpdateClass";
import { MinusIcon, PlusIcon } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/ui-base/components/ui/accordion";

export default function AccordionFaqClient({faqList, languageSite}) {
    return (<>
    <Accordion
      className="AccordionRoot border-t border-my-blue"
      type="single"
      defaultValue="item-1"
      collapsible>
      {faqList?.map(({ content: item }, index) => {
        return (
          <AccordionItem className="AccordionItem border-b border-my-blue pr-1" key={index} value={`feature-${index}`}>
            <AccordionTrigger
              className="text-base tracking-0.1em uppercase hover:no-underline pt-5 pb-5 font-[800]"
              collapsedIcon={<PlusIcon className="text-my-yellow shrink-0" />}
              expandedIcon={<MinusIcon className="text-my-yellow shrink-0" />}
              hasChild={true}      
            >
              {item.heading}
            </AccordionTrigger>
            <AccordionContent>
              <div dangerouslySetInnerHTML={{ __html: filterAndUpdateClass(item.text, languageSite) }} />
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
    </>)
}