"use client"
import { headers } from "next/dist/client/components/headers";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
export default function GalleryClientLoader({ images, heading, backgroundColour }) {

  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const userAgent =
      typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    );
    setIsMobile(mobile);
  }, []);
  

  if (isMobile) {
    return null; // don't render anything on mobile devices
  } else {

    const GalleryClient = dynamic(() => import('./galleryClient'));
    return (<>
      <div
        id="image-gallery"
        className={`w-full ${backgroundColour} py-0`}
      >
        <div
          className={`container mx-auto px-4 font-urbanist galleryComponent`}
        >
          {heading && (
            <h3 className="mb-10 text-center text-h3 font-800 leading-h3 text-my-blue">
              {heading}
            </h3>
          )}
          <GalleryClient images={images} />
        </div>
      </div>
    </>)
  }
}



