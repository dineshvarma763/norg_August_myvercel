import React, { ReactElement } from "react"

import { cn } from "@/ui-base/lib/util/utils"
import styles from "./dropdown.module.css"

export interface DropDownOptionRendererProps {
  className?: string
  focused?: boolean
  disabled?: boolean
  label: string | ReactElement
  styles: typeof styles
  [key: string]: any
}

export const DropDownOptionRenderer = ({
  focused,
  disabled,
  className,
  label,
  styles,
}: DropDownOptionRendererProps) => {
  const classes = cn(
    styles.option,
    focused && styles.focused,
    disabled && styles.disabled,
    className
  )

  return <div className={classes}>{label}</div>
}

export interface DropDownOptionProps {
  value?: any
  focused?: boolean
  optionRef: React.RefCallback<HTMLDivElement | null>
  onClick: () => void
  data: any
  className?: string
  renderer?: (props: DropDownOptionRendererProps) => ReactElement
}

const DropDownOption = ({
  renderer = DropDownOptionRenderer,
  data = {},
  ...props
}: DropDownOptionProps) => {
  const Renderer = renderer || DropDownOptionRenderer

  return (
    <div
      aria-selected={props.focused}
      role="option"
      tabIndex={-1}
      ref={props.optionRef}
      onClick={data.disabled ? undefined : props.onClick}
    >
      <Renderer
        {...data}
        styles={styles}
        className={props.className}
        focused={props.focused}
      />
    </div>
  )
}

export default DropDownOption
