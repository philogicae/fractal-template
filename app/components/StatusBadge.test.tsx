import { describe, expect, it } from "vitest"
import { renderProbe, setupReactAct } from "../test/react"
import { StatusBadge } from "./StatusBadge"

setupReactAct()

describe("StatusBadge", () => {
  it.each([
    ["idle", "Idle"],
    ["loading", "Loading"],
    ["success", "OK"],
    ["error", "Error"],
  ] as const)("renders the default %s label", (status, label) => {
    const probe = renderProbe(<StatusBadge status={status} />)
    expect(probe.container.textContent).toBe(label)
    probe.unmount()
  })

  it.each([
    ["idle", "bg-(--color-text-muted)"],
    ["loading", "bg-(--color-accent-primary)"],
    ["success", "bg-(--color-emerald)"],
    ["error", "bg-(--color-rose)"],
  ] as const)("colors the dot for status=%s", (status, dotClass) => {
    const probe = renderProbe(<StatusBadge status={status} />)
    const dot = probe.container.querySelector("span > span")
    expect(dot?.classList.contains(dotClass)).toBe(true)
    probe.unmount()
  })

  it("prefers a custom label (localized copy)", () => {
    const probe = renderProbe(<StatusBadge status="success" label="Enviado" />)
    expect(probe.container.textContent).toBe("Enviado")
    probe.unmount()
  })

  it("merges custom classes", () => {
    const probe = renderProbe(
      <StatusBadge status="idle" className="custom-badge" />
    )
    expect(probe.container.querySelector(".custom-badge")).not.toBeNull()
    probe.unmount()
  })
})
