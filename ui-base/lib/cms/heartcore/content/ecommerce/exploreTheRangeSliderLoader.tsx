"use client"
import dynamic from "next/dynamic";
export default function ExploreTheRangeComponentSliderLoader({children}) {
  const ExploreTheRangeComponentSlider = dynamic(() => import('./exploreTheRangeSlider'));
    return (<><ExploreTheRangeComponentSlider>{children}</ExploreTheRangeComponentSlider></>)
}



