// utils.ts
export function optimizedResize(callback: () => void) {
  let running = false

  function resize() {
    if (!running) {
      running = true

      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(() => {
          callback()
          running = false
        })
      } else {
        setTimeout(() => {
          callback()
          running = false
        }, 66)
      }
    }
  }

  window.addEventListener("resize", resize)

  return {
    remove() {
      window.removeEventListener("resize", resize)
    },
  }
}

export function getAbsoluteBoundingRect(el: HTMLElement): DOMRect {
  const clientRect = el.getBoundingClientRect()
  const rect: Partial<DOMRect> = {
    left: window.pageXOffset + clientRect.left,
    top: window.pageYOffset + clientRect.top,
    right: Math.max(window.pageXOffset + clientRect.right, clientRect.right),
    bottom: Math.max(window.pageYOffset + clientRect.bottom, clientRect.bottom),
    width: clientRect.width,
    height: clientRect.height,
  }

  return rect as DOMRect
}

export function getAlignment(
  align: string,
  triggerBoundingRect: DOMRect,
  el: React.RefObject<HTMLDivElement>
): React.CSSProperties {
  if (!el.current) return {}

  const menuWidth = Math.max(el.current.offsetWidth, el.current.clientWidth)
  const menuHeight = Math.max(el.current.offsetHeight, el.current.clientHeight)
  const containerWidth = document.documentElement.clientWidth
  const containerHeight = window.innerHeight

  const style: React.CSSProperties = {
    position: "absolute",
    top: "100%",
  }

  switch (align) {
    case "center":
      style.left = "50%"
      style.transform = "translateX(-50%)"
      break
    case "right":
      style.right = 0
      break
    case "left":
      style.left = 0
      break
    default:
      return {}
  }

  // Adjust positions to fit within the viewport
  if ((style.left as number) > -1) {
    if (triggerBoundingRect.left + menuWidth > containerWidth) {
      delete style.left
      style.right = 0
    } else if (triggerBoundingRect.left - menuWidth < 0) {
      style.left = 0
    }
  } else if (style.right) {
    if (triggerBoundingRect.right - menuWidth < 0) {
      style.right = 0
    } else if (triggerBoundingRect.right + menuWidth > containerWidth) {
      style.left = 0
    }
  }

  return style
}
