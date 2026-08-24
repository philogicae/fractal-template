"use client"

import { useEffect } from "react"

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
  useEffect(() => {
    if (!isOpen) return

    const ids = Array.isArray(elementIds) ? elementIds : [elementIds]

    const isInside = (target: Node): boolean =>
      ids.some((id) => document.getElementById(id)?.contains(target))

    const handlePointer = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node
      if (isInside(target)) return
      onClose()
    }

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }

    document.addEventListener("mousedown", handlePointer)
    document.addEventListener("touchstart", handlePointer)
    document.addEventListener("keydown", handleKey)

    return () => {
      document.removeEventListener("mousedown", handlePointer)
      document.removeEventListener("touchstart", handlePointer)
      document.removeEventListener("keydown", handleKey)
    }
  }, [isOpen, elementIds, onClose])
}
