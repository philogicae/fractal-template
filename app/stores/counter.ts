import { create } from "zustand"

/** Maximum number of snapshots kept for undo. */
const MAX_HISTORY = 10

interface CounterState {
  count: number
  /** Previous counts, most recent last. */
  history: number[]
  increment: () => void
  decrement: () => void
  incrementBy: (amount: number) => void
  reset: () => void
  undo: () => void
}

/** Demo store showing Zustand selectors, derived values, and undo. */
export const useCounterStore = create<CounterState>()((set) => ({
  count: 0,
  history: [],

  increment: () =>
    set((state) => ({
      count: state.count + 1,
      history: pushSnapshot(state),
    })),

  decrement: () =>
    set((state) => ({
      count: state.count - 1,
      history: pushSnapshot(state),
    })),

  incrementBy: (amount: number) =>
    set((state) => ({
      count: state.count + amount,
      history: pushSnapshot(state),
    })),

  reset: () =>
    set((state) => ({
      count: 0,
      history: pushSnapshot(state),
    })),

  undo: () =>
    set((state) => {
      const previousCount = state.history.at(-1)
      if (previousCount === undefined) return state
      return {
        count: previousCount,
        history: state.history.slice(0, -1),
      }
    }),
}))

function pushSnapshot({ count, history }: CounterState): number[] {
  return [...history.slice(-MAX_HISTORY + 1), count]
}
