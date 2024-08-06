"use client"

import Image from "next/image"
import { AdvancedSpecificationTable } from "@/sites/norg-website/content/heartcore/components/advancedspecificationtable/advancedspecificationtableComponent"
import { MinusIcon, PlusIcon } from "lucide-react"

import { filterAndUpdateClass } from "@/ui-base/lib/cms/heartcore/filterAndUpdateClass"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../accordion"
import { getSpecificationsTableComponent } from "./Product"

export default function ProductAccordion({
  product,
  languageSite,
}): React.ReactElement {
  return (
    <Accordion className="AccordionRoot" type="multiple">
      {!product.turnOnAdvancedProductSpecificationTable &&
        product.specifications &&
        product.specifications.length > 0 && (
          <AccordionItem
            className="AccordionItem border-t border-my-blue pr-1 last:mb-20 last:md:mb-28"
            value="specifications"
            id="specifications"
          >
            <AccordionTrigger
              className="font-urbanist text-h5 font-800 uppercase leading-h5 tracking-0.1em hover:no-underline"
              collapsedIcon={<PlusIcon className="text-my-yellow" />}
              expandedIcon={<MinusIcon className="text-my-yellow" />}
              hasChild={true}
            >
              Specifications
            </AccordionTrigger>
            <AccordionContent>
              {getSpecificationsTableComponent(product.specifications)}
            </AccordionContent>
          </AccordionItem>
        )}
      {product.turnOnAdvancedProductSpecificationTable &&
        product.rows &&
        product.rows.length > 0 && (
          <AccordionItem
            className="AccordionItem border-t border-my-blue pr-1 last:mb-20 last:md:mb-28"
            value="specifications"
            id="specifications"
          >
            <AccordionTrigger
              className="font-urbanist text-h5 font-800 uppercase leading-h5 tracking-0.1em hover:no-underline"
              collapsedIcon={<PlusIcon className="text-my-yellow" />}
              expandedIcon={<MinusIcon className="text-my-yellow" />}
              hasChild={true}
            >
              Specifications
            </AccordionTrigger>
            <AccordionContent>
              <AdvancedSpecificationTable data={product} />
            </AccordionContent>
          </AccordionItem>
        )}
      {product.imageSectionContent && (
        <AccordionItem
          className="AccordionItem border-my-blue pr-1 last:mb-20 last:md:mb-28"
          value={`whats-in-the-box`}
          id={`whats-in-the-box`}
        >
          <AccordionTrigger
            className="font-urbanist text-h5 font-800 uppercase leading-h5 tracking-0.1em hover:no-underline"
            collapsedIcon={<PlusIcon className="text-my-yellow" />}
            expandedIcon={<MinusIcon className="text-my-yellow" />}
            hasChild={true}
          >
            {product.imageSectionContent &&
              product.imageSectionContent[0]?.content.heading}
          </AccordionTrigger>
          <AccordionContent>
            {/* Render image section content */}

            <div className="grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 md:grid-cols-3 md:gap-10">
              {product.imageSectionContent?.slice(1).map((content, index) => (
                <div
                  key={index + 1}
                  className="place-items-left mx-2 flex w-full flex-col"
                >
                  <Image
                    className="mx-auto mb-4 h-58 w-full max-w-236"
                    alt={
                      content?.content?.image?.media?.altText != ""
                        ? content?.content?.image?.media?.altText
                        : content?.content?.image?.media?.name != ""
                        ? content?.content?.image?.media?.name
                        : content?.content?.heading
                    }
                    src={content?.content?.image?.url}
                    width={200}
                    height={200}
                  />
                  <h3 className="mx-auto max-w-236 text-left text-base">
                    {content.content.heading}
                  </h3>
                  <div
                    className="text-base"
                    dangerouslySetInnerHTML={{
                      __html: filterAndUpdateClass(
                        content?.content?.text,
                        languageSite
                      ),
                    }}
                  />
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      )}
      {product.warranty && (
        <AccordionItem
          className="AccordionItem border-my-blue pr-1 last:mb-20 last:md:mb-28"
          value="warranty"
          id="warranty"
        >
          <AccordionTrigger
            className="font-urbanist text-h5 font-800 uppercase leading-h5 tracking-0.1em hover:no-underline"
            collapsedIcon={<PlusIcon className="text-my-yellow" />}
            expandedIcon={<MinusIcon className="text-my-yellow" />}
            hasChild={true}
          >
            Warranty
          </AccordionTrigger>
          <AccordionContent>
            {/* Render warranty content */}
            {/* Customize this part based on the warranty.sections structure */}
            <div
              dangerouslySetInnerHTML={{
                __html: filterAndUpdateClass(product.warranty, languageSite),
              }}
            />
          </AccordionContent>
        </AccordionItem>
      )}
      {product.frequentlyAskedQuestions && (
        <AccordionItem
          className="AccordionItem border-my-blue pr-1 last:mb-20 last:md:mb-28"
          value="faqs"
          id="faqs"
        >
          <AccordionTrigger
            className="font-urbanist text-h5 font-800 uppercase leading-h5 tracking-0.1em hover:no-underline"
            collapsedIcon={<PlusIcon className="text-my-yellow" />}
            expandedIcon={<MinusIcon className="text-my-yellow" />}
            hasChild={true}
          >
            Frequently Asked Questions
          </AccordionTrigger>
          <AccordionContent>
            {/* Render frequentlyAskedQuestions content */}
            {/* Customize this part based on the frequentlyAskedQuestions.sections structure */}
            <div
              dangerouslySetInnerHTML={{
                __html: filterAndUpdateClass(
                  product.frequentlyAskedQuestions,
                  languageSite
                ),
              }}
            />
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  )
}
