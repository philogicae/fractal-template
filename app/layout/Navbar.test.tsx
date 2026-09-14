import { siteConfig } from "@config/site"
import { getDictionary } from "@i18n/config"
import { act } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { renderProbe, withLocale } from "../test/render"
import { NavBar } from "./Navbar"

const navState = { pathname: "/" }
const routerState = { refresh: vi.fn(), push: vi.fn() }

vi.mock("next/navigation", () => ({
  usePathname: () => navState.pathname,
  useRouter: () => routerState,
}))
vi.mock("@i18n/actions", () => ({ setLocaleAction: vi.fn(async () => {}) }))
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    onClick,
    ...rest
  }: React.ComponentProps<"a">): React.ReactElement => (
    <a
      href={href}
      onClick={(event) => {
        // jsdom would otherwise attempt a real document navigation.
        event.preventDefault()
        onClick?.(event)
      }}
      {...rest}
    >
      {children}
    </a>
  ),
}))

const dict = getDictionary("en")

function anchors(container: HTMLElement, href: string): HTMLAnchorElement[] {
  return [...container.querySelectorAll<HTMLAnchorElement>(`a[href="${href}"]`)]
}

function anchorWithText(
  container: HTMLElement,
  href: string,
  text: string
): HTMLAnchorElement {
  const anchor = anchors(container, href).find((a) => a.textContent === text)
  if (!anchor) throw new Error(`missing link ${href} labelled ${text}`)
  return anchor
}

function desktopNav(container: HTMLElement): HTMLElement {
  const nav = container.querySelector<HTMLElement>("header nav")
  if (!nav) throw new Error("missing desktop nav")
  return nav
}

function mobileTrigger(container: HTMLElement): HTMLButtonElement {
  const button = container.querySelector<HTMLButtonElement>(
    "#mobile-menu-trigger"
  )
  if (!button) throw new Error("missing mobile menu trigger")
  return button
}

function dropdown(container: HTMLElement): HTMLElement | null {
  return container.querySelector("#mobile-menu-dropdown")
}

describe("NavBar", () => {
  beforeEach(() => {
    navState.pathname = "/"
  })

  it("renders the logo, brand name, and every configured nav link", () => {
    const probe = renderProbe(withLocale(<NavBar />))
    const logo = probe.container.querySelector('img[src="/images/logo.gif"]')
    expect(logo).not.toBeNull()
    expect(probe.container.textContent).toContain(siteConfig.shortName)

    for (const link of siteConfig.nav) {
      const anchor = anchorWithText(
        desktopNav(probe.container),
        link.href,
        dict.nav[link.labelKey]
      )
      expect(anchor).toBeDefined()
    }
    probe.unmount()
  })

  it("marks the current route as active", () => {
    navState.pathname = "/playground"
    const probe = renderProbe(withLocale(<NavBar />))
    const active = anchorWithText(
      desktopNav(probe.container),
      "/playground",
      dict.nav.playground
    )
    const home = anchorWithText(desktopNav(probe.container), "/", dict.nav.home)
    expect(active.classList.contains("bg-(--color-bg-surface)")).toBe(true)
    expect(home.classList.contains("bg-(--color-bg-surface)")).toBe(false)
    probe.unmount()
  })

  it("mounts the language switcher and theme toggle", () => {
    const probe = renderProbe(withLocale(<NavBar />))
    expect(
      probe.container.querySelector("#lang-switcher-trigger")
    ).not.toBeNull()
    expect(probe.container.querySelector("button.theme-toggle")).not.toBeNull()
    probe.unmount()
  })

  it("opens and closes the mobile menu from the trigger", () => {
    const probe = renderProbe(withLocale(<NavBar />))
    expect(dropdown(probe.container)).toBeNull()

    act(() => mobileTrigger(probe.container).click())
    expect(dropdown(probe.container)).not.toBeNull()
    expect(mobileTrigger(probe.container).getAttribute("aria-expanded")).toBe(
      "true"
    )
    // Mobile list duplicates every nav entry.
    for (const link of siteConfig.nav) {
      expect(
        anchors(dropdown(probe.container) ?? probe.container, link.href).length
      ).toBeGreaterThan(0)
    }

    act(() => mobileTrigger(probe.container).click())
    expect(dropdown(probe.container)).toBeNull()
    probe.unmount()
  })

  it("closes the mobile menu after choosing a destination", () => {
    const probe = renderProbe(withLocale(<NavBar />))
    act(() => mobileTrigger(probe.container).click())
    const panel = dropdown(probe.container)
    if (!panel) throw new Error("mobile menu did not open")
    act(() => anchorWithText(panel, "/playground", dict.nav.playground).click())
    expect(dropdown(probe.container)).toBeNull()
    probe.unmount()
  })

  it("closes the mobile menu on Escape and on outside pointer-down", () => {
    const probe = renderProbe(withLocale(<NavBar />))
    act(() => mobileTrigger(probe.container).click())
    act(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
      )
    })
    expect(dropdown(probe.container)).toBeNull()

    act(() => mobileTrigger(probe.container).click())
    act(() => {
      document.body.dispatchEvent(
        new MouseEvent("mousedown", { bubbles: true })
      )
    })
    expect(dropdown(probe.container)).toBeNull()
    probe.unmount()
  })

  it("closes the mobile menu when the route changes", () => {
    const probe = renderProbe(withLocale(<NavBar />))
    act(() => mobileTrigger(probe.container).click())
    expect(dropdown(probe.container)).not.toBeNull()

    navState.pathname = "/playground"
    probe.render(withLocale(<NavBar />))
    expect(dropdown(probe.container)).toBeNull()
    probe.unmount()
  })
})
