import React from "react"
import { load } from "cheerio"

import { LanguageSite } from "../../interfaces/LanguageSite"
import { processURLForNavigation } from "../../services/urlService"

export function filterAndUpdateClass(html: string, languageSite: LanguageSite) {
  const passOne = filterAndUpdateTags(html, languageSite)
  const passTwo = filterAndUpdateHref(passOne, languageSite)
  const finamHtml = removeHeadBodyTag(passTwo)
  return finamHtml
}

// Original function with the anchor tags processing removed
export function filterAndUpdateTags(html: string, languageSite: LanguageSite) {
  if (!html && typeof html !== "string") {
    return ""
  }

  const $ = load(html)

  for (let i = 1; i <= 5; i++) {
    if (i == 2) {
      $(`h${i}`).addClass(
        `text-center font-800 text-3xl leading-12 md:text-h3 md:leading-h3 mb-14`
      )
    } else {
      $(`h${i}`).addClass(`pb-2 text-h${i}`)
    }
  }

  // Modify h4 tags
  $("h4").addClass("font-extrabold")

  // Modify h5 tags
  $("h5").addClass("font-extrabold")

  // Add 'list-disc' class to each ul tag
  $("ul").addClass("list-none")

  $("ul li").addClass(
    "relative"
  )

  // Add 'list-decimal' class to each ol tag
  $("ol").addClass("list-decimal pl-4")

  $("ol li").addClass("text-my-blue mb-2")

  // Add 'list-inside' class to ul li and ol li tags with text-align property
  $("ul li, ol li").each((index, element) => {
    const style = $(element).attr("style")
    if (style && style.includes("text-align")) {
      $(element).addClass("list-inside")
    }
  })

  // Add 'my-4' class to each p tag
  $("p").each(function () {
    $(this).addClass(
      "font-400 text-[14px] leading-[21px]"
    )
    $(this).find("strong").addClass("font-extrabold")
    if ($(this).find("img").length > 0) {
      if ($(this).css("text-align") === "center") {
        $(this).addClass("flex justify-center")
        $(this).css("text-align", "")
      } else if ($(this).css("text-align") === "right") {
        $(this).addClass("flex justify-end")
        $(this).css("text-align", "")
      }
    }
  })

  $("a#btn-link").addClass(
    "font-inter mx-auto -mt-4 mb-[38px] mb-[53px] w-full rounded-lg bg-my-purple hover:bg-my-black px-5 py-2.5 font-500 text-[12px] md:text-body3 leading-[18px] md:leading-[21px] no-underline text-center !text-white hover:font-500 max-w-max"
  )

  return $.html()
}

export function filterAndUpdateHref(html: string, languageSite: LanguageSite) {
  if (!html && typeof html !== "string") {
    return ""
  }

  const $ = load(html)

  // Process anchor tags' href attribute
  processAnchorTags($, languageSite)

  return $.html()
}

// New function for processing anchor tags
function processAnchorTags($: any, languageSite: LanguageSite) {
  $("a").each(function () {
    const href = $(this).attr("href")
    if (href) {
      $(this).attr("href", processURLForNavigation(href, languageSite))
      $(this).addClass("underline font-medium pb-2")
    }
  })
}

export function formatHeading(heading) {
  if (!heading || typeof heading !== "string") {
    return ""
  }

  const $ = load(heading)
  $("br").each(function () {
    $(this).addClass("hidden md:block")
  })

  return $("body").html()
}

export function removeHeadBodyTag(htmlString) {
  var formattedHtmlString = htmlString.replace(/<head>/gi, "")
  formattedHtmlString = formattedHtmlString.replace(/<\/head>/gi, "")
  formattedHtmlString = formattedHtmlString.replace(/<body>/gi, "")
  formattedHtmlString = formattedHtmlString.replace(/<\/body>/gi, "")
  formattedHtmlString = formattedHtmlString.replace(/<html>/gi, "")
  formattedHtmlString = formattedHtmlString.replace(/<\/html>/gi, "")
  return formattedHtmlString
}

export function parseShowcaseHTMLContent(htmlContent) {
  if (!htmlContent && typeof htmlContent !== "string") {
    return {
      paragraph: "",
      listItems: [],
    }
  }
  const $ = load(htmlContent)

  // Extract paragraph content
  const paragraph = $("p").text()

  // Extract list items
  const listItems = []
  $("ul li").each((index, element) => {
    listItems.push($(element).text())
  })

  // Construct result object
  const result = {
    paragraph: paragraph.trim(),
    listItems: listItems,
  }

  return result
}
