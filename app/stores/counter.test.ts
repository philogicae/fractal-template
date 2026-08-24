import { beforeEach, describe, expect, it } from "vitest"
import { useCounterStore } from "./counter"

/** Reset the module-level store so tests stay isolated. */
function resetStore(): void {
  useCounterStore.setState({ count: 0, history: [], maxHistorySize: 10 })
}

describe("useCounterStore", () => {
  beforeEach(resetStore)

  it("increments and decrements the count", () => {
    const s = useCounterStore.getState()
    s.increment()
    s.increment()
    s.decrement()
    expect(useCounterStore.getState().count).toBe(1)
  })

  it("records each change in history", () => {
    const s = useCounterStore.getState()
    s.increment() // pushes 0
    s.incrementBy(5) // pushes 1
    s.decrement() // pushes 6
    expect(useCounterStore.getState().history).toEqual([0, 1, 6])
  })

  it("caps history at maxHistorySize entries", () => {
    const s = useCounterStore.getState()
    for (let i = 0; i < 15; i += 1) s.increment()
    const { history } = useCounterStore.getState()
    expect(history).toHaveLength(10)
    // Oldest entries are evicted: the window keeps snapshots 5..14.
    expect(history[0]).toBe(5)
  })

  it("undo restores the previous count and pops it off history", () => {
    const s = useCounterStore.getState()
    s.incrementBy(3)
    s.increment()
    expect(useCounterStore.getState().count).toBe(4)
    useCounterStore.getState().undo()
    expect(useCounterStore.getState().count).toBe(3)
    expect(useCounterStore.getState().history).toEqual([0])
  })

  it("undo on empty history is a no-op", () => {
    const before = useCounterStore.getState()
    before.undo()
    const after = useCounterStore.getState()
    expect(after.count).toBe(before.count)
    expect(after.history).toEqual([])
  })

  it("reset zeroes the count but keeps an undo path", () => {
    const s = useCounterStore.getState()
    s.incrementBy(7)
    s.reset()
    expect(useCounterStore.getState().count).toBe(0)
    useCounterStore.getState().undo()
    expect(useCounterStore.getState().count).toBe(7)
  })
})
