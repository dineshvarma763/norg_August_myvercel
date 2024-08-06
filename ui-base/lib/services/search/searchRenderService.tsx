"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { BallTriangle as Loader } from "react-loading-icons"

import DevButton from "@/ui-base/components/ui/developer/devButton"
import { LanguageSite } from "../../interfaces/LanguageSite"
import { GetCMS } from "../cmsContextService"
import { getLogger } from "../logging/LogConfig"
import { processURLForNavigation } from "../urlService"

const log = getLogger("ui-base.services.search.searchRenderService")

interface Product {
  _id: string
  name: string
  _urls: { "en-us": string }
  productPhoto: {
    src: string
    media?: {
      altText?: string
      name?: string
    }
  }
  ogDescription?: string
  sEODescription?: string
}

interface Props {
  data: Product[]
  query: string
  languageSite: LanguageSite
}

const newLocal = (
  <svg
    className=""
    width="100"
    height="100"
    viewBox="0 0 29 43"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 14.0904C0 21.8559 6.32499 28.1808 14.0904 28.1808C21.8559 28.1808 28.1808 21.8559 28.1808 14.0904C28.1808 6.32498 21.8667 0 14.0904 0C6.31416 0 0 6.32498 0 14.0904ZM3.92063 14.0904C3.92063 8.48024 8.48025 3.92062 14.0904 3.92062C19.7006 3.92062 24.2602 8.48024 24.2602 14.0904C24.2602 19.7006 19.7006 24.2602 14.0904 24.2602C8.48025 24.2602 3.92063 19.7006 3.92063 14.0904Z"
      fill="orange"
    ></path>
    <path
      d="M20.0794 31.3972H7.7002V35.3178H20.0794V31.3972Z"
      fill="orange"
    ></path>
    <path
      d="M20.0794 38.1125H7.7002V42.0332H20.0794V38.1125Z"
      fill="orange"
    ></path>
  </svg>
)

function ResultsGrid({ data, query, languageSite }: Props) {
  if (!query) {
    return <></>
  }

  if (!data || data.length === 0) {
    return <div>No Results</div>
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {data.map((item) => {
        let defaultImg = newLocal

        if (item?.productPhoto?.src) {
          defaultImg = (
            <Image
              width={100}
              height={100}
              className="object-contain"
              src={item?.productPhoto?.src}
              alt={
                item?.productPhoto?.media?.altText != ""
                  ? item?.productPhoto?.media?.altText
                  : item?.productPhoto?.media?.name != ""
                  ? item?.productPhoto?.media?.name
                  : item?.name
              }
            />
          )
        }

        const description = item?.ogDescription ?? item?.sEODescription

        return (
          <div
            key={item._id}
            className="flex flex-col overflow-hidden rounded-lg bg-white sm:flex-row sm:items-center"
          >
            <div className="flex  w-40 shrink-0 items-center justify-center p-4 [&>img]:h-25 [&>img]:w-25 [&>img]:object-cover">
              {defaultImg}
            </div>
            <div className="grow py-4 sm:px-4">
              <h3 className="mb-2 font-urbanist text-lg text-my-blue">
                {item?.name}
              </h3>
              {description && (
                <p className="text-md mb-2 font-urbanist text-my-blue">
                  {description}
                </p>
              )}
              <Link
                className="inline-block pb-2 text-center font-urbanist font-medium text-my-yellow underline"
                href={item._urls["en-us"] ?? ""}
              >
                Read More &rarr;
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function DetectAndRenderSiteSearch({ data, languageSite }) {
  const [searchedQuery, setSearchedQuery] = useState("")
  const [searchField, setSearchField] = useState("")
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [totalItems, setTotalItems] = useState<number>(0) // new state variable
  const searchParams = useSearchParams()
  const router = useRouter()

  const keyword = searchParams.get("keyword")

  const searchBasePath = useMemo(() => {
    if (languageSite) {
      return processURLForNavigation("/search", languageSite)
    }
    return "/search"
  }, [languageSite])

  let dataSub = data
  //let dataSub = GetPageComponentData(data, COMPONENT_SITE_SEARCH.toLowerCase());

  useEffect(() => {
    if (!keyword) return
    performSearch(keyword, languageSite)
    setSearchField((prev) => (prev !== keyword ? keyword : prev))
  }, [keyword, languageSite])

  // Add this new function inside the detectAndRenderSiteSearch component
  const handleSearchTermClick = (searchTerm) => {
    // console.log("handleSearchTermClick", searchTerm)
    router.push(searchBasePath + `?keyword=${searchTerm}`)
  }

  const handleSearch = () => {
    // console.log("handleSearch", searchField)
    router.push(searchBasePath + `?keyword=${searchField}`)
  }

  const performSearch = async (query, languageSite) => {
    setLoading(true) // Set loading to true before fetching data
    const data = await getSearchResult(query, languageSite.countryCode)

    if (data.status !== "success"){
      // console.log("Something went wrong")
      setLoading(false)
      return <h1>Fetch Error</h1>
    }

    // Update the results state variable with the search results
    if (data._embedded && data._embedded.content) {
      setResults(data._embedded.content)
      setTotalItems(data._totalItems) // update totalItems state variable
    } else {
      setResults([])
      setTotalItems(0) // update totalItems state variable
    }

    setSearchedQuery(query) // update searchedQuery state variable

    // Set loading to false after a minimum of 3 seconds
    setTimeout(() => {
      setLoading(false)
    }, 3000)
  }

  data.componentMetaData.dataProvided = data.componentData

  if (!dataSub) return <></>

  return (
    <div className="container w-full">
      <Suspense>
        <DevButton metaData={data.componentMetaData} />
      </Suspense>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500/100">
          <Loader stroke="#FFFFFF" speed={0.75} />
        </div>
      )}

      <div className="flex w-full break-after-auto py-4">
        <input
          type="text"
          value={searchField}
          onChange={(e) => {
            setSearchField(e.target.value)
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search..."
          className="focus:shadow-outline grow rounded-l-lg bg-gray-200 px-5 py-3 font-urbanist capitalize focus:outline-none"
        />
        <button
          className="focus:shadow-outline flex items-center rounded-r-lg bg-my-yellow hover:bg-my-black [&:hover>svg]:fill-white px-4 py-2 font-urbanist text-gray-800 focus:outline-none transition"
          onClick={() => handleSearch()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 11-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div className="w-full">
        <p className="pt-4 font-urbanist text-my-blue">Popular Searches</p>
        <div className="w-full break-after-auto py-4">
          <div className="flex flex-wrap gap-x-4 gap-y-2 sm:gap-x-4">
            {data.componentData.searchTerms.map((item, index) => (
              <a
                key={index}
                className="rounded-full bg-my-yellow px-4 py-2 text-center font-urbanist font-bold uppercase leading-body1 tracking-0.1em text-my-blue transition hover:bg-my-black hover:text-white sm:px-8"
                onClick={() => handleSearchTermClick(item)}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full">
        {searchedQuery && (
          <p className="pt-4 font-urbanist text-my-blue">
            Found {totalItems} results using the term &ldquo;{searchedQuery}
            &rdquo;
          </p>
        )}
        {/* Render the message */}
        <div className="mt-8 w-full break-after-auto py-4 text-my-blue">
          <ResultsGrid
            data={results}
            query={searchedQuery}
            languageSite={data.globalData?.languageSite}
          />
        </div>
      </div>
    </div>
  )
}

export function getSearchHeaders() {
  let headers = {}

  if (GetCMS() === "heartcore") {
    headers = {
      "Api-Version": "2",
      "Umb-Project-Alias": process.env.UMBRACO_PROJECT_ALIAS,
      "Api-Key": process.env.UMBRACO_API_KEY,
      "Accept-Language": "en-US",
    }
  } else if (GetCMS() === "kontent") {
  } else if (GetCMS() === "contentful") {
  }

  return headers
}

async function getSearchResult(query: any, countryCode: string): Promise<any> {
    try {
	const response = await fetch(
	    `/api/cms/${GetCMS()}/search?q=${encodeURIComponent(query)}&language=${encodeURIComponent(countryCode)}`)
	if (!response.ok) {
	    return {"status": "failed"}
	}
	let data = await response.json()
	data.status = "success"; // Added status field

	// Filter out the data so that any url containing /_components is removed
	// This is because we don't want to show any components in the search results
	if (data._embedded && data._embedded.content) {
	    data._embedded.content = data._embedded.content.filter(
		(item) => item._url && !item._url.includes("/_components")
	    )
	}
	return data
    }
    catch (error) {
	// console.log("Fetch Error :", error);
	return {"status": "Fetch Error"}
    };
}
