import type { Locale } from "@i18n/config"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { setLocaleAction } from "./actions"
import { LOCALE_COOKIE } from "./server"

const cookieStore = {
  set: vi.fn(),
}

vi.mock("next/headers", () => ({ cookies: async () => cookieStore }))
vi.mock("server-only", () => ({}))

describe("setLocaleAction", () => {
  beforeEach(() => {
    cookieStore.set.mockClear()
  })

  it("persists a supported locale in the NEXT_LOCALE cookie", async () => {
    await setLocaleAction("ja")
    expect(cookieStore.set).toHaveBeenCalledTimes(1)
    const [name, value, options] = cookieStore.set.mock.calls[0] ?? []
    expect(name).toBe(LOCALE_COOKIE)
    expect(value).toBe("ja")
    expect(options).toMatchObject({
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    })
  })

  it("ignores an unsupported locale without touching cookies", async () => {
    await setLocaleAction("xx" as Locale)
    expect(cookieStore.set).not.toHaveBeenCalled()
  })
})
