"use client"

import { useEffect, useEffectEvent } from "react"

/**
 * Dismissal behavior for floating menus (dropdowns, popovers):
 *
 * - Closes when the user presses `Escape`.
 * - Closes on pointer down outside **all** listed elements. Pass every
 *   element that must not dismiss the menu: its panel *and* its trigger,
 *   otherwise the mousedown closes it and the subsequent click on the
 *   trigger immediately re-opens it (the menu could never be toggled shut).
 *
 * @param isOpen - Whether the menu is currently open
 * @param elementIds - IDs of the panel and trigger elements to tolerate
 * @param onClose - Callback invoked to close the menu
 */
export function useClickOutside(
  isOpen: boolean,
  elementIds: string | string[],
  onClose: () => void
): void {
  // Effect events keep the listeners subscribed once per open/closed
  // transition instead of on every render caused by an inline callback/array.
  const isOutside = useEffectEvent((target: Node): boolean => {
    const ids = typeof elementIds === "string" ? [elementIds] : elementIds
    return !ids.some((id) => document.getElementById(id)?.contains(target))
  })

  const close = useEffectEvent(onClose)

  useEffect(() => {
    if (!isOpen) return

    const handlePointer = (event: MouseEvent | TouchEvent): void => {
      if (event.target instanceof Node && isOutside(event.target)) close()
    }

    const handleKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape") close()
    }

    document.addEventListener("mousedown", handlePointer)
    document.addEventListener("touchstart", handlePointer)
    document.addEventListener("keydown", handleKey)

    return () => {
      document.removeEventListener("mousedown", handlePointer)
      document.removeEventListener("touchstart", handlePointer)
      document.removeEventListener("keydown", handleKey)
    }
  }, [isOpen])
}
