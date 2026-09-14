import { describe, expect, it } from "vitest"
import { renderProbe, setupReactAct } from "../test/react"
import { Container } from "./Container"

setupReactAct()

describe("Container", () => {
  it("renders children in a div with the default xl max width", () => {
    const probe = renderProbe(<Container>content</Container>)
    const root = probe.container.firstElementChild
    expect(root?.tagName).toBe("DIV")
    expect(root?.textContent).toBe("content")
    expect(root?.classList.contains("max-w-6xl")).toBe(true)
    expect(root?.classList.contains("mx-auto")).toBe(true)
    probe.unmount()
  })

  it.each([
    ["sm", "max-w-2xl"],
    ["md", "max-w-3xl"],
    ["lg", "max-w-5xl"],
    ["xl", "max-w-6xl"],
    ["full", "max-w-full"],
  ] as const)("maps size=%s to %s", (size, className) => {
    const probe = renderProbe(<Container size={size}>x</Container>)
    expect(
      probe.container.firstElementChild?.classList.contains(className)
    ).toBe(true)
    probe.unmount()
  })

  it.each(["section", "main", "article"] as const)(
    "renders the semantic %s tag via `as`",
    (tag) => {
      const probe = renderProbe(<Container as={tag}>semantic</Container>)
      expect(probe.container.firstElementChild?.tagName).toBe(tag.toUpperCase())
      probe.unmount()
    }
  )

  it("merges custom classes and lets them override size utilities", () => {
    const probe = renderProbe(
      <Container size="sm" className="max-w-7xl custom">
        x
      </Container>
    )
    const root = probe.container.firstElementChild
    expect(root?.classList.contains("custom")).toBe(true)
    // tailwind-merge: the later class wins, only one max-w utility remains.
    expect(root?.classList.contains("max-w-7xl")).toBe(true)
    expect(root?.classList.contains("max-w-2xl")).toBe(false)
    probe.unmount()
  })
})
