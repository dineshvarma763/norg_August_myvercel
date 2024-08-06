"use client"

import { useEffect, useState } from "react"

import { BackToTop } from "./Icon"

export function BackToTopAndChat() {
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowBackToTop(true)
      } else {
        setShowBackToTop(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const backToTopClassName = showBackToTop
    ? "opacity-100 flex"
    : "opacity-0 hidden"

  return (
    <div
      className={`fixed bottom-4 right-0 z-[1001] flex max-w-max flex-col items-center justify-center font-urbanist md:justify-between ${backToTopClassName}`}
    >
      {/* <p
        style={{
          writingMode: "vertical-rl",
          transform: "rotate(-180deg)",
        }}
        className="hidden max-h-max items-center justify-center rounded-full bg-my-yellow px-2 py-6 font-urbanist text-sm font-extrabold uppercase tracking-0.1em text-my-blue md:flex"
      >
        Ask an Expert
      </p> */}
      {/* <ChatIcon className="cursor-pointer md:mt-4" /> */}
      <BackToTop onClick={scrollToTop} className={`mt-3 cursor-pointer `} />
    </div>
  )
}
