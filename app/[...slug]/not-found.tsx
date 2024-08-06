"use client"

// Error components must be Client Components
import Image from "next/image"
import Link from "next/link"

export default function Error() {
  return (
    <div className="flex h-screen justify-center bg-my-blue px-4 pt-5 text-white">
      <div className="mx-auto flex max-w-md flex-col">
        <div className="flex justify-center">
          <Image
            src="/norg-website/images/logo-blue.png"
            alt="Logo"
            width={140}
            height={38}
            className="object-contain md:max-w-[140px] xl:max-w-full"
          />
        </div>
        <div className="relative mb-4">
          <Image
            src="https://media.umbraco.io/norg-website/qv4nlkzg/norg-1.png"
            alt="Norg.ai Illustration"
            layout="responsive"
            width={1261}
            height={731}
          />
        </div>
        <p className="mb-6 text-center text-lg">
          Our Norg AI couldn’t find the page you are looking for.
        </p>
        <Link
          href="/"
          className="rounded-md bg-my-indigo px-4 py-2 text-center text-lg hover:bg-my-darkerIndigo"
        >
          Return to Home Page
        </Link>
      </div>
    </div>
  )
}
