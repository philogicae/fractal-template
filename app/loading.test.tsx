import { describe, expect, it } from "vitest"
import Loading from "./loading"
import { renderProbe, setupReactAct } from "./test/react"

setupReactAct()

describe("app/loading", () => {
  it("renders the skeleton placeholder layout", () => {
    const probe = renderProbe(<Loading />)
    const skeletons = probe.container.querySelectorAll(".animate-pulse")
    expect(skeletons.length).toBeGreaterThanOrEqual(10)
    // Mirrors the playground page structure: header + state card + 3 API cards.
    expect(probe.container.querySelectorAll(".grid > div").length).toBe(3)
    expect(probe.container.querySelector(".max-w-6xl")).not.toBeNull()
    probe.unmount()
  })
})
