import { act } from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { type ProbeHandle, renderProbe, setupReactAct } from "../test/react"
import { useDebounce, useDebouncedCallback, useDebounceState } from "./debounce"

setupReactAct()

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

/** Advance fake timers inside act so scheduled state updates commit. */
function advance(ms: number): void {
  act(() => {
    vi.advanceTimersByTime(ms)
  })
}

describe("useDebounce", () => {
  it("updates the value only after the delay elapses", () => {
    let debounced = ""
    function Probe({ value }: { value: string }): null {
      debounced = useDebounce(value, 300)
      return null
    }
    const probe = renderProbe(<Probe value="a" />)
    expect(debounced).toBe("a")
    probe.render(<Probe value="ab" />)
    advance(200)
    expect(debounced).toBe("a")
    advance(150)
    expect(debounced).toBe("ab")
    probe.unmount()
  })

  it("restarts the timer on every change (no intermediate values leak)", () => {
    let debounced = ""
    function Probe({ value }: { value: string }): null {
      debounced = useDebounce(value, 300)
      return null
    }
    const probe = renderProbe(<Probe value="1" />)
    for (const v of ["12", "123", "1234"]) {
      probe.render(<Probe value={v} />)
      advance(250)
      expect(debounced).toBe("1")
    }
    advance(300)
    expect(debounced).toBe("1234")
    probe.unmount()
  })
})

describe("useDebouncedCallback", () => {
  function makeProbe(
    calls: string[],
    onDebounced?: (fn: (v: string) => void) => void
  ): ProbeHandle {
    function Probe(): React.ReactElement {
      const debounced = useDebouncedCallback((v: string) => calls.push(v), 300)
      onDebounced?.(debounced)
      return (
        <button type="button" onClick={() => debounced("x")}>
          fire
        </button>
      )
    }
    return renderProbe(<Probe />)
  }

  it("delays invocation and collapses bursts into one call", () => {
    const calls: string[] = []
    const probe = makeProbe(calls)
    const button = probe.container.querySelector("button")
    if (!button) throw new Error("missing probe button")
    act(() => {
      button.click()
      button.click()
      button.click()
    })
    advance(299)
    expect(calls).toEqual([])
    advance(1)
    expect(calls).toEqual(["x"])
    probe.unmount()
  })

  it("always invokes the latest callback without changing identity", () => {
    const seen: string[] = []
    let captured: ((v: string) => void) | null = null
    let firstRef: unknown = null
    function Probe({ tag }: { tag: string }): null {
      const debounced = useDebouncedCallback(() => seen.push(tag), 100)
      captured = debounced
      if (firstRef === null) firstRef = debounced
      expect(debounced).toBe(firstRef)
      return null
    }
    const probe = renderProbe(<Probe tag="old" />)
    act(() => {
      captured?.("ignored")
    })
    probe.render(<Probe tag="new" />)
    act(() => {
      captured?.("kept")
    })
    advance(100)
    // Same fn identity across renders; the stale invocation was
    // cancelled and only the newest closure ran.
    expect(seen).toEqual(["new"])
    probe.unmount()
  })
  it("does not fire after unmount", () => {
    const calls: string[] = []
    const probe = makeProbe(calls)
    const button = probe.container.querySelector("button")
    if (!button) throw new Error("missing probe button")
    act(() => {
      button.click()
    })
    probe.unmount()
    advance(500)
    expect(calls).toEqual([])
  })
})

describe("useDebounceState", () => {
  it("returns live value, debounced value, and a setter", () => {
    let live = ""
    let debounced = ""
    function Probe(): React.ReactElement {
      const [value, debouncedValue, setValue] = useDebounceState("", 200)
      live = value
      debounced = debouncedValue
      return (
        <button type="button" onClick={() => setValue("typed")}>
          set
        </button>
      )
    }
    const probe = renderProbe(<Probe />)
    const button = probe.container.querySelector("button")
    if (!button) throw new Error("missing probe button")
    act(() => {
      button.click()
    })
    expect(live).toBe("typed")
    expect(debounced).toBe("")
    advance(200)
    expect(debounced).toBe("typed")
    probe.unmount()
  })
})
