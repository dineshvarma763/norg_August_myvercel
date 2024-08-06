import React, { useEffect, useState } from "react"
import { createPortal } from "react-dom"

import { cn } from "@/ui-base/lib/util/utils"
import DropDownOption, {
  DropDownOptionProps,
  DropDownOptionRendererProps,
} from "./DropDownOption"
import styles from "./dropdown.module.css"
import { Placement } from "./type"
import { getAlignment } from "./utils"

export interface IOptions {
  className?: string
  label: string
  value: string
  disabled?: boolean
  [key: string]: any
}

interface MenuRendererProps {
  children: React.ReactElement | React.ReactNode
}

function MenuRenderer(props: MenuRendererProps) {
  return <>{props.children}</>
}

interface MenuSectionRendererProps {
  title?: string
  className?: string
  children: React.ReactNode
}

function MenuGroupRenderer(props: MenuSectionRendererProps) {
  const className = cn(styles["menu-group"], props.className)

  return (
    <div className={className}>
      <div className={styles["menu-group__title"]}>{props?.title}</div>
      <div className={styles["menu-group__body"]}>{props.children}</div>
    </div>
  )
}

interface DropDownMenuProps {
  menuRef?: React.RefObject<HTMLDivElement>
  renderer?: React.ComponentType<MenuRendererProps>
  style: React.CSSProperties
  onKeyDown: React.KeyboardEventHandler<HTMLDivElement>
  children: React.ReactElement | React.ReactNode
}

function DropDownMenu(props: DropDownMenuProps) {
  const Renderer = props.renderer || MenuRenderer

  return (
    <div
      className={styles.menu}
      role="listbox"
      tabIndex={-1}
      style={props.style}
      onKeyDown={props.onKeyDown}
      ref={props.menuRef}
    >
      <Renderer>{props.children}</Renderer>
    </div>
  )
}

interface DropDownPortalProps {
  visible?: boolean
  focusedIndex?: number
  menuComponent?: React.ComponentType<DropDownMenuProps>
  menuRenderer?: React.ComponentType<MenuRendererProps>
  portalClassName?: string
  menuPortalTarget?: string
  triggerBoundingRect: DOMRect
  align?: Placement
  options?: IOptions[]
  group?: { id: string; title?: string; options: IOptions[] }[]
  optionComponent?: React.ComponentType<DropDownOptionProps>
  menuSectionRenderer?: React.ComponentType<MenuSectionRendererProps>
  optionRenderer?: (props: DropDownOptionRendererProps) => React.ReactElement
  onClick: (option: IOptions) => void
  menuRef?: React.RefObject<HTMLDivElement>
  autoFocusMenu?: boolean
  onMenuKeyDown?: React.KeyboardEventHandler<HTMLDivElement>
}

export default function DropDownPortal({
  menuComponent: MenuElement = DropDownMenu,
  optionComponent = DropDownOption,
  menuSectionRenderer = MenuGroupRenderer,
  menuPortalTarget = "body",
  focusedIndex = -1,
  ...props
}: DropDownPortalProps) {
  const [focused, setFocused] = useState<number>(focusedIndex)
  const optionRefs = {} as { [key: string]: HTMLElement | null }

  useEffect(() => {
    if (props.autoFocusMenu) {
      props?.menuRef?.current?.focus()
    }
  }, [])

  useEffect(() => {
    const options = getOptions()

    let key: string | undefined

    const selected = options[focused]

    key = selected && selected.value

    if (key) {
      optionRefs[key as string]?.focus()
    }
  }, [focused])

  function getOptions(): IOptions[] {
    const { options, group } = props

    if (group?.length) {
      return group.reduce((res, sec) => res.concat(sec.options as []), [])
    }

    return options || []
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    typeof props.onMenuKeyDown === "function" && props.onMenuKeyDown(e)

    const options = getOptions()
    const maxFocus = options.length - 1
    const focusedOption = options[focused]

    // !focusedOption.disabled
    if (e.key === "Enter" && focusedOption) {
      props.onClick(focusedOption)
    } else if (e.key === "ArrowDown") {
      setFocused((prevFocused) =>
        prevFocused < maxFocus ? prevFocused + 1 : maxFocus
      )
    } else if (e.key === "ArrowUp") {
      setFocused((prevFocused) => (prevFocused > 0 ? prevFocused - 1 : 0))
    }

    e.preventDefault()
  }

  const OptionElement = optionComponent
  const SectionRenderer = menuSectionRenderer

  function getOptionElements(): React.ReactNode {
    const options = getOptions()

    if (props?.group?.length) {
      return props.group.map((sec) => (
        <SectionRenderer {...sec} key={sec.id}>
          {sec.options.map((option, index) => (
            <OptionElement
              className={option.className}
              data={option}
              focused={focused === index}
              key={option.value}
              optionRef={(nodeEl: HTMLElement | null) => void
											 (optionRefs[option.value] = nodeEl)
              }
              renderer={props?.optionRenderer}
              onClick={() => {
                setFocused
                props.onClick(option)
              }}
            />
          ))}
        </SectionRenderer>
      ))
    }

    return options.map((option, index) => (
      <OptionElement
        className={option.className}
        data={option}
        focused={focused === index}
        key={option.value}
        optionRef={(nodeEl: HTMLElement | null) => void
          (optionRefs[option.value] = nodeEl)
        }
        renderer={props?.optionRenderer}
        onClick={() => {
          setFocused(index)
          props.onClick(option)
        }}
      />
    ))
  }

  return (
    <MenuElement
      menuRef={props.menuRef}
      renderer={props.menuRenderer}
      style={getAlignment(
        props.align,
        props.triggerBoundingRect,
        props.menuRef
      )}
      onKeyDown={handleKeyDown}
    >
      {getOptionElements()}
    </MenuElement>
  )
}
