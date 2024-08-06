"use client"
import dynamic from "next/dynamic";
import { useState } from "react";

export default function GeoAlertLoader({}) {
  const GeoAlert = dynamic(() => import('./geoAlert'));

  return (
    <>
      {<GeoAlert/>}
    </>
  );
}
