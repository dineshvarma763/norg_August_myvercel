import { Suspense } from "react"

import DevButton from "@/ui-base/components/ui/developer/devButton"
import { ComponentDataProps } from "@/ui-base/lib/services/data/componentMetaDataService"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { replacePTagWithDivTag } from "@/ui-base/lib/util/richText"

const log = getLogger(
  "ui-base.cms.heartcore.content.advancedspecificationtableComponent"
)

export default function advancedspecificationtableComponent(
  data: ComponentDataProps
) {
  log.trace("adv specs data passed in:", JSON.stringify(data))

  populateMetaData(data)

  return (
    <div className="container mt-6 w-full" id="specifications">
      <Suspense>
        <DevButton metaData={data.componentMetaData} />
      </Suspense>
      <AdvancedSpecificationTable data={data.componentData} />
    </div>
  )
}

function populateMetaData(data: ComponentDataProps) {
  data.componentMetaData.dataProvided = data.componentData
  // Get the relative path of the current file
  data.componentMetaData.rendering =
    "sites/norg-website/content/heartcore/components/advancedspecificationtable/advancedspecificationtableComponent.tsx"
  // Get the name of the current function
  data.componentMetaData.renderingExportFunction =
    "specificationstableComponent"
}

// Define types for the data
interface ValueContent {
  isHeading: boolean
  columnSpan: number
  value: string
}

interface Content {
  values: {
    content: ValueContent
  }[]
}

interface TableRow {
  content: Content
}

interface AdvancedSpecificationTableProps {
  data: {
    rows: TableRow[]
  }
}

export const AdvancedSpecificationTable: React.FC<
  AdvancedSpecificationTableProps
> = ({ data }) => {
  const headerCount = data?.rows[0]?.content.values.length || 0

  return (
    <table className="relative table w-full border-separate rounded-xl border border-slate-300 bg-white font-urbanist">
      <thead className="w-full">
        <tr>
          {data?.rows[0]?.content.values.map((heading, index) => (
            <th
              key={index}
              colSpan={heading.content.columnSpan || 1}
              className="!relative px-4 py-2 text-xxs sm:text-sm"
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: replacePTagWithDivTag(heading.content.value),
                }}
              />
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="w-full">
        {data?.rows.slice(1).map((row, rowIndex) => {
          let cellCount = 0
          let isPrevSpecial = false
          const cells = row.content.values.map((cell, cellIndex) => {
            cellCount += cell.content.columnSpan || 1

            // Check if the previous cell contained "Email", "Phone" or "Website"
            if (cellIndex > 0) {
              const prevCellValue =
                row.content.values[cellIndex - 1].content.value?.toLowerCase()
              isPrevSpecial =
                prevCellValue.includes("email") ||
                prevCellValue.includes("phone") ||
                prevCellValue.includes("website")
            }

            return (
              <td
                key={cellIndex}
                colSpan={cell.content.columnSpan || 1}
                className={`px-1 py-2 md:px-4 ${
                  cell.content.isHeading ? "font-bold" : ""
                } w-32 whitespace-normal break-all border-r border-slate-300 text-xs last:border-r-0 md:w-96 md:text-base`}
              >
                <div
                  className={`${isPrevSpecial ? "[&>*]:!text-my-yellow" : "[&_a]:!text-my-yellow"}`}
                  dangerouslySetInnerHTML={{
                    __html: replacePTagWithDivTag(cell.content.value),
                  }}
                />
              </td>
            )
          })
          // Fill remaining cells
          for (let i = cellCount; i < headerCount; i++) {
            cells.push(
              <td
                key={i}
                colSpan={1}
                className="w-32 whitespace-normal break-all border-b border-r border-slate-300 px-1 py-2 text-xs last:border-r-0 md:w-96 md:px-4 md:text-base"
              >
                &nbsp;
              </td>
            )
          }
          return <tr key={rowIndex}>{cells}</tr>
        })}
      </tbody>
    </table>
  )
}
