"use client"

import dynamic from "next/dynamic"
import { BallTriangle as Loader } from "react-loading-icons"

export default function FormClientLoader({
  formSpec,
  returnPage,
  languageSite,
}) {
  const FormClient = dynamic(() => import("./DynamicForm"), {
    ssr: false,
    loading: () => formsLoading(),
  })
  return (
    <>
      <FormClient
        formSpec={formSpec}
        returnPage={returnPage}
        languageSite={languageSite}
      />
    </>
  )
}

function formsLoading(): JSX.Element {
  return (
    <>
      <div className="flex w-full items-center justify-center bg-opacity-100 py-10">
        <Loader stroke="#000000" speed={0.5} />
      </div>
      <div className="flex min-h-[50vh] items-center justify-center lg:min-h-[100vh]">
        <h4 className="my-6 self-start text-h4 font-800 leading-h4 md:my-8">
          Loading Form ...
        </h4>
      </div>
    </>
  )
}
