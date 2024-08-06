"use client"
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons"
import React, { useRef } from "react"
import Slider from "react-slick"

import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"

const log = getLogger("ui-base.cms.heartcore.content.exploreTheRangeSlider")

export default function ExploreTheRangeComponentSlider({children}) {

  const sliderRef = useRef(null)

  const [currentIndex, setCurrentIndex] = React.useState(0)

  // Custom previous arrow component
  const CustomPrevArrow = (props) => (
    <button
      className="absolute top-2/4 z-10 mr-2 rounded-full bg-my-yellow p-1 text-white"
      onClick={props.onClick}
    >
      <ChevronLeftIcon className="h-8 w-8 md:h-10 md:w-10" />
    </button>
  )

  // Custom next arrow component
  const CustomNextArrow = (props) => (
    <button
      className="absolute right-0 top-2/4 z-10 ml-2 rounded-full bg-my-yellow p-1 text-white"
      onClick={props.onClick}
    >
      <ChevronRightIcon className="h-8 w-8 md:h-10 md:w-10" />
    </button>
  )

  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    beforeChange: (_, next) => {
      setCurrentIndex(next)
    },
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          adaptiveHeight: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }


  return (
    <div className={`w-full items-start justify-items-center py-12`}>
      <Slider {...settings} ref={sliderRef}>{children}</Slider>
    </div>
  )
}



