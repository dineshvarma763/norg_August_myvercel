import React, { FunctionComponent, Ref } from "react"

import styles from "./dropdown.module.css"

export interface TriggerRendererProps {
  disabled?: boolean
  label?: string | React.ReactElement
}

export const TriggerRenderer = ({ disabled, label }: TriggerRendererProps) => {
  return (
    <button className={styles["trigger-renderer"]} disabled={disabled}>
      {label}
    </button>
  )
}

export interface TriggerProps {
  renderer?: FunctionComponent<TriggerRendererProps>
  triggerRef: Ref<HTMLDivElement>
  onClick?: React.MouseEventHandler<HTMLElement>
  onKeyDown?: React.KeyboardEventHandler<HTMLElement>
  disabled?: boolean
  label?: string | React.ReactElement
}

const DropDownTrigger = ({
  renderer: Renderer = TriggerRenderer,
  triggerRef,
  onClick,
  onKeyDown,
  disabled,
  label,
}: TriggerProps) => {
  return (
    <div
      className={styles.trigger}
      ref={triggerRef}
      role="button"
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      <Renderer disabled={disabled} label={label} />
    </div>
  )
}

export default DropDownTrigger
