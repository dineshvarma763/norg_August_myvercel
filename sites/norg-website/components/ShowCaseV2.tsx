import React from "react"
import Link from "next/link"


import { parseShowcaseHTMLContent } from "@/ui-base/lib/cms/heartcore/filterAndUpdateClass"
import DashboardShowcase from "./DashboardShowcase"

const ShowCaseV2 = ({ data }) => {
  const { paragraph } = parseShowcaseHTMLContent(data?.showcaseDescription)
  return (
    <section className="container mx-auto my-14 flex w-full px-4 sm:mt-28 sm:h-[38rem]">
      <div className="flex-[4]">
        <div className="flex flex-col gap-8">
          <h1 className="col-start-1 row-start-2 max-w-[36rem] text-start text-5xl font-extrabold tracking-tight text-white md:text-left md:text-[4.5rem] md:leading-[4.5rem] lg:text-6xl xl:max-w-[43.5rem] xl:text-7xl">
            {data?.showcaseTitle || "Build a custom GPT"}
          </h1>
          <p className="col-start-1 row-start-3 max-w-xl text-start text-white md:text-left md:text-lg md:leading-6 md:tracking-normal">
            {paragraph ||
              "Create a custom GPT-3 model for your business in minutes. No coding required."}
          </p>
          <div className="flex flex-row flex-wrap  gap-6 md:items-center">
            {data?.showcaseCTAList.map((ctaItem, index) => (
              <CTA
                key={index}
                heading={ctaItem.content.heading}
                link={ctaItem.content.link}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="hidden flex-[3] justify-center sm:flex">
        <div className="relative ml-10 h-full w-full select-none">
          <figure className="absolute -left-12 top-[6.4rem] z-10 flex h-[38rem] w-[20rem] scale-75 flex-col justify-between rounded-[1.5rem] border-2 border-charcoal bg-[#111928] p-3 text-white">
            <div>
              <div className="flex w-full flex-row items-center justify-between py-2">
                <header className="flex flex-row items-center justify-center gap-2">
                  <figcaption className="text-md font-bold text-white">
                    Studio AI
                  </figcaption>
                </header>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  className="w-5 text-white"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <div className="h-0.5 rounded-3xl bg-charcoal"></div>
              <section className="mt-3 flex flex-col justify-between gap-2">
                <div className="ml-8 flex justify-end">
                  <div className="mb-1.5 max-w-prose overflow-auto rounded-lg bg-my-indigo px-4 py-3 text-white">
                    <div className="dark flex flex-col items-start gap-4 break-words">
                      <div className="dark:prose-invert prose w-full break-words text-left text-xs text-inherit">
                        <p>
                          What are the key features of this Ryobi One+ drill?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mr-8 flex justify-start">
                  <div className="mb-1.5 max-w-prose overflow-auto rounded-lg bg-charcoal px-4 py-3 text-white">
                    <div className="flex flex-col items-start gap-4 break-words">
                      <div className="dark:prose-invert prose w-full break-words text-left text-xs text-inherit">
                        <p>
                          This drill is cordless, lightweight, and has multiple
                          speed settings. It&apos;s great for DIY projects
                          around the home.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-8 flex justify-end">
                  <div className="mb-1.5 max-w-prose overflow-auto rounded-lg bg-my-indigo px-4 py-3 text-white">
                    <div className="dark flex flex-col items-start gap-4 break-words">
                      <div className="dark:prose-invert prose w-full break-words text-left text-xs text-inherit">
                        <p>What is the price of this GMC circular saw?</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mr-8 flex justify-start">
                  <div className="mb-1.5 max-w-prose overflow-auto rounded-lg bg-charcoal px-4 py-3 text-white">
                    <div className="flex flex-col items-start gap-4 break-words">
                      <div className="dark:prose-invert prose w-full break-words text-left text-xs text-inherit">
                        <p>
                          The current price is $129 which is 20% off. Would you
                          like me to add it your cart?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="ml-8 flex justify-end">
                  <div className="mb-1.5 max-w-prose overflow-auto rounded-lg bg-my-indigo px-4 py-3 text-white">
                    <div className="dark flex flex-col items-start gap-4 break-words">
                      <div className="dark:prose-invert prose w-full break-words text-left text-xs text-inherit">
                        <p>Do you offer any discounts or promotions?</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mr-8 flex justify-start">
                  <div className="mb-1.5 max-w-prose overflow-auto rounded-lg bg-charcoal px-4 py-3 text-white">
                    <div className="flex flex-col items-start gap-4 break-words">
                      <div className="dark:prose-invert prose w-full break-words text-left text-xs text-inherit">
                        <p>We have weekly specials and loyalty discounts.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            <section className="flex flex-col gap-2">
              <div className="flex list-none flex-row gap-4 whitespace-nowrap text-xs font-medium">
                <li className="rounded-md bg-charcoal p-2 text-white">
                  Prices
                </li>
                <li className="rounded-md bg-charcoal p-2 text-white">
                  Services
                </li>
                <li className="rounded-md bg-charcoal p-2 text-white">
                  Case studies
                </li>
              </div>
              <div className="flex flex-row items-center justify-between rounded-lg border border-charcoal p-2 align-middle">
                <span className="ml-1 text-xs"></span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  className="h-5 w-5 text-indigo-500"
                >
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z"></path>
                </svg>
              </div>
            </section>
          </figure>
          <figure className="absolute -left-24 -top-44 -z-10 flex h-[54.6rem] w-[85rem] scale-[0.65] flex-col justify-start overflow-hidden rounded-3xl border-2 border-charcoal">
            <DashboardShowcase />
          </figure>
        </div>
      </div>
    </section>
  )
}

export default ShowCaseV2

const CTA = ({
  heading,
  link,
  index,
}: {
  heading: string
  link: { url: string }
  index: number
}) => {
  if (!heading || !link) return null
  const LinkComponent = link?.url?.startsWith("/") ? Link : "a"
  return (
    <div className="flex w-fit flex-col items-center justify-center">
      {index === 1 ? (
        <LinkComponent
          className="flex flex-row items-center gap-2 text-lg font-semibold"
          href={link.url}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className="h-6 w-6 text-white"
          >
            <path
              fill-rule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.983a1.125 1.125 0 010 1.966l-5.603 3.113A1.125 1.125 0 019 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113z"
              clip-rule="evenodd"
            ></path>
          </svg>
          {heading}
        </LinkComponent>
      ) : (
        <LinkComponent
          className="group/cta flex flex-row gap-3 rounded-xl px-5 py-2.5 text-base font-semibold capitalize leading-8 text-my-white hover:animate-animatedgradient hover:shadow-sm  hover:saturate-150"
          href={link.url}
          style={{
            backgroundImage:
              "linear-gradient(155deg, #7c3aed 40%, #f80282 100%, #fd309b 0)",
          }}
        >
          {heading}

          <span
            aria-hidden="true"
            className="transition-all duration-500 ease-in-out group-hover/cta:translate-x-1"
          >
            →
          </span>
        </LinkComponent>
      )}
    </div>
  )
}


