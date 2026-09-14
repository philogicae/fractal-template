import { getDictionary, localeMeta, locales } from "@i18n/config"
import { act } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { renderProbe, setupReactAct } from "../test/react"
import { LanguageSwitcher } from "./LanguageSwitcher"

setupReactAct()

/** Mutable context the mocked `useLocale()` serves. */
const localeState = {
  locale: "en" as keyof typeof localeMeta,
  setLocale: vi.fn(),
  isPending: false,
}

vi.mock("@i18n/LocaleProvider", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@i18n/LocaleProvider")>()
  const { getDictionary: getDict } = await import("@i18n/config")
  return {
    ...actual,
    useLocale: () => ({
      locale: localeState.locale,
      dict: getDict(localeState.locale),
      setLocale: localeState.setLocale,
      isPending: localeState.isPending,
    }),
  }
})

function trigger(container: HTMLElement): HTMLButtonElement {
  const button = container.querySelector<HTMLButtonElement>(
    "#lang-switcher-trigger"
  )
  if (!button) throw new Error("missing language switcher trigger")
  return button
}

function open(container: HTMLElement): void {
  act(() => trigger(container).click())
}

function dropdown(container: HTMLElement): HTMLElement | null {
  return container.querySelector("#lang-dropdown")
}

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    localeState.locale = "en"
    localeState.isPending = false
    localeState.setLocale.mockClear()
  })

  it("labels the trigger with the dictionary key and active locale", () => {
    const probe = renderProbe(<LanguageSwitcher />)
    const button = trigger(probe.container)
    const dict = getDictionary("en")
    expect(button.getAttribute("aria-label")).toBe(
      `${dict.nav.language}: ${localeMeta.en.native}`
    )
    expect(button.getAttribute("aria-expanded")).toBe("false")
    expect(button.textContent).toBe(localeMeta.en.flag)
    probe.unmount()
  })

  it("opens a dropdown listing every registered locale", () => {
    const probe = renderProbe(<LanguageSwitcher />)
    open(probe.container)
    expect(trigger(probe.container).getAttribute("aria-expanded")).toBe("true")
    const panel = dropdown(probe.container)
    expect(panel).not.toBeNull()
    expect(panel?.querySelectorAll("li")).toHaveLength(locales.length)
    for (const loc of locales) {
      expect(panel?.textContent).toContain(localeMeta[loc].native)
    }
    // Only the active locale gets the checkmark.
    expect((panel?.textContent?.match(/✓/g) ?? []).length).toBe(1)
    probe.unmount()
  })

  it("marks the active locale row and closes after selecting another", () => {
    localeState.locale = "fr"
    const probe = renderProbe(<LanguageSwitcher />)
    open(probe.container)
    const panel = dropdown(probe.container)
    const buttons = panel?.querySelectorAll("button") ?? []
    const frRow = [...buttons].find(
      (b) => b.textContent === `${localeMeta.fr.flag}${localeMeta.fr.native}✓`
    )
    expect(frRow).toBeDefined()
    const deRow = [...buttons].find((b) =>
      b.textContent?.includes(localeMeta.de.native)
    )
    if (!deRow) throw new Error("missing de row")
    act(() => deRow.click())
    expect(localeState.setLocale).toHaveBeenCalledWith("de")
    expect(dropdown(probe.container)).toBeNull()
    probe.unmount()
  })

  it("toggles the dropdown closed when the trigger is pressed again", () => {
    const probe = renderProbe(<LanguageSwitcher />)
    open(probe.container)
    expect(dropdown(probe.container)).not.toBeNull()
    open(probe.container)
    expect(dropdown(probe.container)).toBeNull()
    probe.unmount()
  })

  it("closes on Escape and on pointer-down outside", () => {
    const probe = renderProbe(<LanguageSwitcher />)
    open(probe.container)
    act(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
      )
    })
    expect(dropdown(probe.container)).toBeNull()

    open(probe.container)
    act(() => {
      document.body.dispatchEvent(
        new MouseEvent("mousedown", { bubbles: true })
      )
    })
    expect(dropdown(probe.container)).toBeNull()
    probe.unmount()
  })

  it("disables the trigger while a locale change is pending", () => {
    localeState.isPending = true
    const probe = renderProbe(<LanguageSwitcher />)
    expect(trigger(probe.container).disabled).toBe(true)
    open(probe.container)
    expect(dropdown(probe.container)).toBeNull()
    probe.unmount()
  })
})
