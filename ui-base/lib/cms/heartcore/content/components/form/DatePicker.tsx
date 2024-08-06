"use client"

import { useRef, useState } from "react"
import DatePicker from "react-datepicker"

import "react-datepicker/dist/react-datepicker.min.css"

const getDateFormat = (country) => {
  switch (country) {
    case "us":
      return "MM/dd/yyyy"
    case "au":
      return "dd/MM/yyyy"
    default:
      return "MM/dd/yyyy" // Set a default fallback format
  }
}

interface DateInputProps {
  country?: "au" | "us"
  className?: string
  id: string
  name: string
  required: boolean
  updateValue?: (value: string) => void
}

const DateInput = ({
  country = "us",
  className,
  updateValue,
  ...rest
}: DateInputProps) => {
  const [startDate, setStartDate] = useState()
  const datePickerRef = useRef(null)

  const handleDateChange = (date) => {
    // Convert the date to the correct format (YYYY-MM-DD)
    setStartDate(date)
    let formattedDate = date
    if (date) formattedDate = date.toISOString().split("T")[0]
    updateValue?.(formattedDate || "")
  }

  return (
    <div
      className={`${className} flex items-center justify-between`}
      onClick={() => datePickerRef?.current?.input?.click()}
    >
      <DatePicker
        ref={datePickerRef}
        selected={startDate}
        onChange={handleDateChange}
        dateFormat={getDateFormat(country)}
        className="focus:outline-none"
        placeholderText={getDateFormat(country)?.toLocaleLowerCase()}
        {...rest}
      />
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
    </div>
  )
}

export default DateInput
