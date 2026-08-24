import { act } from "react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { renderProbe, setupReactAct } from "../test/react"
import { breakpoints, useBreakpoint, useMediaQuery } from "./media-query"

setupReactAct()

/**
 * jsdom has no `matchMedia`; install a controllable stub whose
 * `matches` flag can be flipped to drive re-renders.
 */
function installMatchMedia(initial: boolean): {
  setMatches: (value: boolean) => void
  emit: () => void
} {
  const state = { matches: initial }
  const listeners = new Set<(event: { matches: boolean }) => void>()
  vi.stubGlobal("matchMedia", (query: string) => ({
    media: query,
    get matches() {
      return state.matches
    },
    addEventListener: (_: string, cb: (event: { matches: boolean }) => void) =>
      listeners.add(cb),
    removeEventListener: (
      _: string,
      cb: (event: { matches: boolean }) => void
    ) => listeners.delete(cb),
  }))
  return {
    setMatches: (value: boolean) => {
      state.matches = value
    },
    emit: () => {
      for (const cb of listeners) cb({ matches: state.matches })
    },
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("useMediaQuery", () => {
  it("reflects the current match state and reacts to changes", () => {
    const mq = installMatchMedia(false)
    let seen: boolean | undefined
    function Probe(): null {
      seen = useMediaQuery("(min-width: 768px)")
      return null
    }
    const probe = renderProbe(<Probe />)
    expect(seen).toBe(false)
    act(() => {
      mq.setMatches(true)
      mq.emit()
    })
    expect(seen).toBe(true)
    probe.unmount()
  })

  it("stops listening after unmount", () => {
    const mq = installMatchMedia(false)
    let seen: boolean | undefined
    function Probe(): null {
      seen = useMediaQuery("(min-width: 768px)")
      return null
    }
    const probe = renderProbe(<Probe />)
    probe.unmount()
    act(() => {
      mq.setMatches(true)
      mq.emit()
    })
    expect(seen).toBe(false)
  })
})

describe("useBreakpoint", () => {
  it("maps named breakpoints to min-width queries", () => {
    installMatchMedia(true)
    let seen: boolean | undefined
    function Probe(): null {
      seen = useBreakpoint("lg")
      return null
    }
    const probe = renderProbe(<Probe />)
    expect(seen).toBe(true)
    expect(breakpoints.lg).toBe("(min-width: 1024px)")
    probe.unmount()
  })
})
