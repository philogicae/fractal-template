import { getDictionary } from "@i18n/config"
import { useDict, useLocale } from "@i18n/LocaleProvider"
import { afterEach, describe, expect, it, vi } from "vitest"
import { Providers } from "./providers"
import { renderProbe, setupReactAct } from "./test/react"

setupReactAct()

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
}))
vi.mock("@i18n/actions", () => ({ setLocaleAction: vi.fn(async () => {}) }))

/** next-themes reads `matchMedia`; jsdom does not implement it. */
function stubMatchMedia(): void {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }))
}

function Probe(): React.ReactElement {
  const { locale } = useLocale()
  return <output>{`${locale}:${useDict().nav.home}`}</output>
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("Providers", () => {
  it("wires the locale context and the dark theme class", () => {
    stubMatchMedia()
    const dict = getDictionary("en")
    const probe = renderProbe(
      <Providers locale="en" dict={dict}>
        <Probe />
      </Providers>
    )
    expect(probe.container.querySelector("output")?.textContent).toBe("en:Home")
    expect(document.documentElement.classList.contains("dark")).toBe(true)
    probe.unmount()
  })
})
