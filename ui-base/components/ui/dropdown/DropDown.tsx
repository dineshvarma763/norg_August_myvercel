import React, { useEffect, useMemo, useRef, useState } from "react"

import { DropDownOptionRendererProps } from "./DropDownOption"
import DropDownPortal, { IOptions } from "./DropDownPortal"
import DropDownTrigger, {
  TriggerProps,
  TriggerRendererProps,
} from "./DropDownTrigger"
import styles from "./dropdown.module.css"
import { Placement } from "./type"
import { getAbsoluteBoundingRect, optimizedResize } from "./utils"

export interface DropdownProps {
  open?: boolean
  autoFocus?: boolean
  onOpen?: () => void
  closeOnEscape?: boolean
  closeOnClickOutside?: boolean
  triggerComponent?: (props: TriggerProps) => React.ReactElement
  triggerRenderer?: (props: TriggerRendererProps) => React.ReactElement
  triggerLabel?: string | React.ReactElement
  closeOnOptionClick?: boolean
  disabled?: boolean
  align?: Placement
  options?: IOptions[]
  group?: { id: string; title?: string; options: IOptions[] }[]
  id?: string
  className?: string
  onClick?: (val: any) => void
  onTriggerClick?: () => void
  onTriggerKeyDown?: () => void
  optionRenderer?: (props: DropDownOptionRendererProps) => React.ReactElement
}

const Dropdown = ({
  autoFocus = false,
  triggerLabel = "Open menu",
  closeOnEscape = true,
  closeOnClickOutside = true,
  closeOnOptionClick = false,
  disabled = false,
  align = "left",
  triggerComponent,
  triggerRenderer,
  options,
  group,
  open: openProp,
  onOpen,
  onClick,
  ...props
}: DropdownProps) => {
  const [open, setOpen] = useState<boolean>(Boolean(openProp))
  const [triggerBoundingRect, setTriggerBoundingRect] =
    useState<DOMRect | null>(null)

  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTriggerRect()

    if (autoFocus) {
      focusTrigger()
    }

    const resizeHandler = optimizedResize(() => {
      setTriggerRect()
    })

    return () => {
      resizeHandler.remove()
    }
  }, [])

  useEffect(() => {
    if (open && !openProp) {
      onOpen?.()
    }

    if (open) {
      closeOnEscape && document.addEventListener("keyup", handleEscape)
      closeOnClickOutside &&
        document.addEventListener("click", handleClickOutside)
    } else {
      closeOnEscape && document.removeEventListener("keyup", handleEscape)
      closeOnClickOutside &&
        document.removeEventListener("click", handleClickOutside)
    }

    return () => {
      document.removeEventListener("keyup", handleEscape)
      document.removeEventListener("click", handleClickOutside)
    }
  }, [open])

  const setTriggerRect = () => {
    if (!triggerRef.current) {
      return
    }

    setTriggerBoundingRect(getAbsoluteBoundingRect(triggerRef.current))
  }

  const focusTrigger = () => {
    if (triggerComponent) {
      triggerRef.current?.focus()
    } else {
      const firstChildElement = triggerRef.current
        ?.firstElementChild as HTMLElement | null
      if (firstChildElement) {
        firstChildElement.focus()
      }
    }
  }

  const closeMenu = (focus?: boolean) => {
    setOpen(false)

    if (focus) {
      focusTrigger()
    }
  }

  const openMenu = () => {
    setOpen(true)
  }

  const handleClickOutside = (e: MouseEvent) => {
    if (!menuRef.current || !triggerRef.current) {
      return
    }

    if (
      !menuRef.current.contains(e.target as Node) &&
      !triggerRef.current.contains(e.target as Node)
    ) {
      closeMenu()
    }
  }

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      closeMenu(true)
    }
  }

  const handleTriggerClick = () => {
    setTriggerRect()

    props?.onTriggerClick?.()

    setOpen((prevOpen) => !prevOpen)
  }

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    props?.onTriggerKeyDown?.()

    if (e.key === "ArrowDown") {
      openMenu()

      e.preventDefault()
    }
  }

  const handleOptionClick = (val: any) => {
    onClick?.(val)

    if (closeOnOptionClick) {
      closeMenu(true)
    }
  }

  const TriggerElement = triggerComponent || DropDownTrigger
  const classes = styles["rdm"] + (props.className ? ` ${props.className}` : "")

  return (
    <div className={classes} id={props.id}>
      <TriggerElement
        disabled={disabled}
        label={triggerLabel}
        renderer={triggerRenderer}
        triggerRef={triggerRef}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
      />

      {triggerBoundingRect && (
        <div
          style={{
            visibility: open ? "visible" : "hidden",
          }}
        >
          <DropDownPortal
            align={align}
            options={options}
            group={group}
            menuRef={menuRef}
            triggerBoundingRect={triggerBoundingRect}
            onClick={handleOptionClick}
            optionRenderer={props.optionRenderer}
            {...props}
          />
        </div>
      )}
    </div>
  )
}

export default Dropdown
