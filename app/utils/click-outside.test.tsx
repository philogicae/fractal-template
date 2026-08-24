import { beforeEach, describe, expect, it, type Mock, vi } from "vitest"
import { renderProbe, setupReactAct } from "../test/react"
import { useClickOutside } from "./click-outside"

setupReactAct()

/** getElementById that throws instead of forcing non-null assertions. */
function el(id: string): HTMLElement {
  const node = document.getElementById(id)
  if (!node) throw new Error(`missing test element: #${id}`)
  return node
}

function fireMouse(target: Element): void {
  target.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }))
}

function fireEscape(): void {
  document.dispatchEvent(
    new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
  )
}

/** Mounts a panel (#panel) + trigger (#trigger) and an outside sentinel. */
function useMenu(
  onClose: () => void,
  ids: string | string[] = ["panel", "trigger"]
) {
  return renderProbe(
    <div>
      <div id="outside">outside</div>
      <button id="trigger" type="button">
        trigger
      </button>
      <div id="panel">panel</div>
      <Hooked onClose={onClose} ids={ids} />
    </div>
  )
}

function Hooked({
  onClose,
  ids,
}: {
  onClose: () => void
  ids: string | string[]
}): null {
  useClickOutside(true, ids, onClose)
  return null
}

describe("useClickOutside", () => {
  let onClose: Mock<() => void>

  beforeEach(() => {
    document.body.innerHTML = ""
    onClose = vi.fn((): void => {})
  })

  it("closes on pointer down outside all listed elements", () => {
    const probe = useMenu(onClose)
    fireMouse(el("outside"))
    expect(onClose).toHaveBeenCalledTimes(1)
    probe.unmount()
  })

  it("stays open when clicking inside the panel", () => {
    const probe = useMenu(onClose)
    fireMouse(el("panel"))
    expect(onClose).not.toHaveBeenCalled()
    probe.unmount()
  })

  it("tolerates clicks on the trigger (toggle stays consistent)", () => {
    const probe = useMenu(onClose)
    fireMouse(el("trigger"))
    expect(onClose).not.toHaveBeenCalled()
    probe.unmount()
  })

  it("accepts a single element id as well as a list", () => {
    const probe = useMenu(onClose, "panel")
    fireMouse(el("panel"))
    expect(onClose).not.toHaveBeenCalled()
    fireMouse(el("outside"))
    expect(onClose).toHaveBeenCalledTimes(1)
    probe.unmount()
  })

  it("an unlisted trigger behaves as outside (the old toggle bug)", () => {
    const probe = useMenu(onClose, ["panel"])
    fireMouse(el("trigger"))
    expect(onClose).toHaveBeenCalledTimes(1)
    probe.unmount()
  })

  it("closes on Escape", () => {
    const probe = useMenu(onClose)
    fireEscape()
    expect(onClose).toHaveBeenCalledTimes(1)
    probe.unmount()
  })

  it("ignores other keys", () => {
    const probe = useMenu(onClose)
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true })
    )
    expect(onClose).not.toHaveBeenCalled()
    probe.unmount()
  })

  it("detaches listeners on unmount", () => {
    const probe = useMenu(onClose)
    probe.unmount()
    // The probe container is gone; body itself is outside every id.
    fireMouse(document.body)
    fireEscape()
    expect(onClose).not.toHaveBeenCalled()
  })
})
