"use client"

import React, { useState } from "react"

const formatDate = (date, format) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, "0")
  const day = `${date.getDate()}`.padStart(2, "0")

  switch (format) {
    case "mm/dd/yyyy":
      return `${month}/${day}/${year}`
    case "dd/mm/yyyy":
      return `${day}/${month}/${year}`
    // Add more cases for additional formats if needed
    default:
      return `${year}-${month}-${day}`
  }
}

const getDefaultDateFormat = (country) => {
  switch (country) {
    case "us":
      return "mm/dd/yyyy"
    case "au":
      return "dd/mm/yyyy"
    // Add more cases for other countries if needed
    default:
      return "mm/dd/yyyy" // Set a default fallback format
  }
}

interface DateInputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  country?: "au" | "us"
}

const DateInput = ({
  country,
  onChange,
  className,
  ...rest
}: DateInputProps) => {
  const [dataDate, setDataDate] = useState("")
  const inputRef = React.useRef(null)

  const handleDateChange = (event) => {
    const selectedDate = new Date(event.target.value)
    const formattedDate = formatDate(
      selectedDate,
      getDefaultDateFormat(country)
    )
    setDataDate(formattedDate)
    onChange(event)
  }

  const triggerCalendar = () => {
    const dateInput = inputRef.current
    if (dateInput) {
      // @ts-ignore
      if ("showPicker" in HTMLInputElement.prototype) {
        dateInput?.showPicker()
      }
      dateInput?.focus()
      dateInput?.click()
    }
  }

  return (
    <div className="relative flex max-w-screen-md items-center">
      <input
        ref={inputRef}
        type="date"
        onChange={handleDateChange}
        className={`invisible ${className}`}
        {...rest}
      />
      <span
        className={`absolute inset-0 flex items-center pr-10 ${className}`}
        onClick={triggerCalendar}
      >
        {dataDate || getDefaultDateFormat(country)}
      </span>
      <span
        onClick={triggerCalendar}
        className="absolute inset-y-[2px] right-0 mr-[2px] inline-flex cursor-pointer items-center justify-end rounded-md bg-transparent px-3"
      >
        <svg
          width={18}
          height={16}
          viewBox="0 0 18 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#a)" fill="#000">
            <path d="M15.848 1.685h-2.516V.58a.583.583 0 0 0-.587-.58.582.582 0 0 0-.587.58v1.105H5.842V.58A.583.583 0 0 0 5.255 0a.582.582 0 0 0-.587.58v1.105H2.152C.966 1.685 0 2.64 0 3.811v10.063C0 15.045.966 16 2.152 16h13.696C17.034 16 18 15.046 18 13.874V3.811c0-1.171-.966-2.126-2.152-2.126ZM2.152 2.845h13.696c.54 0 .978.432.978.966v1.391H1.174V3.811c0-.534.438-.966.978-.966ZM15.848 14.84H2.152a.972.972 0 0 1-.978-.967V6.357h15.652v7.517a.972.972 0 0 1-.978.967Z" />
            <path d="M4.641 8.139H4.11a.582.582 0 0 0-.587.58v.44c0 .321.262.58.587.58h.532a.582.582 0 0 0 .587-.58v-.44c0-.32-.262-.58-.587-.58Zm6.139 0h-.532a.582.582 0 0 0-.587.58v.44c0 .321.262.58.587.58h.533a.582.582 0 0 0 .586-.58v-.44c0-.32-.262-.58-.587-.58Zm-3.071 0h-.533a.582.582 0 0 0-.587.58v.44c0 .321.262.58.587.58h.533a.582.582 0 0 0 .587-.58v-.44c0-.32-.262-.58-.587-.58Zm6.182 0h-.532a.582.582 0 0 0-.587.58v.44c0 .321.262.58.587.58h.532a.582.582 0 0 0 .587-.58v-.44c0-.32-.262-.58-.587-.58Zm-9.25 3.323H4.11a.582.582 0 0 0-.587.58v.44c0 .321.262.58.587.58h.532a.582.582 0 0 0 .587-.58v-.44c0-.32-.262-.58-.587-.58Zm6.139 0h-.532a.582.582 0 0 0-.587.58v.44c0 .321.262.58.587.58h.533a.582.582 0 0 0 .586-.58v-.44c0-.32-.262-.58-.587-.58Zm-3.071 0h-.533a.582.582 0 0 0-.587.58v.44c0 .321.262.58.587.58h.533a.582.582 0 0 0 .587-.58v-.44c0-.32-.262-.58-.587-.58Zm6.182 0h-.532a.582.582 0 0 0-.587.58v.44c0 .321.262.58.587.58h.532a.582.582 0 0 0 .587-.58v-.44c0-.32-.262-.58-.587-.58Z" />
          </g>
          <defs>
            <clipPath id="a">
              <path fill="#fff" d="M0 0h18v16H0z" />
            </clipPath>
          </defs>
        </svg>
      </span>
    </div>
  )
}

export default DateInput
