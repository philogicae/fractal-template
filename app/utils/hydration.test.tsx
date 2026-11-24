import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { renderProbe, setupReactAct } from "../test/react"
import { useIsClient } from "./hydration"

setupReactAct()

function Probe(): React.ReactElement {
  return <span>{useIsClient() ? "client" : "server"}</span>
}

describe("useIsClient", () => {
  it("is false during server rendering", () => {
    expect(renderToStaticMarkup(<Probe />)).toContain("server")
  })

  it("is true once mounted on the client", () => {
    const probe = renderProbe(<Probe />)
    expect(probe.container.textContent).toBe("client")
    probe.unmount()
  })
})
