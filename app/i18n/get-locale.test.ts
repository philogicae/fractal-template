import { describe, expect, it } from "vitest"
import { getLocaleFromAcceptLanguage } from "./get-locale"

describe("getLocaleFromAcceptLanguage", () => {
  it("returns the default locale for a missing header", () => {
    expect(getLocaleFromAcceptLanguage(null)).toBe("en")
    expect(getLocaleFromAcceptLanguage("")).toBe("en")
  })

  it("matches an exact supported tag", () => {
    expect(getLocaleFromAcceptLanguage("fr")).toBe("fr")
    expect(getLocaleFromAcceptLanguage("ja")).toBe("ja")
  })

  it("strips region tags down to a supported base", () => {
    expect(getLocaleFromAcceptLanguage("pt-BR")).toBe("pt")
    expect(getLocaleFromAcceptLanguage("en-US,en;q=0.5")).toBe("en")
  })

  it("is case-insensitive", () => {
    expect(getLocaleFromAcceptLanguage("FR-fr")).toBe("fr")
  })

  it("respects q-weight ordering", () => {
    expect(getLocaleFromAcceptLanguage("es;q=0.2, de;q=0.9")).toBe("de")
  })

  it("treats a missing or invalid q as 1", () => {
    // Both get weight 1; the stable sort keeps header order, so `ko` wins.
    expect(getLocaleFromAcceptLanguage("ko;q=banana, ro")).toBe("ko")
    expect(getLocaleFromAcceptLanguage("it;q=, es;q=0.5")).toBe("it")
  })

  it("filters out zero-weight candidates", () => {
    // zh is explicitly excluded by q=0, so the next candidate wins.
    expect(getLocaleFromAcceptLanguage("zh;q=0, es;q=0.5")).toBe("es")
  })

  it("falls back to the default when nothing matches", () => {
    expect(getLocaleFromAcceptLanguage("zz-ZZ, qq;q=0.9")).toBe("en")
  })
})
