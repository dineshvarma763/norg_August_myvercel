"use client"

import React, { ImgHTMLAttributes, memo, useEffect, useRef } from "react"

type InlineSVGProps = ImgHTMLAttributes<HTMLImageElement> &
  React.SVGProps<SVGSVGElement>

const updateChildAttributes = (element: SVGElement | null): void => {
  if (element && element instanceof SVGElement) {
    if (element.tagName === "mask") return
    const fill = element.getAttribute("fill")
    const stroke = element.getAttribute("stroke")
    if (fill && fill !== "none") {
      element.setAttribute("fill", "currentColor")
    }
    if (stroke && stroke !== "none") {
      element.setAttribute("stroke", "currentColor")
    }

    const childNodes = element.childNodes
    for (let i = 0; i < childNodes.length; i++) {
      const childNode = childNodes[i]
      if (childNode instanceof SVGElement) {
        updateChildAttributes(childNode)
      }
    }
  }
}

const InlineSVG = memo<InlineSVGProps>(
  ({ src, alt, className, ...svgProps }: InlineSVGProps) => {
    const divRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const replaceImgWithSVG = async () => {
        try {
          const response = await fetch(src)
          const text = await response.text()
          const parser = new DOMParser()
          const xmlDoc = parser.parseFromString(text, "text/xml")
          const svg = xmlDoc.getElementsByTagName("svg")[0]

          if (className) {
            svg.setAttribute("class", className)
          }

          // Remove any invalid XML tags as per http://validator.w3.org
          svg.removeAttribute("xmlns:a")
          svg.setAttribute("alt", alt)
          // Check if the viewport is set, if the viewport is not set, the SVG won't scale.
          if (
            !svg.getAttribute("viewBox") &&
            svg.getAttribute("height") &&
            svg.getAttribute("width")
          ) {
            svg.setAttribute(
              "viewBox",
              "0 0 " +
                svg.getAttribute("height") +
                " " +
                svg.getAttribute("width")
            )
          }

          // Set additional SVG attributes based on props
          Object.entries(svgProps).forEach(([key, value]) => {
            svg.setAttribute(key, String(value))
          })

          // update fill and stroke to currentColor
          updateChildAttributes(svg)

          // Replace the <img> element with the new SVG
          const divElement = divRef.current
          if (divElement && divElement.firstChild) {
            divElement.replaceChild(svg, divElement.firstChild)
          }
        } catch (error) {
          console.error(`Error fetching or parsing SVG: ${error}`)
        }
      }

      replaceImgWithSVG()
    }, [src, className, svgProps])

    return (
      <div ref={divRef}>
        <img id={src} src={src} alt={alt} className={className} />
      </div>
    )
  }
)

InlineSVG.displayName = "InlineSVG"

export default InlineSVG
