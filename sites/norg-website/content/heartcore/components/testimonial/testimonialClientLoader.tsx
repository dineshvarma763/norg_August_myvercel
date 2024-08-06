"use client"

import dynamic from "next/dynamic"

export default function TestimonialClientLoader(props) {
  const TestimonialClient = dynamic(() => import("./testimonialClient"))
  return (
    <>
      <TestimonialClient {...props} />
    </>
  )
}
