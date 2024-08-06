import { useAlert } from "@/hooks/useAlert"
import { ErrorMessage, Field, Form, Formik } from "formik"
import * as Yup from "yup"

import PhoneInput from "@/ui-base/components/ui/PhoneInput"
import { cn } from "@/ui-base/lib/util/utils"

interface DynamicFormProps {
  formSpec: any
  returnPage: string
  languageSite: any
}

const buildValidationSchema = (fields) => {
  const schemaFields = fields.reduce((acc, fieldRow) => {
    const rowSchema = fieldRow.fields.reduce((rowAcc, field) => {
      if (field.validation) {
        rowAcc[field.name] = Yup.string()

        if (field.type === "email") {
          rowAcc[field.name] = rowAcc[field.name]
            .email("Invalid email")
            .matches(
              /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              "Invalid email"
            )
            .test("is-valid-domain", "Invalid email", (value) => {
              const emailParts = value.split("@")
              const domain = emailParts[1]
              const domainRegex =
                /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}$/i
              if (!domainRegex.test(domain)) return false
              // non repeatable domain
              const domainParts = domain.split(".")
              const domainSet = new Set(domainParts)
              if (domainParts.length !== domainSet.size) return false
              if (!value) return true
              return true
            })
        }

        if (field.type === "tel" || field.type === "phone") {
          rowAcc[field.name] = rowAcc[field.name].test(
            "is-phone",
            "Invalid phone number",
            (value) => {
              const updatedValue = value.replace(/\D/g, "")
              const phoneRegex = /^[0-9]{8,15}$/i
              if (!phoneRegex.test(updatedValue)) return false
              if (!updatedValue) return true
              return true
            }
          )
        }

        if (field.validation.required) {
          rowAcc[field.name] = rowAcc[field.name].required(
            field.validation.required
          )
        }
        if (field.validation.minLength) {
          let minLength = field.validation.minLength.value
          if (field.type === "tel" || field.type === "phone") {
            minLength = minLength >= 8 ? minLength + 4 : minLength
          }
          rowAcc[field.name] = rowAcc[field.name].min(
            minLength,
            field.validation.minLength.message
          )
        }
        if (field.validation.maxLength) {
          let maxLength = field.validation.maxLength.value
          if (field.type === "tel" || field.type === "phone") {
            maxLength = maxLength <= 15 ? maxLength + 4 : maxLength
          }
          rowAcc[field.name] = rowAcc[field.name].max(
            maxLength,
            field.validation.maxLength.message
          )
        }

        if (field.validation.pattern) {
          rowAcc[field.name] = rowAcc[field.name].matches(
            new RegExp(field.validation.pattern.value),
            field.validation.pattern.message
          )
        }

        // Extend this if block with additional validations as needed
      }
      return rowAcc
    }, {})

    return { ...acc, ...rowSchema }
  }, {})

  return Yup.object().shape(schemaFields)
}

const getColClass = {
  "4": "col-span-4",
  "6": "col-span-6",
  "12": "col-span-12",
}

const DynamicForm = ({ formSpec }: DynamicFormProps) => {
  const initialValues = formSpec.formFields.reduce((acc, fieldRow) => {
    fieldRow.fields.forEach((field) => {
      acc[field.name] = ""
    })
    return acc
  }, {})

  const alert = useAlert()

  const validationSchema = buildValidationSchema(formSpec.formFields)

  const onSubmit = async (values, { resetForm, setValues }) => {
    // console.log("values", values)
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body: values,
        }),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      await response.json()
      alert.success("Email sent successfully")
      resetForm()
    } catch (error) {
      alert.error("Error during form submission")
      console.error("Error during form submission:", error)
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnBlur={false}
      onSubmit={onSubmit}
    >
      {({ handleSubmit }) => (
        <Form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
          className="contact-form container flex flex-col gap-y-3 pb-[80px] pt-[50px] md:gap-y-4 md:pb-[100px] md:pt-[70px]"
        >
          {formSpec.formFields.map((fieldRow, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-12 gap-4">
              {fieldRow.fields.map((field, colIndex) => (
                <div
                  key={field.name}
                  className={`${
                    getColClass[field.columnSize]
                  } max-sm:col-span-12`}
                >
                  <label
                    className="form-control w-full max-w-xs"
                    htmlFor={field.name}
                  >
                    <div className="label mb-2 p-0">
                      <span className="text-nav font-500 leading-nav text-white">
                        {field.label}
                      </span>
                    </div>
                  </label>
                  {renderField(field)}
                  <ErrorMessage
                    name={field.name}
                    component="div"
                    className="text-error"
                  />
                </div>
              ))}
            </div>
          ))}
          <button
            type="submit"
            className="ml-auto mt-2 w-full rounded-lg bg-my-purple px-5 py-2.5 font-500 leading-[21px] text-my-white hover:bg-my-black hover:font-500 md:max-w-max"
          >
            Submit
          </button>
        </Form>
      )}
    </Formik>
  )
}

export default DynamicForm

const renderField = (field) => {
  const classes = cn(
    "box-border h-[42px] w-full rounded-lg border border-solid !border-gray-600 bg-gray-700 px-3 py-2.5 text-nav leading-inputlabel text-my-grey shadow-sm focus:outline-none",
    {
      "min-h-[222px]": field.type === "textarea",
    }
  )

  switch (field.type) {
    case "textarea":
      return (
        <Field
          as="textarea"
          id={field.name}
          name={field.name}
          type={field.type}
          placeholder={field.placeholder}
          rows={field.rows ?? 6}
          className={classes}
        />
      )
    case "email":
      return (
        <Field
          id={field.name}
          name={field.name}
          type={field.type}
          placeholder={field.placeholder}
          className={classes}
        />
      )
    case "select":
      return (
        <Field
          as="select"
          id={field.name}
          name={field.name}
          type={field.type}
          placeholder={field.placeholder}
          className={`${classes} min-h-[42px]`}
        >
          <option value="">{field?.placeholder}</option>
          {field.options?.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </Field>
      )

    case "tel":
    case "phone":
      return (
        <>
          <Field name={field.name}>
            {({ field: _field, form, meta }) => {
              return (
                <PhoneInput
                  country={"au"}
                  onChange={(_1, _2, e) => {
                    _field.onChange(e)
                  }}
                  value={_field.value || "61"}
                  specialLabel={""}
                  inputProps={{
                    id: field.name,
                    name: field.name,
                    placeholder: field?.placeholder,
                    required: field.required,
                    className: `form-control ${classes}`,
                  }}
                />
              )
            }}
          </Field>
        </>
      )

    default:
      return (
        <Field
          id={field.name}
          name={field.name}
          type={field.type}
          placeholder={field.placeholder}
          className={classes}
        />
      )
  }
}
