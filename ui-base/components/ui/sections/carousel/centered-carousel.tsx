"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons"
import Slider from "react-slick"

import { cn } from "@/ui-base/lib/util/utils"

const Slide = ({ imgSrc, isLeftSlide, isRightSlide, isDragging, altText }) => {
  return (
    <div
      className={cn("relative flex w-full justify-center", {
        "justify-end pr-4 sm:pr-0": isLeftSlide,
        "justify-start pl-4 sm:pl-0": isRightSlide,
      })}
    >
      <div
        className={cn("", {
          "absolute inset-0 bg-white/50 aspect-[1/1]":
            !isDragging && (isLeftSlide || isRightSlide),
        })}
      ></div>
      <Image
        className={cn(
          "h-[165.1px] w-full object-contain sm:h-[400px] sm:w-10/12",
          {
            "sm:object-fill": !isDragging && (isLeftSlide || isRightSlide),
            "object-right": isLeftSlide && isDragging,
            "object-left": isRightSlide && isDragging,
          }
        )}
        src={imgSrc}
        loading={"lazy"}
        alt={altText}
        quality={75}
        width={600}
        height={400}
        sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  )
}

const Carousel = ({ slides = [] }) => {
  const sliderRef = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const settings = {
    className: "",
    centerMode: true,
    infinite: true,
    slidesToShow: 1.2,
    dots: false,
    arrows: false,
    slidesToScroll: 1,
    adaptiveHeight: true,
    speed: 500,
    beforeChange: (_, next) => {
      setIsDragging(true)
      setCurrentIndex(next)
    },
    afterChange: () => {
      setIsDragging(false)
    },
    swipeEvent: () => {
      setIsDragging(true)
    },
  }

  useEffect(() => {
    const slider = sliderRef.current
    const element = slider && slider.innerSlider && slider.innerSlider.list

    const handleMouseUp = () => {
      setIsDragging((prev) => (prev ? false : prev))
    }

    const handleMouseLeave = () => {
      setIsDragging((prev) => (prev ? false : prev))
    }

    if (!element) return
    element.addEventListener("mouseup", handleMouseUp)
    element.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      if (!element) return
      element.removeEventListener("mouseup", handleMouseUp)
      element.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  const handleNextClick = () => {
    sliderRef.current.slickNext()
  }

  const handlePrevClick = () => {
    sliderRef.current.slickPrev()
  }

  const leftSlide = currentIndex === 0 ? slides.length - 1 : currentIndex - 1
  const rightSlide = currentIndex === slides.length - 1 ? 0 : currentIndex + 1

  return (
    <>
      <Slider {...settings} ref={sliderRef}>
        {slides?.map((slide, index) => (
          <Slide
            key={`${slide.id}-${index}`}
            imgSrc={slide.url}
            altText={
              slide?.media?.altText != ""
                ? slide?.media?.altText
                : slide?.media?.name != ""
                ? slide?.media?.name
                : slide?.name
            }
            isLeftSlide={leftSlide === index}
            isRightSlide={rightSlide === index}
            isDragging={isDragging}
          />
        ))}
      </Slider>
      <div className="mt-8 flex w-full items-center justify-around sm:mt-12">
        <button
          className="mr-2 rounded-full bg-my-yellow p-2 text-white hover:bg-my-black [&:hover>svg]:fill-white transition"
          onClick={handlePrevClick}
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        <div className="mx-1 h-2.5 w-2.5 rounded-full hidden"></div>
        <div className="flex">
          {slides?.map((slide, index) => (
            <button
              key={`btn-${slide.id}-${index}`}
              className={cn("mx-1 h-2.5 w-2.5 rounded-full", {
                "bg-my-blue": index === currentIndex,
                "bg-gray-300": index !== currentIndex,
              })}
              onClick={() => sliderRef?.current?.slickGoTo(index)}
            />
          ))}
        </div>

        <button
          className="ml-2 rounded-full bg-my-yellow p-2 text-white hover:bg-my-black [&:hover>svg]:fill-white transition"
          onClick={handleNextClick}
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      </div>
    </>
  )
}

export default Carousel
