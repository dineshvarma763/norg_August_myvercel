"use client"

import { useEffect } from "react"
import Script from "next/script"

interface ReCaptchaProps {
  error?: string
  clearError?: () => void
  recaptcha: {
    siteKey: string
  }
}

export default function ReCaptcha({
  recaptcha,
  error,
  clearError,
}: ReCaptchaProps) {
  const isError = error !== undefined && error !== null && error !== ""

  useEffect(() => {
    window["clearError"] = clearError
    // this will be called when the component is unmounted
    // we need to remove the global function
    return () => {
      delete window["clearError"]
    }
  }, [])

  // after doing this we can use the data-callback prop

  return (
    <div className="flex flex-col h-20">
      <div
        id="ataRecaptcha"
        className="g-recaptcha"
        data-sitekey={recaptcha?.siteKey}
        data-callback="clearError"
      ></div>
      {isError && <div className="text-sm text-red-500">{error}</div>}
    </div>
  )
}
