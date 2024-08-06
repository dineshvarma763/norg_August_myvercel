"use client"

import React, { useRef } from "react"
import useIsMobile from "@/hooks/useIsMobile"
import Slider, { Slider as SliderType } from "react-slick"

import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { cn } from "@/ui-base/lib/util/utils"

const log = getLogger("ui-base.cms.heartcore.content.CtaSlider")

interface TestimonialClientProps {
  children: any
  settings?: any
  itemLength: number
  className?: string
  dotVaraint?: "dark" | "light"
}

export default function CtaSlider({
  children,
  itemLength,
  settings: _settings,
  className = "",
  dotVaraint = "light",
}: TestimonialClientProps) {
  const sliderRef = useRef<SliderType | null>(null)
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const isMobile = useIsMobile()

  const settings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    beforeChange: (_, next) => setCurrentIndex(next),
    ..._settings,
  }

  const data = Array.from(Array(itemLength).keys())
  if (isMobile) {
    return (
      <>
        <Slider {...settings} ref={sliderRef}>
          {children}
        </Slider>
        <div className={cn("my-4 flex items-center justify-center md:hidden")}>
          {data.map((_, index: number) => (
            <button
              key={`dot-${index}`}
              className={cn(
                "mx-1 h-1.5 w-1.5 rounded-full border border-solid border-white bg-white",
                {
                  "bg-gray-700 border-gray-700": dotVaraint === "dark",
                  "bg-my-purple border-my-purple": index === currentIndex,
                }
              )}
              onClick={() => sliderRef?.current?.slickGoTo(index)}
            />
          ))}
        </div>
      </>
    )
  }

  return <div className={className}>{children}</div>
}
