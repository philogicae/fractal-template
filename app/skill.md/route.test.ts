import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { minify } from "terser"
import { describe, expect, it, vi } from "vitest"
import { version as packageVersion } from "../../package.json"
import { GET } from "./route"

/**
 * The route caches through `unstable_cache`; in tests we bypass the
 * Next cache and call the underlying loader directly. Content is
 * controlled by pointing `process.cwd()` at a temp directory that holds a
 * synthetic `SKILL.md` (Node built-ins are externalized and cannot be
 * intercepted with `vi.mock`).
 */
vi.mock("next/cache", () => ({
  unstable_cache: (fn: <T>(...args: unknown[]) => T) => fn,
}))
vi.mock("terser", async (importOriginal) => {
  const actual = await importOriginal<typeof import("terser")>()
  return { ...actual, minify: vi.fn(actual.minify) }
})

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

/** Run `assert` with `process.cwd()` pointing at a temp dir. */
async function withCwd(assert: () => Promise<void>): Promise<void> {
  const dir = await mkdtemp(join(tmpdir(), "skill-md-"))
  vi.spyOn(process, "cwd").mockReturnValue(dir)
  try {
    await assert()
  } finally {
    vi.restoreAllMocks()
    await rm(dir, { recursive: true, force: true })
  }
}

/** Write a synthetic `SKILL.md` into a temp cwd for the duration of `assert`. */
async function withSkillFile(
  content: string,
  assert: () => Promise<void>
): Promise<void> {
  await withCwd(async () => {
    await writeFile(join(process.cwd(), "SKILL.md"), content, "utf-8")
    await assert()
  })
}

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

  it("honors an explicit Accept: text/html from a client without a browser UA", async () => {
    const res = await GET(
      new Request("http://localhost:3000/skill.md", {
        headers: { accept: "text/html" },
      })
    )
    expect(res.status).toBe(200)
    expect(res.headers.get("content-type")).toContain("text/html")
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

describe("GET /skill.md content rendering", () => {
  const plainMarkdown = `# Hello World!

Some \`inline\` text.

## Second --- Stop!!!

### --Edge--

\`\`\`bash
# full line comment
echo "hi" # trailing comment
\`\`\`

#### Final Section
`

  it("renders markdown without frontmatter and adds heading anchors", async () => {
    await withSkillFile(plainMarkdown, async () => {
      const res = await GET(browserRequest())
      expect(res.status).toBe(200)
      const body = await res.text()
      expect(body).not.toContain('<div class="frontmatter-card">')
      expect(body).toContain('<h1 id="hello-world">')
      expect(body).toContain('<h2 id="second-stop">')
      expect(body).toContain('<h3 id="edge">')
      expect(body).toContain('class="anchor-link"')
      expect(body).toContain('class="comment"')
      expect(body).toContain("Skill Documentation")
    })
  })

  it("escapes unsafe frontmatter instead of injecting markup", async () => {
    await withSkillFile(
      [
        "---",
        'name: <script>alert("x")</script>',
        "# a comment",
        "  indented: skipped",
        "\t: ghost key",
        "nocolon",
        'description: "quoted"',
        "source: https://example.com/skill.md",
        "---",
        "body",
      ].join("\n"),
      async () => {
        const res = await GET(browserRequest())
        const body = await res.text()
        expect(body).toContain("&lt;script&gt;")
        expect(body).not.toContain("<script>alert")
        // Frontmatter card highlights strings and comments.
        expect(body).toContain("frontmatter-card")
        expect(body).toContain('class="yaml-comment"')
        expect(body).toContain('class="yaml-string"')
      }
    )
  })

  it("treats an unterminated frontmatter block as plain content", async () => {
    const unterminated = "---\nname: broken\nstill content"
    await withSkillFile(unterminated, async () => {
      const res = await GET(toolRequest())
      expect(await res.text()).toBe(unterminated)
    })
  })

  it("falls back to the unminified theme script when terser returns no code", async () => {
    vi.mocked(minify).mockResolvedValueOnce({} as never)
    const res = await GET(browserRequest())
    const body = await res.text()
    expect(body).toContain("document.getElementById('theme-toggle')")
  })

  it("uses the generic error message when a non-Error is thrown", async () => {
    vi.mocked(minify).mockRejectedValueOnce("nope" as never)
    const res = await GET(browserRequest())
    expect(res.status).toBe(500)
    expect(await res.text()).toContain("Failed to read SKILL.md")
  })
})

describe("GET /skill.md failures", () => {
  it("returns a plain-text 500 when the file cannot be read", async () => {
    await withCwd(async () => {
      const res = await GET(toolRequest())
      expect(res.status).toBe(500)
      expect(res.headers.get("content-type")).toContain("text/plain")
      expect(await res.text()).toMatch(/^Error: /)
    })
  })

  it("returns an HTML 500 for browser requests when the file is missing", async () => {
    await withCwd(async () => {
      const res = await GET(browserRequest())
      expect(res.status).toBe(500)
      expect(res.headers.get("content-type")).toContain("text/html")
      const body = await res.text()
      expect(body).toContain("Error")
      expect(body).toContain("View raw markdown")
    })
  })
})
