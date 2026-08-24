import { describe, expect, it, vi } from "vitest"
import { version as packageVersion } from "../../package.json"
import { GET } from "./route"

/**
 * The route caches through `unstable_cache`; in tests we bypass the
 * Next cache and call the underlying loader directly.
 */
vi.mock("next/cache", () => ({
  unstable_cache: (fn: <T>(...args: unknown[]) => T) => fn,
}))

const browserRequest = (): Request =>
  new Request("http://localhost:3000/skill.md", {
    headers: {
      "user-agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
    },
  })

const toolRequest = (): Request =>
  new Request("http://localhost:3000/skill.md", {
    headers: { "user-agent": "curl/8.5.0" },
  })

describe("GET /skill.md content negotiation", () => {
  it("serves raw markdown to tool user agents", async () => {
    const res = await GET(toolRequest())
    expect(res.status).toBe(200)
    expect(res.headers.get("content-type")).toContain("text/markdown")
    expect(res.headers.get("cache-control")).toContain("max-age=3600")
    const body = await res.text()
    expect(body.startsWith("---")).toBe(true)
    expect(body).toContain(`version: "${packageVersion}"`)
  })

  it("serves styled HTML to browser user agents", async () => {
    const res = await GET(browserRequest())
    expect(res.status).toBe(200)
    expect(res.headers.get("content-type")).toContain("text/html")
    const body = await res.text()
    expect(body).toContain("<!DOCTYPE html>")
    expect(body.toLowerCase()).toContain("frontmatter")
  })

  it("forces markdown via ?raw=1 even for browsers", async () => {
    const res = await GET(
      new Request("http://localhost:3000/skill.md?raw=1", {
        headers: { "user-agent": "Chrome/126.0" },
      })
    )
    expect(res.headers.get("content-type")).toContain("text/markdown")
  })

  it("prefers explicit text Accept types over the browser UA", async () => {
    const res = await GET(
      new Request("http://localhost:3000/skill.md", {
        headers: {
          "user-agent": "Chrome/126.0",
          accept: "text/plain",
        },
      })
    )
    expect(res.headers.get("content-type")).toContain("text/markdown")
  })

  it("defaults unknown agents to markdown", async () => {
    const res = await GET(
      new Request("http://localhost:3000/skill.md", {
        headers: { "user-agent": "some-unknown-agent/1.0" },
      })
    )
    expect(res.headers.get("content-type")).toContain("text/markdown")
  })
})
