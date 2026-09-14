import { siteConfig } from "@config/site"
import { getDictionary } from "@i18n/config"
import { renderToStaticMarkup } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

vi.mock("next/font/google", () => ({
  Inter: () => ({ variable: "--font-sans", className: "inter" }),
  IBM_Plex_Mono: () => ({
    variable: "--font-mono",
    className: "ibm-plex-mono",
  }),
}))
vi.mock("@vercel/analytics/next", () => ({
  Analytics: () => <span data-testid="vercel-analytics" />,
}))
vi.mock("@vercel/speed-insights/next", () => ({
  SpeedInsights: () => <span data-testid="vercel-speed-insights" />,
}))
vi.mock("@i18n/server", async () => {
  const { getDictionary: getDict } = await import("@i18n/config")
  return {
    getCurrentDictionary: async () => ({ locale: "en", dict: getDict("en") }),
  }
})
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
}))
vi.mock("@i18n/actions", () => ({ setLocaleAction: vi.fn(async () => {}) }))
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

import RootLayout, { metadata, viewport } from "./layout"

const dict = getDictionary("en")

async function renderLayout(): Promise<string> {
  const ui = await RootLayout({ children: <p>page body</p> })
  return renderToStaticMarkup(ui)
}

afterEach(() => {
  delete process.env.CF_WEB_ANALYTICS_TOKEN
})

describe("root layout metadata", () => {
  it("derives identity from siteConfig", () => {
    expect(metadata.title).toBe(siteConfig.name)
    expect(metadata.description).toBe(siteConfig.description)
    expect(metadata.applicationName).toBe(siteConfig.name)
    expect(metadata.keywords).toEqual([...siteConfig.keywords])
    expect(metadata.metadataBase?.toString()).toBe(`${siteConfig.url}/`)
    expect(metadata.robots).toMatchObject({ index: true, follow: true })
    expect(metadata.openGraph).toMatchObject({
      title: siteConfig.name,
      description: siteConfig.description,
      url: siteConfig.url,
      images: [{ url: "/images/screenshot.jpeg", alt: siteConfig.name }],
    })
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      images: ["/images/screenshot.jpeg"],
    })
    expect(metadata.icons).toMatchObject({
      icon: "/favicon.ico",
      apple: "/images/apple-touch-icon.png",
    })
  })

  it("exposes theme colors and viewport settings from siteConfig", () => {
    expect(viewport.themeColor).toEqual([
      {
        media: "(prefers-color-scheme: light)",
        color: siteConfig.themeColor.light,
      },
      {
        media: "(prefers-color-scheme: dark)",
        color: siteConfig.themeColor.dark,
      },
    ])
    expect(viewport.colorScheme).toBe("dark light")
    expect(viewport.width).toBe("device-width")
    expect(viewport.initialScale).toBe(1)
  })
})

describe("RootLayout", () => {
  it("renders the locale-aware shell with nav, main, and footer", async () => {
    const html = await renderLayout()
    expect(html.startsWith('<html lang="en"')).toBe(true)
    expect(html).toContain("--font-sans")
    expect(html).toContain("--font-mono")
    expect(html).toContain('name="darkreader-lock"')
    expect(html).toContain("<main><p>page body</p></main>")
    expect(html).toContain(siteConfig.shortName)
    expect(html).toContain(dict.footer.credits)
    expect(html).toContain(`© ${new Date().getFullYear()} ${siteConfig.author}`)
    expect(html).not.toContain("beacon.min.js")
  })

  it("injects the Cloudflare beacon only when the token is set", async () => {
    process.env.CF_WEB_ANALYTICS_TOKEN = "test-token"
    const html = await renderLayout()
    expect(html).toContain("beacon.min.js")
    expect(html).toContain("test-token")
  })

  it("mounts Vercel analytics only on Vercel deployments", async () => {
    const plain = await renderLayout()
    expect(plain).not.toContain("vercel-analytics")

    vi.stubEnv("VERCEL", "1")
    vi.resetModules()
    const vercelLayout = await import("./layout")
    const html = renderToStaticMarkup(
      await vercelLayout.default({ children: <p>v</p> })
    )
    expect(html).toContain("vercel-analytics")
    expect(html).toContain("vercel-speed-insights")
    vi.unstubAllEnvs()
  })
})
