import { siteConfig } from "@config/site"
import { describe, expect, it } from "vitest"
import {
  type Dictionary,
  defaultLocale,
  getDictionary,
  hasLocale,
  localeMeta,
  locales,
} from "./config"

/** Recursively compare key sets of two dictionary subtrees. */
function assertKeyParity(
  actual: unknown,
  expected: unknown,
  path: string
): void {
  if (actual === null || typeof actual !== "object") return
  expect(Object.keys(actual as object).sort(), `key parity at ${path}`).toEqual(
    Object.keys(expected as object).sort()
  )
  for (const key of Object.keys(expected as object)) {
    assertKeyParity(
      (actual as Record<string, unknown>)[key],
      (expected as Record<string, unknown>)[key],
      `${path}.${key}`
    )
  }
}

describe("i18n registry", () => {
  it("ships the documented locale set with English first", () => {
    expect(locales[0]).toBe(defaultLocale)
    expect(new Set(locales).size).toBe(locales.length)
    expect(locales).toContain("en")
    expect(locales.length).toBeGreaterThanOrEqual(12)
  })

  it("has display meta (flag + native) for every locale", () => {
    for (const loc of locales) {
      const meta = localeMeta[loc]
      expect(meta.flag.trim(), `flag for ${loc}`).not.toBe("")
      expect(meta.native.trim(), `native name for ${loc}`).not.toBe("")
    }
  })

  it("hasLocale accepts exactly the registry keys", () => {
    for (const loc of locales) expect(hasLocale(loc)).toBe(true)
    expect(hasLocale("xx")).toBe(false)
    expect(hasLocale("")).toBe(false)
  })

  it("getDictionary returns the dictionary for each locale", () => {
    for (const loc of locales) {
      const dict: Dictionary = getDictionary(loc)
      expect(dict.meta).toBe(localeMeta[loc])
    }
  })

  it("keeps every dictionary key-paritous with the English source", () => {
    const en = getDictionary("en")
    for (const loc of locales) {
      assertKeyParity(getDictionary(loc), en, loc)
    }
  })

  it("resolves every nav labelKey in every locale (siteConfig contract)", () => {
    for (const loc of locales) {
      const dict = getDictionary(loc)
      for (const link of siteConfig.nav) {
        expect(
          dict.nav[link.labelKey],
          `${loc}.nav.${link.labelKey}`
        ).toBeTruthy()
      }
    }
  })

  it("exposes only absolute social URLs", () => {
    for (const social of siteConfig.social) {
      expect(social.href).toMatch(/^https:\/\//)
      expect(social.label.trim()).not.toBe("")
    }
  })
})
