import { getDictionary } from "@i18n/config"
import { useCounterStore } from "@stores/counter"
import { act } from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { renderProbe, withLocale } from "../test/render"
import PlaygroundPage from "./page"

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
}))
vi.mock("@i18n/actions", () => ({ setLocaleAction: vi.fn(async () => {}) }))

const dict = getDictionary("en")
const t = dict.playground
const fetchMock = vi.fn()

function resetStore(): void {
  useCounterStore.setState({ count: 0, history: [], maxHistorySize: 10 })
}

function counterText(container: HTMLElement): string {
  const counter = container.querySelector(".tabular-nums")
  if (!counter) throw new Error("missing counter display")
  return counter.textContent ?? ""
}

function buttons(container: HTMLElement): HTMLButtonElement[] {
  return [...container.querySelectorAll<HTMLButtonElement>("button")]
}

function buttonByText(container: HTMLElement, text: string): HTMLButtonElement {
  const button = buttons(container).find((b) => b.textContent === text)
  if (!button) throw new Error(`missing button: ${text}`)
  return button
}

/** The three endpoint cards each render one Send button, in DOM order. */
function sendButtons(container: HTMLElement): HTMLButtonElement[] {
  const send = buttons(container).filter(
    (b) => b.textContent === t.send || b.textContent === t.sending
  )
  if (send.length !== 3) {
    throw new Error(`expected 3 send buttons, got ${send.length}`)
  }
  return send
}

/** True when any endpoint card reports the given status label. */
function showsStatus(container: HTMLElement, label: string): boolean {
  return [...container.querySelectorAll("span")].some(
    (span) => span.textContent === label
  )
}

function responsePre(container: HTMLElement): string[] {
  return [...container.querySelectorAll("pre")].map(
    (pre) => pre.textContent ?? ""
  )
}

describe("app/playground/page", () => {
  beforeEach(() => {
    resetStore()
    fetchMock.mockReset()
    vi.stubGlobal("fetch", fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("renders the localized shell and the idle endpoint cards", () => {
    const probe = renderProbe(withLocale(<PlaygroundPage />))
    expect(probe.container.querySelector("h1")?.textContent).toBe(t.title)
    expect(probe.container.textContent).toContain(t.subtitle)
    expect(probe.container.textContent).toContain(t.stateSection)
    expect(probe.container.textContent).toContain(t.apiSection)
    expect(probe.container.textContent).toContain(
      t.apiCount.replace("{count}", "3")
    )
    expect(probe.container.querySelectorAll("pre").length).toBe(0)
    expect(counterText(probe.container)).toBe("0")
    // No history yet: the Undo button is disabled.
    expect(buttonByText(probe.container, t.undo).disabled).toBe(true)
    probe.unmount()
  })

  it("drives the Zustand counter through every control", () => {
    const probe = renderProbe(withLocale(<PlaygroundPage />))
    act(() => buttonByText(probe.container, "+1").click())
    expect(counterText(probe.container)).toBe("1")
    act(() => buttonByText(probe.container, "+5").click())
    expect(counterText(probe.container)).toBe("6")
    act(() => buttonByText(probe.container, "-1").click())
    expect(counterText(probe.container)).toBe("5")
    expect(probe.container.textContent).toContain(`${t.historyLabel}: [0,1,6]`)

    act(() => buttonByText(probe.container, t.undo).click())
    expect(counterText(probe.container)).toBe("6")

    act(() => buttonByText(probe.container, t.reset).click())
    expect(counterText(probe.container)).toBe("0")
    expect(buttonByText(probe.container, t.undo).disabled).toBe(false)
    probe.unmount()
  })

  it("caps the visible history at the five most recent entries", () => {
    for (let i = 0; i < 8; i += 1) useCounterStore.getState().increment()
    const probe = renderProbe(withLocale(<PlaygroundPage />))
    expect(probe.container.textContent).toContain(
      `${t.historyLabel}: [3,4,5,6,7]`
    )
    probe.unmount()
  })

  it("runs the GET endpoint and renders its JSON response", async () => {
    fetchMock.mockResolvedValue({
      json: async () => ({ message: "hello!", status: "ok" }),
    })
    const probe = renderProbe(withLocale(<PlaygroundPage />))
    const [get] = sendButtons(probe.container)
    await act(async () => {
      get?.click()
    })
    expect(fetchMock).toHaveBeenCalledWith("/api/hello")
    expect(showsStatus(probe.container, t.status.success)).toBe(true)
    expect(responsePre(probe.container)[0]).toContain('"hello!"')
    probe.unmount()
  })

  it("runs the POST endpoint with a JSON body", async () => {
    fetchMock.mockResolvedValue({
      json: async () => ({ message: "Data received" }),
    })
    const probe = renderProbe(withLocale(<PlaygroundPage />))
    const post = sendButtons(probe.container)[1]
    await act(async () => {
      post?.click()
    })
    const [url, init] = fetchMock.mock.calls[0] ?? []
    expect(url).toBe("/api/hello")
    expect(init?.method).toBe("POST")
    expect(init?.headers).toMatchObject({ "Content-Type": "application/json" })
    expect(JSON.parse(String(init?.body))).toMatchObject({ test: true })
    probe.unmount()
  })

  it("runs the SKILL.md endpoint and truncates long text", async () => {
    fetchMock.mockResolvedValue({ text: async () => "a".repeat(600) })
    const probe = renderProbe(withLocale(<PlaygroundPage />))
    const skill = sendButtons(probe.container)[2]
    await act(async () => {
      skill?.click()
    })
    expect(fetchMock).toHaveBeenCalledWith("/skill.md?raw=1")
    expect(responsePre(probe.container)[0]).toBe(`${"a".repeat(500)}...`)
    probe.unmount()
  })

  it("keeps short SKILL.md text untruncated", async () => {
    fetchMock.mockResolvedValue({ text: async () => "short" })
    const probe = renderProbe(withLocale(<PlaygroundPage />))
    const skill = sendButtons(probe.container)[2]
    await act(async () => {
      skill?.click()
    })
    expect(responsePre(probe.container)[0]).toBe("short")
    probe.unmount()
  })

  it("surfaces request failures as an error state", async () => {
    fetchMock.mockRejectedValue(new Error("network down"))
    const probe = renderProbe(withLocale(<PlaygroundPage />))
    const [get] = sendButtons(probe.container)
    await act(async () => {
      get?.click()
    })
    expect(showsStatus(probe.container, t.status.error)).toBe(true)
    expect(responsePre(probe.container)[0]).toContain("network down")
    probe.unmount()
  })

  it("falls back to a generic message for non-Error rejections", async () => {
    fetchMock.mockRejectedValue("boom")
    const probe = renderProbe(withLocale(<PlaygroundPage />))
    const [get] = sendButtons(probe.container)
    await act(async () => {
      get?.click()
    })
    expect(responsePre(probe.container)[0]).toContain("Unknown error")
    probe.unmount()
  })

  it("shows the in-flight state while the request is pending", async () => {
    let release!: (value: { json: () => Promise<unknown> }) => void
    fetchMock.mockReturnValue(
      new Promise((resolve) => {
        release = resolve
      })
    )
    const probe = renderProbe(withLocale(<PlaygroundPage />))
    const [get] = sendButtons(probe.container)
    await act(async () => {
      get?.click()
      await Promise.resolve()
    })
    expect(showsStatus(probe.container, t.status.loading)).toBe(true)
    expect(
      buttons(probe.container).some((b) => b.textContent === t.sending)
    ).toBe(true)

    await act(async () => {
      release({ json: async () => ({ message: "late" }) })
    })
    expect(showsStatus(probe.container, t.status.success)).toBe(true)
    probe.unmount()
  })
})
