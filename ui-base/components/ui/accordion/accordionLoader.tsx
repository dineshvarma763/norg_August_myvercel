"use client"
import dynamic from "next/dynamic";

export default function AccordionFaqLoader({faqList, languageSite}) {
  const AccordionFaqClient = dynamic(() => import('./accordionClient'));
    return (<><AccordionFaqClient faqList={faqList} languageSite={languageSite}/></>)
}