"use client"

import { useRef, useState } from "react"
import { ChevronDownIcon } from "@radix-ui/react-icons"
import { useOnClickOutside } from "usehooks-ts"

interface MultipleSelectProps {
  field: {
    id: string
    label: string
    placeholder: string
    options:
      | {
          label: string
          value: string
        }[]
      | undefined
  }
  formik: any
  className?: string
}

export default function MultipleSelect(
  props: MultipleSelectProps
): JSX.Element {
  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  const { field, formik, className } = props

  const handleClickOutside = () => {
    setOpen(false)
  }

  const handleClickInside = () => {
    setOpen((prev) => !prev)
  }
  useOnClickOutside(ref, handleClickOutside)

  const selectedOptions = formik.values[field.id] || []

  return (
    <>
      <select
        className="hidden"
        id={field.id}
        name={field.id}
        multiple
        value={formik.values[field.id]}
      >
        {field.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="relative inline-block text-left" ref={ref}>
        <div
          onClick={handleClickInside}
          style={{
            overflow: "hidden",
          }}
          className={`inline-flex items-center justify-between rounded-md shadow-sm ${className}`}
        >
          <span>
            {selectedOptions.length === 0
              ? field?.placeholder
              : selectedOptions.join(", ")}
          </span>
          <button type="button">
            <ChevronDownIcon
              className="-mr-2"
              fill="currentColor"
              stroke="currentColor"
            />
          </button>
        </div>

        {open && (
          <div
            className={`absolute inset-x-0 mt-1 w-full max-w-screen-md origin-top-right rounded-md shadow-lg`}
          >
            <div className="shadow-xs rounded-md bg-white">
              <ul className="list-none">
                {field.options?.map((option) => (
                  <li
                    key={option.value}
                    className="border-t border-gray-200  first:border-t-0"
                  >
                    <label className="flex cursor-pointer items-center gap-x-2 px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selectedOptions.includes(option.value)}
                        onChange={(e) => {
                          const isChecked = e.target.checked
                          const newValue = isChecked
                            ? [...selectedOptions, option.value]
                            : selectedOptions.filter(
                                (value) => value !== option.value
                              )
                          formik.setFieldValue(field.id, newValue)
                        }}
                        className="form-checkbox h-4 w-4 text-blue-500"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
