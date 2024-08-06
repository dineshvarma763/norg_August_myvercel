"use client"

import React, { Fragment, useRef } from "react"
import Testimonial from "@/sites/norg-website/components/Testimonial"
import Slider, { Slider as SliderType } from "react-slick"

import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { cn } from "@/ui-base/lib/util/utils"
import { useCookies } from 'next-client-cookies';

const log = getLogger("ui-base.cms.heartcore.content.TestimonialClient")

interface TestimonialClientProps {
  pageTestimonial: any
  testimonialChildContent: any
  dataSource: any
  pageVisitCount: any
  targetPage: any
  variant?: string
}

export default function TestimonialClient({
  pageTestimonial,
  testimonialChildContent,
  dataSource,
  pageVisitCount,
  targetPage,
  variant,
}: TestimonialClientProps) {
  const sliderRef = useRef<SliderType | null>(null)
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const cookies = useCookies();
  let mostVisitedPage = cookies.get("mostVisitedPage") || "";
  let mostVisitedPageCount = cookies.get("mostVisitedPageCount") || 0;

  const normalizedVisitedPage = mostVisitedPage.replace('/', '').toLowerCase();  

   // Find the matching testimonial content based on mostVisitedPage
  if(mostVisitedPageCount > pageVisitCount && targetPage.url.toLowerCase().includes(normalizedVisitedPage .toLowerCase())){

    const urlWithoutTrailingSlash = dataSource.url.endsWith('/') ? dataSource.url.slice(0, -1) : dataSource.url;
    const extractedName = urlWithoutTrailingSlash.split('/').pop(); 
    const matchingContent = testimonialChildContent.find((item: any) =>
      item.node.name.replaceAll(" ","").toLowerCase().includes(extractedName)
    );
    const filteredPageTestimonial = matchingContent
      ? matchingContent.node.pageTestimonial
      : pageTestimonial;   
  
    pageTestimonial = filteredPageTestimonial; 
  }
  
 
  const settings = {
    dots: false,
    arrows: false,
    infinite: (pageTestimonial?.length || 0) >= 4,
    centerMode: true,
    centerPadding: "30px",
    speed: 500,
    slidesToShow: 3.75,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    beforeChange: (_, next) => setCurrentIndex(next),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          // adaptiveHeight: true,
          infinite: pageTestimonial.length >= 1,
        },
      },
    ],
  }

  const isQuestionAndAnswer = variant === "Testimonial - Question and Answer"

  const renderSlider = () => {
    if (isQuestionAndAnswer) {
      settings.infinite = pageTestimonial.length >= 8
      const elems = []
      let tempIndex = 0

      for (let i = 0; i < pageTestimonial.length; i += 2) {
        elems.push(
          <div key={`slide-qa-${i}`} className="!flex flex-col gap-9">            
            <Testimonial
              key={`slide-child-${i}`}
              data={pageTestimonial[i]?.content}
              isSender={tempIndex % 2 === 0 ? true : false}
            />

            <Testimonial
              key={`slide-child-${i + 1}`}
              data={pageTestimonial[i + 1]?.content}
              isSender={tempIndex % 2 === 0 ? false : true}
            />
          </div>
        )
        tempIndex++
      }

      return (
        <Slider {...settings} ref={sliderRef}>
          {elems}
        </Slider>
      )
    } else {
      return (
        <Slider {...settings} ref={sliderRef}>
          {pageTestimonial.map((testimonial: any, index: number) => (
            <div key={`slide-${index}`} className="flex gap-4">
              <Testimonial
                key={`slide-child-${index}`}
                data={testimonial?.content}
              />
            </div>
          ))}
        </Slider>
      )
    }
  }

  return (
    <>    
      <div className="grid grid-cols-1 gap-4" data-carousel-item>
        {renderSlider()}
        <div
          className={cn("my-4 flex items-center justify-center md:hidden", {
            hidden: isQuestionAndAnswer,
          })}
        >
          {pageTestimonial.map((_, index: number) => (
            <button
              key={`dot-${index}`}
              className={cn("mx-1 h-3.5 w-3.5 rounded-full", {
                "bg-white border border-white border-solid mx-3":
                  index === currentIndex,
                "border border-white border-solid mx-3": index !== currentIndex,
              })}
              onClick={() => sliderRef?.current?.slickGoTo(index)}
            />
          ))}
        </div>
      </div>
    </>
  )
}
