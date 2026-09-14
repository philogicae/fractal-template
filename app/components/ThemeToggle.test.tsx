import { getDictionary } from "@i18n/config"
import { LocaleProvider } from "@i18n/LocaleProvider"
import { act } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { renderProbe, setupReactAct } from "../test/react"
import { ThemeToggle } from "./ThemeToggle"

setupReactAct()

/** Mutable `next-themes` state the component reads on every render. */
const themeState = {
  resolvedTheme: "dark" as string | undefined,
  setTheme: vi.fn(),
}

vi.mock("next-themes", () => ({
  useTheme: () => ({
    resolvedTheme: themeState.resolvedTheme,
    setTheme: themeState.setTheme,
  }),
}))
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
}))
vi.mock("@i18n/actions", () => ({ setLocaleAction: vi.fn(async () => {}) }))

function wrap(ui: React.ReactElement): React.ReactElement {
  return (
    <LocaleProvider locale="en" dict={getDictionary("en")}>
      {ui}
    </LocaleProvider>
  )
}

function getButton(container: HTMLElement): HTMLButtonElement {
  const button = container.querySelector("button")
  if (!button) throw new Error("missing theme toggle button")
  return button
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    themeState.resolvedTheme = "dark"
    themeState.setTheme.mockClear()
  })

  it("renders the pre-hydration placeholder on the server", () => {
    // Server render never runs effects, so `mounted` stays false.
    const html = renderToStaticMarkup(wrap(<ThemeToggle />))
    expect(html).toContain("Moon icon")
    expect(html).toContain(getDictionary("en").nav.themeToggle)
  })

  it("in dark mode shows the sun affordance and switches to light", () => {
    const probe = renderProbe(wrap(<ThemeToggle />))
    const button = getButton(probe.container)
    expect(button.getAttribute("aria-label")).toBe(
      getDictionary("en").nav.themeToLight
    )
    expect(probe.container.innerHTML).toContain("Sun icon")
    act(() => button.click())
    expect(themeState.setTheme).toHaveBeenCalledWith("light")
    probe.unmount()
  })

  it("in light mode shows the moon affordance and switches to dark", () => {
    themeState.resolvedTheme = "light"
    const probe = renderProbe(wrap(<ThemeToggle />))
    const button = getButton(probe.container)
    expect(button.getAttribute("aria-label")).toBe(
      getDictionary("en").nav.themeToDark
    )
    expect(probe.container.innerHTML).toContain("Moon icon")
    act(() => button.click())
    expect(themeState.setTheme).toHaveBeenCalledWith("dark")
    probe.unmount()
  })
})
