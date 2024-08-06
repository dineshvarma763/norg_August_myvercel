"use client"
import dynamic from "next/dynamic";
export default function CaseStudyComponentSliderLoader({children}) {
  const CaseStudyComponentSlider = dynamic(() => import('./casestudySlider'));
    return (<><CaseStudyComponentSlider>{children}</CaseStudyComponentSlider></>)
}



