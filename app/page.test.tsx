import { siteConfig } from "@config/site"
import { getDictionary } from "@i18n/config"
import { describe, expect, it, vi } from "vitest"
import LandingPage from "./page"
import { renderProbe, setupReactAct } from "./test/react"

setupReactAct()

vi.mock("@i18n/server", async () => {
  const { getDictionary: getDict } = await import("@i18n/config")
  return {
    getCurrentDictionary: async () => ({ locale: "en", dict: getDict("en") }),
  }
})
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: React.ComponentProps<"a">): React.ReactElement => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))

const dict = getDictionary("en")

describe("app/page landing", () => {
  it("renders the localized hero copy", async () => {
    const probe = renderProbe(await LandingPage())
    const heading = probe.container.querySelector("h1")
    expect(heading?.textContent).toContain(dict.landing.headingPrefix)
    expect(heading?.textContent).toContain(dict.landing.headingAccent)
    expect(probe.container.textContent).toContain(dict.landing.subtitleLine1)
    expect(probe.container.textContent).toContain(dict.landing.subtitleLine2)
    probe.unmount()
  })

  it("renders all CTAs with the expected targets", async () => {
    const probe = renderProbe(await LandingPage())
    const githubHref = siteConfig.social.find((s) => s.label === "GitHub")?.href
    expect(
      probe.container.querySelector('a[href="/playground"]')
    ).not.toBeNull()
    expect(probe.container.querySelector('a[href="/skill.md"]')).not.toBeNull()
    expect(
      probe.container.querySelector(`a[href="${githubHref}"]`)
    ).not.toBeNull()
    const vercel = probe.container.querySelector(
      'a[href^="https://vercel.com/new/clone"]'
    )
    expect(vercel?.getAttribute("href")).toContain(
      encodeURIComponent(githubHref ?? "")
    )
    probe.unmount()
  })

  it("renders one feature card per stack entry with localized copy", async () => {
    const probe = renderProbe(await LandingPage())
    const cards = probe.container.querySelectorAll(".group")
    expect(cards.length).toBe(6)
    for (const [, description] of Object.entries(dict.landing.features)) {
      expect(probe.container.textContent).toContain(description)
    }
    probe.unmount()
  })

  it("staggers the entrance animation delays", async () => {
    const probe = renderProbe(await LandingPage())
    const delayed = probe.container.querySelectorAll(
      '[style*="animation-delay"]'
    )
    expect(delayed.length).toBe(4)
    probe.unmount()
  })
})
