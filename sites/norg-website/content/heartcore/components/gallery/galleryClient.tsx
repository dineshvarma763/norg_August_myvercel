"use client"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig";

import CenterModeCarousel from "@/ui-base/components/ui/sections/carousel/centered-carousel"

const log = getLogger("ui-base.cms.heartcore.content.GalleryClient");

export default function GalleryClient({images}) {

  return (
    <>
      <CenterModeCarousel slides={images} />
    </>
  );
}
