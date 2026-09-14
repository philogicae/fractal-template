import { getDictionary, type Locale } from "@i18n/config"
import { act } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { renderProbe, setupReactAct } from "../test/react"
import { setLocaleAction } from "./actions"
import { LocaleProvider, useDict, useLocale } from "./LocaleProvider"

setupReactAct()

const routerState = {
  refresh: vi.fn(),
  push: vi.fn(),
}

vi.mock("next/navigation", () => ({ useRouter: () => routerState }))
vi.mock("./actions", () => ({ setLocaleAction: vi.fn(async () => {}) }))

interface ContextSnapshot {
  locale: string
  dict: unknown
  isPending: boolean
  setLocale: (locale: Locale) => void
}

/**
 * Mount a probe that mirrors the latest context value into `box.current` so
 * assertions always read the value from the most recent render.
 */
function mountProbe(locale: Locale = "en"): {
  box: { current: ContextSnapshot | null }
  unmount: () => void
} {
  const box: { current: ContextSnapshot | null } = { current: null }
  function Probe(): null {
    const ctx = useLocale()
    box.current = { ...ctx, dict: useDict() }
    return null
  }
  const probe = renderProbe(
    <LocaleProvider locale={locale} dict={getDictionary(locale)}>
      <Probe />
    </LocaleProvider>
  )
  if (!box.current) throw new Error("probe never rendered")
  return { box, unmount: probe.unmount }
}

describe("LocaleProvider", () => {
  beforeEach(() => {
    routerState.refresh.mockClear()
    vi.mocked(setLocaleAction).mockClear()
    vi.mocked(setLocaleAction).mockImplementation(async () => {})
  })

  it("exposes the active locale and its dictionary through context", () => {
    const { box, unmount } = mountProbe("fr")
    expect(box.current?.locale).toBe("fr")
    expect(box.current?.dict).toBe(getDictionary("fr"))
    expect(box.current?.isPending).toBe(false)
    unmount()
  })

  it("persists a new locale then refreshes server components", async () => {
    const { box, unmount } = mountProbe("en")
    await act(async () => {
      box.current?.setLocale("de")
    })
    expect(setLocaleAction).toHaveBeenCalledWith("de")
    expect(routerState.refresh).toHaveBeenCalledTimes(1)
    unmount()
  })

  it("does not call the action when the locale is unchanged", async () => {
    const { box, unmount } = mountProbe("en")
    await act(async () => {
      box.current?.setLocale("en")
    })
    expect(setLocaleAction).not.toHaveBeenCalled()
    expect(routerState.refresh).not.toHaveBeenCalled()
    unmount()
  })

  it("throws when useLocale is used outside the provider", () => {
    function Bare(): null {
      useLocale()
      return null
    }
    expect(() => renderProbe(<Bare />)).toThrow(
      "useLocale must be used within <LocaleProvider>"
    )
    // renderProbe cannot clean up a failed mount; drop the container.
    document.body.innerHTML = ""
  })
})
