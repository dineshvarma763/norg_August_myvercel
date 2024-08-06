"use client"

import { Fragment, useRef } from "react"
import { tr } from "date-fns/locale"
import Slider from "react-slick"

export function ProductSlider({ children, isMobile, className = "" }) {
  const sliderRef = useRef(null)

  // Custom previous arrow component
  const CustomPrevArrow = (props) => (
    <button
      className="absolute bottom-6 right-20 z-50 text-white"
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
      className="absolute bottom-6 right-12 z-10 text-white "
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
    adaptiveHeight: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    centerMode: true,
    centerPadding: "10px",
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  }

  if (isMobile) {
    return (
      <Slider {...settings} ref={sliderRef}>
        {children}
      </Slider>
    )
  }
  if (className?.length > 0) {
    return <div className={className}>{children}</div>
  }
  return <Fragment>{children}</Fragment>
}
