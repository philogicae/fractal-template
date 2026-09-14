import { siteConfig } from "@config/site"
import { getDictionary } from "@i18n/config"
import { describe, expect, it, vi } from "vitest"
import LandingPage from "./page"
import { renderProbe, setupReactAct } from "./test/react"

setupReactAct()

/**
 * Variant of the landing page with no GitHub entry in `siteConfig.social`,
 * which exercises the `?? siteConfig.url` fallback for the GitHub CTA.
 */
vi.mock("@config/site", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@config/site")>()
  return { siteConfig: { ...actual.siteConfig, social: [] } }
})
vi.mock("@i18n/server", async () => {
  const { getDictionary: getDict } = await import("@i18n/config")
  return {
    getCurrentDictionary: async () => ({ locale: "en", dict: getDict("en") }),
  }
})

describe("app/page without a GitHub social entry", () => {
  it("falls back to the site URL for both GitHub-derived CTAs", async () => {
    const probe = renderProbe(await LandingPage())
    const githubCta = [...probe.container.querySelectorAll("a")].find((a) =>
      a.textContent?.includes(getDictionary("en").landing.ctaGithub)
    )
    expect(githubCta?.getAttribute("href")).toBe(siteConfig.url)
    const vercel = probe.container.querySelector(
      'a[href^="https://vercel.com/new/clone"]'
    )
    expect(vercel?.getAttribute("href")).toContain(
      encodeURIComponent(siteConfig.url)
    )
    probe.unmount()
  })
})
