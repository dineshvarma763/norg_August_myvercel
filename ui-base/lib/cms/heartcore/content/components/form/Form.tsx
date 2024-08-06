"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { useFormik } from "formik"

import PhoneInput from "@/ui-base/components/ui/PhoneInput"
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"
import { processURLForNavigation } from "@/ui-base/lib/services/urlService"
import { cn } from "@/ui-base/lib/util/utils"
import "../../../../../../styles/phone-input.css"
import { filterAndUpdateClass } from "../../../filterAndUpdateClass"
import DateInput from "./DatePicker"
import DynamicRecaptcha from "./DynamicRecaptcha"
import MultipleSelect from "./MultipleSelect"

interface FormProps {
  formSpec: any
  returnPage: any
  languageSite: LanguageSite
  children?: React.ReactNode
  handleSubmit?: (values: any) => void
}

const MyForm = ({
  formSpec,
  returnPage,
  languageSite,
  children,
  handleSubmit,
}: FormProps) => {
  const formRef = React.useRef<HTMLFormElement>(null)
  const pathname = usePathname()
  const formik = useFormik({
    initialValues: {
      ...formSpec?.fields?.reduce(
        (acc, field) => ({ ...acc, [field.id]: "" }),
        {}
      ),
      retUrl: `${
        process.env.NEXT_PUBLIC_CMS_MAIN_DOMAIN
      }${processURLForNavigation(returnPage?.url, languageSite)}`,
    },
    validate: (values) => {
      const errors = {}
      let firstErrorId = null
      formSpec?.fields.forEach((field) => {
        // Validate the field value against the required flag
        if (!values[field.id] && field.required && values[field.id] === "") {
          const specField = formSpec?.fields.find((f) => f.id === field.id)
          errors[field.id] = specField.errorMessage || "Filed is required"
          if (!firstErrorId) firstErrorId = field.id
          return
        }

        // Validate the field value against the pattern
        const _fieldPattern = fieldPattern(field)
        if (_fieldPattern) {
          const pattern = new RegExp(_fieldPattern)
          if (!pattern.test(values[field.id])) {
            errors[field.id] = `Invalid ${field?.label?.toLowerCase()}`
            if (!firstErrorId) firstErrorId = field.id
            return
          }
        }

        // Validate the field value against the max length
        if (field.maxLength) {
          if (values[field.id].length > field.maxLength) {
            errors[field.id] = `Maximum ${field.maxLength} characters allowed`
            if (!firstErrorId) firstErrorId = field.id
            return
          }
        }

        // Validate the field value against the min length
        if (field.minLength) {
          if (values[field.id].length < field.minLength) {
            errors[field.id] = `Minimum ${field.minLength} characters required`
            if (!firstErrorId) firstErrorId = field.id
            return
          }
        }
      })

      // captcha validation
      if (formSpec?.recaptcha?.required) {
        const captcha: any = document.querySelector(".g-recaptcha-response")

        if (captcha) {
          const captchaValue = captcha.value
          if (!captchaValue) {
            errors["captcha"] = "Please verify you are not a robot"
            if (!firstErrorId) firstErrorId = "captcha"
          } else {
            formik.setFieldError("captcha", "")
          }
        }
      }

      // Scroll to the first error and focus on it
      if (firstErrorId) {
        const firstError = document.getElementById(firstErrorId)
        if (firstError) {
          firstError.scrollIntoView({
            behavior: "smooth",
            block: "center",
          })
          firstError.focus({ preventScroll: true })
        }
      }
      return errors
    },

    onSubmit: (values, { resetForm }) => {
      // console.log("values", JSON.stringify(values, null, 2))
      // Do something with the form values, like sending them to the server
      if (handleSubmit) handleSubmit(values)

      // Trigger the default form submission behavior
      if (formRef.current) {
        formRef.current.submit()
      }
    },

    validateOnChange: false,
    validateOnBlur: true,
  })

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target

    // For checkboxes, convert the value to 1 or 0 based on the checked state
    const inputValue = type === "checkbox" ? (checked ? "1" : "0") : value

    // Clear the error for the changed field
    formik.setFieldError(name, "")

    // Update the field value
    formik.handleChange(event) // Pass the entire event object to handleChange
    formik.setFieldValue(name, inputValue) // Update the field value manually
  }

  if (!Object.keys(formSpec).length) {
    return null
  }

  return (
    <form
      ref={formRef}
      action={formSpec?.formAction}
      noValidate
      method="POST"
      onSubmit={formik.handleSubmit}
      autoComplete="off"
      className={`box-border flex flex-wrap gap-x-4 gap-y-6 py-8 font-urbanist sm:mx-auto sm:px-12 ${
        pathname.startsWith("/library") || pathname.startsWith("/au/contact-us")
          ? "px-6"
          : ""
      }`}
    >
      {children}
      <MemoHiddenField
        hiddenFields={formSpec?.hiddenFields}
        returnPage={returnPage?.url}
        languageSite={languageSite}
      />
      {formSpec?.fields?.map((field) => (
        <div key={field.id} className={`box-border flex w-full flex-col`}>
          {field.type !== "checkbox" && (
            <label
              htmlFor={field.id}
              className="mb-2 text-sm font-extrabold uppercase text-my-black"
            >
              {field.label}:
              <span className="text-lg leading-none text-red-500">
                {field.required ? "*" : null}
              </span>
            </label>
          )}
          <RenderInput
            field={field}
            formik={formik}
            handleInputChange={handleInputChange}
            languageSite={languageSite}
          />
          {formik.errors[field.id] && (
            <div className="text-sm text-red-500">
              {(formik.errors[field.id] as string) || ""}
            </div>
          )}
        </div>
      ))}
      {formSpec?.consent ? (
        <div
          key={formSpec?.consent}
          className={`pt-81} box-border flex w-full flex-col`}
        >
          <div className="flex items-start">
            <input
              type={formSpec?.consent?.type ?? "checkbox"}
              id={formSpec?.consent?.id}
              name={formSpec?.consent?.id}
              onChange={handleInputChange}
              className="mt-2 aspect-square h-5 w-5"
              checked={formik.values[formSpec?.consent?.id] === "1"}
              value={formik.values[formSpec?.consent?.id] || "0"}
              required={formSpec?.consent?.required}
            />
            <label
              htmlFor={formSpec?.consent?.id}
              className="ml-4 max-w-screen-md text-body1 leading-body1 text-my-black"
            >
              <span
                className="[&>*]:m-0 [&>*]:p-0"
                dangerouslySetInnerHTML={{
                  __html: filterAndUpdateClass(
                    formSpec?.consent?.label ?? ``,
                    languageSite
                  ),
                }}
              />
              <span className="text-lg leading-none text-red-500">
                {formSpec?.consent?.required ? "*" : null}
              </span>
            </label>
          </div>
        </div>
      ) : null}
      <DynamicRecaptcha formSpec={formSpec} formik={formik} />
      <div className="w-full py-8">
        <button
          disabled={
            formik.isSubmitting ||
            (formSpec?.consent?.required &&
              formik.values[formSpec?.consent?.id] !== "1")
          }
          type="submit"
          className="box-border w-full max-w-screen-md rounded-full bg-my-yellow px-4 py-2 text-center text-body1 font-800 uppercase leading-body1 tracking-0.1em text-my-blue transition hover:bg-my-black hover:text-white focus:outline-none disabled:opacity-50"
        >
          Submit
        </button>
      </div>
    </form>
  )
}

const RenderInput = ({ field, formik, handleInputChange, languageSite }) => {
  const pathname = usePathname()
  const countryCode = pathname.startsWith("/au") ? "au" : "us"

  const classes = cn(
    "box-border h-[50px] !w-full rounded-md border border-solid !border-gray-500 bg-white px-3 py-2 text-my-black shadow-sm focus:outline-none sm:!max-w-screen-md",
    {
      "h-auto": field.type === "textarea",
      "!border-red-500": formik.errors[field.id],
    }
  )
  switch (field.type) {
    case "textarea":
      return (
        <textarea
          id={field.id}
          // className=""
          name={field.id}
          placeholder={field?.placeholder}
          onChange={handleInputChange}
          value={formik.values[field.id]}
          required={field.required}
          rows={field.rows ?? 6}
          maxLength={field.maxLength}
          className={`${classes}`}
        />
      )
    case "email":
      return (
        <input
          id={field.id}
          name={field.id}
          placeholder={field?.placeholder}
          type={field.type}
          onChange={handleInputChange}
          value={formik.values[field.id]}
          required={field.required}
          className={`${classes}`}
          pattern={fieldPattern(field)}
          maxLength={field.maxLength}
        />
      )
    case "select":
      return (
        <select
          id={field.id}
          name={field.id}
          onChange={handleInputChange}
          value={formik.values[field.id]}
          required={field.required}
          className={`${classes} min-h-[50px]`}
        >
          <option value="">{field?.placeholder}</option>
          {field.options?.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )
    case "checkbox":
      return (
        <div className="flex items-center">
          <input
            type={field.type ?? "checkbox"}
            id={field.id}
            name={field.id}
            onChange={handleInputChange}
            // className="w-5 h-5 aspect-square"
            value={formik.values[field.id]}
            required={field.required}
          />
          <label
            htmlFor={field.id}
            className="ml-4 flex text-body1 leading-body1 text-my-black"
          >
            <span
              className="[&>*]:m-0 [&>*]:p-0"
              dangerouslySetInnerHTML={{
                __html: filterAndUpdateClass(field.label, languageSite),
              }}
            />
            <span className="text-lg leading-none text-red-500">
              {field.required ? "*" : null}
            </span>
          </label>
        </div>
      )

    case "date":
      return (
        <DateInput
          country={countryCode}
          id={field.id}
          name={field.id}
          updateValue={(value) => {
            formik.setFieldError(field.id, "")
            formik.setFieldValue(field.id, value)
          }}
          required={field.required}
          className={classes}
        />
      )
    case "phone":
      return (
        <>
          {/* <div className={` ${styles["react-tel-input"]} `}></div> */}

          <PhoneInput
            country={countryCode}
            specialLabel={""}
            value={formik.values[field.id]}
            onChange={(_1, _2, e) => {
              handleInputChange(e)
            }}
            inputProps={{
              id: field.id,
              name: field.id,
              placeholder: field?.placeholder,
              required: field.required,
              maxLength: field.maxLength,
              className: `form-control ${classes}`,
            }}
          />
        </>
      )

    case "multiple":
      return (
        <MultipleSelect field={field} formik={formik} className={classes} />
      )

    default:
      return (
        <>
          <input
            id={field.id}
            name={field.id}
            placeholder={field?.placeholder}
            type={field.type}
            onChange={handleInputChange}
            value={formik.values[field.id]}
            required={field.required}
            maxLength={field.maxLength}
            pattern={fieldPattern(field)}
            className={`${classes}`}
          />
        </>
      )
  }
}

export default MyForm

const fieldPattern = (field) => {
  if (field.pattern) return field.pattern
  return (
    {
      email: "^[a-zA-Z][a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$",
      // date: "d{4}/d{2}/d{2}",
    }[field.type] ?? ""
  )
}

const MemoHiddenField: React.FC<any> = React.memo(
  ({ hiddenFields, returnPage, languageSite }) =>
    hiddenFields?.map((field) => {
      // Check if the current field id is 'retUrl'
      const fieldValue =
        field.id === "retURL"
          ? `${
              process.env.NEXT_PUBLIC_CMS_MAIN_DOMAIN
            }${processURLForNavigation(returnPage, languageSite)}`
          : field.value

      if (field.id === "retURL") {
        console.log("retURL", fieldValue)
      }

      return (
        <input
          type="hidden"
          name={field.id}
          placeholder={field?.placeholder}
          value={fieldValue}
          key={field.id}
        />
      )
    })
)

MemoHiddenField.displayName = "MemoHiddenField"
