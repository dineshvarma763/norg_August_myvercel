"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"
import { processURLForNavigation } from "@/ui-base/lib/services/urlService"
import { cn } from "@/ui-base/lib/util/utils"
import { SearchIcon } from "./Icon"

interface SearchBoxProps extends React.HTMLAttributes<HTMLInputElement> {
  showSearch: boolean
  placeholder?: string
  variant?: "desktop" | "mobile"
  languageSite?: LanguageSite
  onClose?: () => void
}

const SearchBox = (props: SearchBoxProps) => {
  const {
    showSearch = false,
    placeholder = "",
    variant = "desktop",
    languageSite,
    onClose,
    ...rest
  } = props
  const [searchText, setSearchText] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchTerm = searchParams.get("keyword")
  const searchBoxRef = useRef(null)

  useEffect(() => {
    if (!searchTerm) return
    setSearchText(searchTerm as string)
  }, [searchTerm])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target)
      ) {
        onClose?.()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  const handleChange = (e) => {
    setSearchText(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    let slug = "/search"
    if (languageSite) slug = processURLForNavigation(slug, languageSite)
    router.push(slug + `?keyword=${e.target[0].value}`)
  }

  if (showSearch === false) return <></>
  return (
    <form
      onSubmit={handleSubmit}
      ref={searchBoxRef}
      autoComplete="off"
      className={cn("relative flex items-center rounded-full bg-white", {
        "h-[46px] focus-within:absolute focus-within:left-0 focus-within:right-0":
          variant !== "mobile",
        "h-[46px] w-full": variant === "mobile",
      })}
    >
      <input
        {...rest}
        type="text"
        placeholder={placeholder + ""}
        value={searchText}
        onChange={handleChange}
        className="right-0 flex-1 bg-transparent px-4 pr-12 font-urbanist font-semibold uppercase tracking-0.1em text-my-brown-grey placeholder:text-my-brown-grey focus:text-my-dark-blue focus:outline-none focus:placeholder:text-my-dark-blue-400 sm:text-sm"
      />
      <button
        type="submit"
        className="absolute right-4 h-8 w-8 text-center text-my-blue [&>svg:hover>path]:fill-my-yellow [&>svg>path]:transition"
      >
        <SearchIcon />
      </button>
    </form>
  )
}

export default SearchBox
