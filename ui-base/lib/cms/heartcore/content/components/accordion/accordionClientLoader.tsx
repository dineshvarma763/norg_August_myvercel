"use client"
import dynamic from "next/dynamic";
export default function AccordionClientLoader({accordionData, globalData}) {
  const AccordionClient = dynamic(() => import('./accordionClient'));
    return (<><AccordionClient accordionData={accordionData} globalData={globalData} /></>)
}



