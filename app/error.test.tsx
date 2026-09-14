import { getDictionary } from "@i18n/config"
import { act } from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import ErrorBoundary from "./error"
import { renderWithLocale } from "./test/render"

const routerState = { push: vi.fn(), refresh: vi.fn() }

vi.mock("next/navigation", () => ({ useRouter: () => routerState }))
vi.mock("@i18n/actions", () => ({ setLocaleAction: vi.fn(async () => {}) }))

const dict = getDictionary("en")

function buttonByText(container: HTMLElement, text: string): HTMLButtonElement {
  const button = [...container.querySelectorAll("button")].find((b) =>
    b.textContent?.includes(text)
  )
  if (!button) throw new Error(`missing button: ${text}`)
  return button
}

describe("ErrorBoundary", () => {
  let consoleError: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleError = vi.spyOn(console, "error").mockImplementation(() => {})
    routerState.push.mockClear()
  })

  afterEach(() => {
    consoleError.mockRestore()
  })

  it("shows the localized error chrome with message and digest", () => {
    const error = Object.assign(new Error("Boom"), { digest: "abc123" })
    const probe = renderWithLocale(
      <ErrorBoundary error={error} reset={vi.fn()} />
    )
    expect(probe.container.textContent).toContain(dict.error.title)
    expect(probe.container.textContent).toContain(dict.error.subtitle)
    expect(probe.container.textContent).toContain("Boom")
    expect(probe.container.textContent).toContain("abc123")
    expect(consoleError).toHaveBeenCalledWith("Application error:", error)
    probe.unmount()
  })

  it("falls back to the unknown-error copy and hides a missing digest", () => {
    const error = new Error("")
    const probe = renderWithLocale(
      <ErrorBoundary error={error} reset={vi.fn()} />
    )
    expect(probe.container.textContent).toContain(dict.error.unknown)
    expect(probe.container.textContent).not.toContain(dict.error.errorId)
    probe.unmount()
  })

  it("invokes reset from the retry button", () => {
    const reset = vi.fn()
    const probe = renderWithLocale(
      <ErrorBoundary error={new Error("x")} reset={reset} />
    )
    act(() => buttonByText(probe.container, dict.error.retry).click())
    expect(reset).toHaveBeenCalledTimes(1)
    probe.unmount()
  })

  it("navigates home from the secondary button", () => {
    const probe = renderWithLocale(
      <ErrorBoundary error={new Error("x")} reset={vi.fn()} />
    )
    act(() => buttonByText(probe.container, dict.error.home).click())
    expect(routerState.push).toHaveBeenCalledWith("/")
    probe.unmount()
  })
})
