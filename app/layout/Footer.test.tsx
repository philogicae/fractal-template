import { siteConfig } from "@config/site"
import { getDictionary } from "@i18n/config"
import { describe, expect, it, vi } from "vitest"
import { renderWithLocale } from "../test/render"
import { Footer } from "./Footer"

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
}))
vi.mock("@i18n/actions", () => ({ setLocaleAction: vi.fn(async () => {}) }))

describe("Footer", () => {
  it("shows the copyright with the provided year and site author", () => {
    const probe = renderWithLocale(<Footer year={2026} />)
    expect(probe.container.textContent).toContain(`© 2026 ${siteConfig.author}`)
    probe.unmount()
  })

  it("links the credits line to the site URL in a new tab", () => {
    const probe = renderWithLocale(<Footer year={2026} />)
    const credits = probe.container.querySelector(`a[href="${siteConfig.url}"]`)
    expect(credits).not.toBeNull()
    expect(credits?.getAttribute("target")).toBe("_blank")
    expect(credits?.getAttribute("rel")).toBe("noopener noreferrer")
    expect(credits?.textContent).toContain(getDictionary("en").footer.credits)
    probe.unmount()
  })

  it("renders accessible GitHub and X social links from siteConfig", () => {
    const probe = renderWithLocale(<Footer year={2026} />)
    for (const label of ["GitHub", "X"]) {
      const social = siteConfig.social.find((s) => s.label === label)
      if (!social) throw new Error(`missing social: ${label}`)
      const link = probe.container.querySelector(`a[href="${social.href}"]`)
      expect(link, `${label} link`).not.toBeNull()
      expect(link?.querySelector(".sr-only")?.textContent).toBe(label)
    }
    probe.unmount()
  })
})
