import { beforeEach, describe, expect, it, vi } from "vitest"
import { getCurrentLocale } from "./server"

/**
 * `server.ts` imports `server-only` (throws outside RSC) and reads
 * request-scoped state from `next/headers`. Both are mocked here; the
 * cookie/header sources are driven through the mutable `storage` object.
 */
const storage = {
  cookie: undefined as string | undefined,
  acceptLanguage: undefined as string | undefined,
}

vi.mock("server-only", () => ({}))
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) =>
      storage.cookie === undefined
        ? undefined
        : { name, value: storage.cookie },
  }),
  headers: async () => ({
    get: (name: string) =>
      name === "accept-language" ? (storage.acceptLanguage ?? null) : null,
  }),
}))

describe("getCurrentLocale resolution priority", () => {
  beforeEach(() => {
    storage.cookie = undefined
    storage.acceptLanguage = undefined
  })

  it("prefers the NEXT_LOCALE cookie over the Accept-Language header", async () => {
    storage.cookie = "fr"
    storage.acceptLanguage = "de-DE,fr;q=0.9"
    await expect(getCurrentLocale()).resolves.toBe("fr")
  })

  it("falls through an invalid cookie to the header", async () => {
    storage.cookie = "xx"
    storage.acceptLanguage = "ja"
    await expect(getCurrentLocale()).resolves.toBe("ja")
  })

  it("resolves from the Accept-Language header when no cookie is set", async () => {
    storage.acceptLanguage = "de-DE,fr;q=0.9"
    await expect(getCurrentLocale()).resolves.toBe("de")
  })

  it("defaults to English with no signals", async () => {
    await expect(getCurrentLocale()).resolves.toBe("en")
  })
})
