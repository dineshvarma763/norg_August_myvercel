"use client"
import React, { FC } from "react"
import Image from "next/image"
import Slider from "react-slick"

// https://react-slick.neostack.com/docs/example/
interface Props {
  items?: Array<{ src: string; alt: string }>
  settings?: object
  children?: React.ReactNode
}

const Carousel: FC<Props> = ({ items, children = null, ...props }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    ...props?.settings,
  }

  if (children && items) {
    throw new Error("You can't pass both items and children to Carousel")
  }

  if (children) {
    return <Slider {...settings}>{children}</Slider>
  }

  return (
    <Slider {...settings}>
      {items.map((item, index) => (
        <div key={index}>
          <Image
            src={item.src}
            alt={item.alt}
            width={1980}
            height={600}
            loading="lazy"
          />
        </div>
      ))}
    </Slider>
  )
}

export default Carousel
