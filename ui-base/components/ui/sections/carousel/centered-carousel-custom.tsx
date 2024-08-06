

/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react"
import Image from "next/image"
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons"

import { cn } from "@/ui-base/lib/util/utils"

const slides = [
  {
    id: 1,
    imgUrl:
      "https://media.umbraco.io/dev-ata-automation/bgghnlbc/ata-premium-remotes.png",
    alt: "Slide 1",
  },
  {
    id: 2,
    imgUrl:
      "https://media.umbraco.io/dev-ata-automation/ojvdt1be/fl7a9637-scaled.jpg",
    alt: "Slide 2",
  },
  {
    id: 3,
    imgUrl: "https://media.umbraco.io/dev-ata-automation/0afdqolr/210a6637.jpg",
    alt: "Slide 3",
  },
  {
    id: 4,
    imgUrl: "https://media.umbraco.io/dev-ata-automation/phmjqmw3/210a6645.jpg",
    alt: "Slide 4",
  },
  {
    id: 5,
    imgUrl: "https://media.umbraco.io/dev-ata-automation/t5bhnqlw/210a6633.jpg",
    alt: "Slide 5",
  },
]

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    )
  }

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    )
  }

  const currentSlide = slides[currentIndex]
  const leftSlide =
    slides[currentIndex === 0 ? slides.length - 1 : currentIndex - 1]
  const rightSlide =
    slides[currentIndex === slides.length - 1 ? 0 : currentIndex + 1]

  return (
    <div className="relative">
      {/* Slides */}
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
        <div className="absolute -left-full mr-[2%] flex w-full translate-x-[8%] justify-end">
          <div className="absolute inset-0 bg-white/75" />
          <Image
            className="h-[165.1px] w-full object-fill sm:h-[527px]"
            src={leftSlide.imgUrl}
            alt={leftSlide.alt}
            width={793}
            height={527}
          />
        </div>
        <div className="flex h-full w-[80%] justify-center">
          <Image
            className="h-[165.1px] w-full object-contain sm:h-[527px]"
            src={currentSlide.imgUrl}
            alt={currentSlide.alt}
            width={793}
            height={527}
          />
        </div>
        <div className="absolute -right-full ml-[2%] flex w-full translate-x-[-8%] justify-start">
          <div className="absolute inset-0 bg-white/75" />
          <Image
            className="h-[165.1px] w-full object-fill sm:h-[527px]"
            src={rightSlide.imgUrl}
            alt={rightSlide.alt}
            width={793}
            height={527}
          />
        </div>
      </div>

      {/* Arrows and Dots */}
      <div className="mt-12 flex items-center justify-evenly">
        <button
          className="mr-2 rounded-full bg-my-yellow p-2 text-white"
          onClick={handlePrevClick}
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        <div className="flex">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              className={cn("mx-1 h-2 w-2 rounded-full", {
                "bg-my-blue": index === currentIndex,
                "bg-gray-300": index !== currentIndex,
              })}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
        <button
          className="ml-2 rounded-full bg-my-yellow p-2 text-white"
          onClick={handleNextClick}
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  )
}

export default Carousel
