import { describe, expect, it } from "vitest"
import { renderProbe, setupReactAct } from "../test/react"
import { Skeleton } from "./Skeleton"

setupReactAct()

describe("Skeleton", () => {
  it("renders a pulsing, themed block", () => {
    const probe = renderProbe(<Skeleton />)
    const root = probe.container.firstElementChild
    expect(root?.tagName).toBe("DIV")
    expect(root?.classList.contains("animate-pulse")).toBe(true)
    expect(root?.classList.contains("bg-(--color-bg-surface)")).toBe(true)
    probe.unmount()
  })

  it("merges custom classes (later utility wins)", () => {
    const probe = renderProbe(<Skeleton className="h-6 w-40 rounded-full" />)
    const root = probe.container.firstElementChild
    expect(root?.classList.contains("h-6")).toBe(true)
    expect(root?.classList.contains("w-40")).toBe(true)
    expect(root?.classList.contains("rounded-full")).toBe(true)
    expect(root?.classList.contains("rounded-lg")).toBe(false)
    probe.unmount()
  })

  it("forwards arbitrary div props", () => {
    const probe = renderProbe(
      <Skeleton data-testid="placeholder" aria-hidden="true" id="sk" />
    )
    const root = probe.container.querySelector("#sk")
    expect(root?.getAttribute("data-testid")).toBe("placeholder")
    expect(root?.getAttribute("aria-hidden")).toBe("true")
    probe.unmount()
  })
})
