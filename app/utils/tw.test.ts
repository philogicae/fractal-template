import { describe, expect, it } from "vitest"
import { cn } from "./tw"

describe("cn", () => {
  it("joins conditional and falsy values", () => {
    expect(cn("a", false && "b", undefined, "c")).toBe("a c")
  })

  it("resolves tailwind conflicts with the last class winning", () => {
    expect(cn("px-4 py-2", "px-6")).toBe("py-2 px-6")
  })

  it("keeps unrelated classes", () => {
    expect(cn("text-sm", "bg-(--color-bg-primary)")).toBe(
      "text-sm bg-(--color-bg-primary)"
    )
  })

  it("returns an empty string for no input", () => {
    expect(cn()).toBe("")
  })
})
