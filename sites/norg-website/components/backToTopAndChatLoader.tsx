"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

const BackToTopAndChatLoader = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  const BackToTopAndChat = dynamic(() =>
    import("./BackToTopAndChat").then((module) => module.BackToTopAndChat)
  )

  if (!mounted) return null
  return createPortal(
    <BackToTopAndChat />,
    document.getElementById("portal-root")
  )
}

export default BackToTopAndChatLoader
