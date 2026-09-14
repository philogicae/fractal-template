import { describe, expect, it } from "vitest"
import { renderProbe, setupReactAct } from "../test/react"
import { FeatureCard } from "./FeatureCard"

setupReactAct()

describe("FeatureCard", () => {
  it("renders the icon, name, and optional description", () => {
    const probe = renderProbe(
      <FeatureCard icon="⚛" name="React 19" description="UI library" />
    )
    const text = probe.container.textContent
    expect(text).toContain("⚛")
    expect(text).toContain("React 19")
    expect(text).toContain("UI library")
    probe.unmount()
  })

  it("omits the description block when none is provided", () => {
    const probe = renderProbe(<FeatureCard icon="🌊" name="Tailwind 4" />)
    expect(probe.container.textContent).toBe("🌊Tailwind 4")
    probe.unmount()
  })

  it("merges custom classes onto the card", () => {
    const probe = renderProbe(
      <FeatureCard icon="x" name="y" className="custom-card" />
    )
    const card = probe.container.querySelector(".custom-card")
    expect(card).not.toBeNull()
    expect(card?.classList.contains("rounded-(--radius-cards)")).toBe(true)
    probe.unmount()
  })
})
