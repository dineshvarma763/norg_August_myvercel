"use client"
import dynamic from "next/dynamic";
export default function SitePickerLoader({}) {
  const SitePicker = dynamic(() => import('./site-picker').then((module) => module.SitePicker));
    return (<><SitePicker /></>)
}



