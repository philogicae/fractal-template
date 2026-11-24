import { describe, expect, it } from "vitest"
import {
  type EndpointsState,
  endpointCount,
  endpointsReducer,
  initialEndpoints,
} from "./state"

function started(
  state: EndpointsState,
  key: "hello" | "post" | "skill",
  requestId: number
): EndpointsState {
  return endpointsReducer(state, { type: "started", key, requestId })
}

function statusOf(state: EndpointsState, key: keyof EndpointsState): string {
  return state[key].status
}

describe("endpointsReducer", () => {
  it("derives the endpoint count from the initial state", () => {
    expect(endpointCount).toBe(3)
  })

  it("moves only the requested endpoint to loading", () => {
    const next = started(initialEndpoints, "hello", 1)
    expect(next.hello).toEqual({ status: "loading", requestId: 1 })
    expect(next.post).toBe(initialEndpoints.post)
    expect(next.skill).toBe(initialEndpoints.skill)
    expect(statusOf(initialEndpoints, "hello")).toBe("idle")
  })

  it("commits the response of the request still in flight", () => {
    const loading = started(initialEndpoints, "post", 7)
    const done = endpointsReducer(loading, {
      type: "loaded",
      key: "post",
      requestId: 7,
      response: { message: "ok" },
    })
    expect(done.post).toEqual({
      status: "success",
      response: { message: "ok" },
    })
  })

  it("drops a response from a superseded request", () => {
    const stale = started(initialEndpoints, "hello", 1)
    const current = started(stale, "hello", 2)
    const next = endpointsReducer(current, {
      type: "loaded",
      key: "hello",
      requestId: 1,
      response: { message: "old" },
    })
    expect(next).toBe(current)
    expect(next.hello).toEqual({ status: "loading", requestId: 2 })
  })

  it("drops a result when the endpoint is not loading", () => {
    const next = endpointsReducer(initialEndpoints, {
      type: "loaded",
      key: "skill",
      requestId: 1,
      response: "text",
    })
    expect(next).toBe(initialEndpoints)
  })

  it("replaces a previous success with an error", () => {
    const loading = started(initialEndpoints, "hello", 3)
    const success = endpointsReducer(loading, {
      type: "loaded",
      key: "hello",
      requestId: 3,
      response: { message: "ok" },
    })
    const retrying = started(success, "hello", 4)
    const failed = endpointsReducer(retrying, {
      type: "failed",
      key: "hello",
      requestId: 4,
      message: "network down",
    })
    expect(failed.hello).toEqual({ status: "error", message: "network down" })
    expect(failed.hello).not.toHaveProperty("response")
  })

  it("drops a failure from a superseded request", () => {
    const stale = started(initialEndpoints, "skill", 5)
    const current = started(stale, "skill", 6)
    const next = endpointsReducer(current, {
      type: "failed",
      key: "skill",
      requestId: 5,
      message: "late failure",
    })
    expect(next).toBe(current)
  })
})
