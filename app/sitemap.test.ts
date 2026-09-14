import { siteConfig } from "@config/site"
import { describe, expect, it } from "vitest"
import sitemap from "./sitemap"

describe("sitemap", () => {
  it("lists the landing page first with the highest priority", () => {
    const entries = sitemap()
    expect(entries.length).toBeGreaterThan(0)
    expect(entries[0]?.url).toBe(siteConfig.url)
    expect(entries[0]?.priority).toBe(1)
    expect(entries[0]?.changeFrequency).toBe("daily")
    expect(entries[0]?.lastModified).toBeInstanceOf(Date)
  })

  it("lists each shipped route under the configured origin", () => {
    const entries = sitemap()
    const byPath = new Map(
      entries.map((entry) => [new URL(entry.url).pathname, entry])
    )
    expect(byPath.has("/")).toBe(true)
    expect(byPath.has("/playground")).toBe(true)
    expect(byPath.has("/skill.md")).toBe(true)
    for (const entry of entries) {
      expect(entry.url.startsWith(siteConfig.url)).toBe(true)
      expect(entry.lastModified).toBeInstanceOf(Date)
    }
  })

  it("keeps priorities within the SEO-valid range", () => {
    for (const entry of sitemap()) {
      expect(entry.priority).toBeGreaterThanOrEqual(0)
      expect(entry.priority).toBeLessThanOrEqual(1)
    }
  })
})
