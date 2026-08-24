import { act } from "react"
import { createRoot, type Root } from "react-dom/client"

/**
 * Minimal React testing helpers built on `react-dom/client` + `act`.
 * The template deliberately avoids @testing-library; these few helpers
 * keep hook tests tiny while staying on committed dependencies only.
 */

declare global {
  // eslint-disable-next-line no-var
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined
}

/** Mark the environment as act-aware (required by React 19 `act`). */
export function setupReactAct(): void {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
}

export interface ProbeHandle {
  container: HTMLElement
  /** Re-render the probe with new props. */
  render: (ui: React.ReactElement) => void
  unmount: () => void
}

/** Mount `ui` into a temporary jsdom container managed by `act`. */
export function renderProbe(ui: React.ReactElement): ProbeHandle {
  setupReactAct()
  const container = document.createElement("div")
  document.body.appendChild(container)
  let root: Root | null = null
  act(() => {
    root = createRoot(container)
    root.render(ui)
  })
  return {
    container,
    render: (next: React.ReactElement) => {
      act(() => {
        root?.render(next)
      })
    },
    unmount: () => {
      act(() => {
        root?.unmount()
      })
      container.remove()
    },
  }
}
