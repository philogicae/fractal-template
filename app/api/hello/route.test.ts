import { describe, expect, it } from "vitest"
import { GET, POST } from "./route"

describe("GET /api/hello", () => {
  it("returns a 200 JSON payload with message and timestamp", async () => {
    const res = await GET()
    expect(res.status).toBe(200)
    expect(res.headers.get("content-type")).toContain("application/json")
    const body = (await res.json()) as {
      message: string
      status: string
      timestamp: string
    }
    expect(body.message).toBe("Hello from the API!")
    expect(body.status).toBe("ok")
    expect(Number.isNaN(Date.parse(body.timestamp))).toBe(false)
  })
})

describe("POST /api/hello", () => {
  it("echoes the JSON body back with a timestamp", async () => {
    const request = new Request("http://localhost/api/hello", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ test: true, n: 1 }),
    })
    const res = await POST(request)
    expect(res.status).toBe(200)
    const body = (await res.json()) as { data: unknown; message: string }
    expect(body.message).toBe("Data received")
    expect(body.data).toEqual({ test: true, n: 1 })
  })

  it("returns 400 with an error payload for invalid JSON", async () => {
    const request = new Request("http://localhost/api/hello", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "not json",
    })
    const res = await POST(request)
    expect(res.status).toBe(400)
    const body = (await res.json()) as { error: string }
    expect(body.error).toMatch(/invalid json/i)
  })
})
