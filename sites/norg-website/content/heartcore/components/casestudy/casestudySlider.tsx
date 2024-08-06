"use client"

import React, { useRef } from "react"
import Slider from "react-slick"

import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"

const log = getLogger("ui-base.cms.heartcore.content.casestudySlider")

export default function CaseStudyComponentSlider({ children }) {
  const sliderRef = useRef(null)

  // Custom previous arrow component
  const CustomPrevArrow = (props) => (
    <button
      className="absolute bottom-[7px] right-10 z-10 text-white md:bottom-[20px] md:right-10"
      onClick={props.onClick}
    >
      <svg
        width="16"
        height="14"
        viewBox="0 0 16 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 7L1 7M1 7L7 13M1 7L7 1"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )

  // Custom next arrow component
  const CustomNextArrow = (props) => (
    <button
      className="absolute bottom-[7px] right-0 z-10 text-white md:bottom-[20px]"
      onClick={props.onClick}
    >
      <svg
        width="16"
        height="14"
        viewBox="0 0 16 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1 7L15 7M15 7L9 0.999999M15 7L9 13"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )

  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    adaptiveHeight: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
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
    <div className={`w-full items-start justify-items-center`}>
      <Slider {...settings} ref={sliderRef}>
        {children}
      </Slider>
    </div>
  )
}
