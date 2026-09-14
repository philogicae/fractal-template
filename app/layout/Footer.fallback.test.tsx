import { describe, expect, it, vi } from "vitest"
import { renderWithLocale } from "../test/render"
import { Footer } from "./Footer"

/**
 * Variant of the footer with no social entries configured, which
 * exercises the `?? "#"` / `?? label` fallbacks.
 */
vi.mock("@config/site", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@config/site")>()
  return { siteConfig: { ...actual.siteConfig, social: [] } }
})
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
}))
vi.mock("@i18n/actions", () => ({ setLocaleAction: vi.fn(async () => {}) }))

describe("Footer without configured socials", () => {
  it("falls back to `#` links with default accessible labels", () => {
    const probe = renderWithLocale(<Footer year={2026} />)
    const fallbackLinks = probe.container.querySelectorAll('a[href="#"]')
    expect(fallbackLinks.length).toBe(2)
    const labels = [...probe.container.querySelectorAll(".sr-only")].map(
      (node) => node.textContent
    )
    expect(labels).toEqual(["GitHub", "X"])
    probe.unmount()
  })
})
