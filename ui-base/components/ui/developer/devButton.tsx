"use client"

import { Suspense, use, useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import ReactDOM, { createPortal } from "react-dom"

import { ComponentMetaData } from "@/ui-base/lib/services/data/componentMetaDataService"
import DevButtonLoader from "./devButtonLoader"

interface DevButtonProps {
  metaData: ComponentMetaData
}

const DevButton = (props: DevButtonProps) => {
  const searchParams = useSearchParams()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const dev = searchParams && searchParams.get("dev")

  useEffect(() => setMounted(true), [])

  const isDev = dev === "true" || process.env.NEXT_PUBLIC_AUTHOR_MODE === "true"
  if (!isDev) {
    return null
  }

  const handleClick = () => {
    setIsModalOpen(true)
  }

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="absolute right-0  z-[1000] -translate-y-1/2">
          <button
            onClick={handleClick}
            className="rounded-full border-2 border-blue-600 bg-blue-600 p-2 text-white hover:border-blue-700 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            {/* <FontAwesomeIcon icon={faInfo} /> */}
            Info
          </button>
        </div>

        {mounted && isModalOpen
          ? createPortal(
              <DevButtonLoader
                isModalOpen={isModalOpen}
                metaData={props.metaData}
                setIsModalOpen={setIsModalOpen}
              />,
              document.getElementById("portal-root")
            )
          : null}
      </Suspense>
    </>
  )
}

export default DevButton
