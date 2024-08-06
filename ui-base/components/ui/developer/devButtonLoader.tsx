"use client"

import dynamic from "next/dynamic"

export default function DevButtonLoader({
  metaData,
  setIsModalOpen,
  isModalOpen,
}) {
  const Modal = dynamic(() => import("./devModal"))
  if (!isModalOpen) {
    return null
  }
  return (
    <>
      <Modal onClose={() => setIsModalOpen(false)} metaData={metaData} />
    </>
  )
}
