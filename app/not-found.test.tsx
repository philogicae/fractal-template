import { getDictionary } from "@i18n/config"
import { describe, expect, it, vi } from "vitest"
import NotFound from "./not-found"
import { renderProbe, setupReactAct } from "./test/react"

setupReactAct()

vi.mock("@i18n/server", async () => {
  const { getDictionary: getDict } = await import("@i18n/config")
  return {
    getCurrentDictionary: async () => ({ locale: "en", dict: getDict("en") }),
  }
})

const dict = getDictionary("en")

describe("app/not-found", () => {
  it("renders the 404 copy for the active locale with a home link", async () => {
    const ui = await NotFound()
    const probe = renderProbe(ui)
    expect(probe.container.textContent).toContain(dict.notFound.title)
    expect(probe.container.textContent).toContain(dict.notFound.message)
    const home = probe.container.querySelector('a[href="/"]')
    expect(home?.textContent).toBe(dict.notFound.home)
    probe.unmount()
  })
})
