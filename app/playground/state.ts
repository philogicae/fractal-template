/** Shape of the JSON payloads returned by the demo endpoints. */
export interface ApiResponse {
  message?: string
  timestamp?: string
  status?: string
  data?: unknown
  error?: string
}

export type ResponseBody = ApiResponse | string

export type RequestKey = "hello" | "post" | "skill"

export type EndpointState =
  | { status: "idle" }
  | { status: "loading"; requestId: number }
  | { status: "success"; response: ResponseBody }
  | { status: "error"; message: string }

export type EndpointsState = Record<RequestKey, EndpointState>

export type EndpointsEvent =
  | { type: "started"; key: RequestKey; requestId: number }
  | {
      type: "loaded"
      key: RequestKey
      requestId: number
      response: ResponseBody
    }
  | { type: "failed"; key: RequestKey; requestId: number; message: string }

export const initialEndpoints: EndpointsState = {
  hello: { status: "idle" },
  post: { status: "idle" },
  skill: { status: "idle" },
}

export const endpointCount = Object.keys(initialEndpoints).length

/** Only the request still in flight may commit; newer wins, stale results are dropped. */
export function endpointsReducer(
  state: EndpointsState,
  event: EndpointsEvent
): EndpointsState {
  const current = state[event.key]

  switch (event.type) {
    case "started":
      return {
        ...state,
        [event.key]: { status: "loading", requestId: event.requestId },
      }
    case "loaded": {
      if (
        current.status !== "loading" ||
        current.requestId !== event.requestId
      ) {
        return state
      }
      return {
        ...state,
        [event.key]: { status: "success", response: event.response },
      }
    }
    case "failed": {
      if (
        current.status !== "loading" ||
        current.requestId !== event.requestId
      ) {
        return state
      }
      return {
        ...state,
        [event.key]: { status: "error", message: event.message },
      }
    }
  }
}
