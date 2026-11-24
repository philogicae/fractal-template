"use client"

import { Container } from "@components/Container"
import { StatusBadge } from "@components/StatusBadge"
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@heroui/react"
import type { Dictionary } from "@i18n/config"
import { useDict } from "@i18n/LocaleProvider"
import { useCounterStore } from "@stores/counter"
import { memo, useCallback, useReducer, useRef } from "react"
import {
  type ApiResponse,
  type EndpointState,
  endpointCount,
  endpointsReducer,
  initialEndpoints,
  type RequestKey,
  type ResponseBody,
} from "./state"

type PlaygroundDict = Dictionary["playground"]

/**
 * API endpoint card with method badge, status indicator, and response preview.
 * Memoized to prevent parent re-renders from affecting this component.
 */
interface EndpointCardProps {
  method: "GET" | "POST" | "PUT" | "DELETE"
  path: string
  description: string
  state: EndpointState
  onRun: () => void
  t: PlaygroundDict
}

const methodColors: Record<EndpointCardProps["method"], string> = {
  GET: "text-(--color-emerald) bg-(--color-emerald)/10 border-(--color-emerald)/30",
  POST: "text-(--color-azure) bg-(--color-azure)/10 border-(--color-azure)/30",
  PUT: "text-(--color-amber) bg-(--color-amber)/10 border-(--color-amber)/30",
  DELETE: "text-(--color-rose) bg-(--color-rose)/10 border-(--color-rose)/30",
}

const EndpointCard = memo(function EndpointCard({
  method,
  path,
  description,
  state,
  onRun,
  t,
}: EndpointCardProps): React.ReactElement {
  const isPending = state.status === "loading"
  const responseText =
    state.status === "success"
      ? typeof state.response === "string"
        ? state.response
        : JSON.stringify(state.response, null, 2)
      : state.status === "error"
        ? state.message
        : null

  return (
    <Card className="border border-(--color-border-default) bg-(--color-bg-secondary) shadow-none rounded-(--radius-cards)">
      <CardHeader className="flex items-start justify-between gap-2 p-2 pb-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className={`shrink-0 inline-flex items-center justify-center rounded border px-1 py-0.5 text-[9px] sm:text-[10px] font-mono font-semibold ${methodColors[method]}`}
          >
            {method}
          </span>
          <code className="text-[10px] sm:text-xs text-(--color-text-primary) font-mono truncate">
            {path}
          </code>
        </div>
        <StatusBadge status={state.status} label={t.status[state.status]} />
      </CardHeader>

      <CardContent className="px-2 py-0">
        <p className="text-[10px] sm:text-xs text-(--color-text-secondary) mb-1">
          {description}
        </p>

        {responseText !== null && (
          <div className="rounded-(--radius-cards) bg-(--color-bg-primary) border border-(--color-border-default) p-1.5 mb-1">
            <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-(--color-text-muted) mb-0.5 font-medium">
              {t.response}
            </p>
            <pre className="text-[9px] sm:text-xs text-(--color-text-primary) overflow-auto whitespace-pre-wrap wrap-break-word max-h-20 leading-snug font-mono">
              {responseText}
            </pre>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-2 pt-1">
        <Button
          onPress={onRun}
          isDisabled={isPending}
          size="sm"
          className="w-full bg-(--color-accent-primary) hover:brightness-110 text-(--color-bg-primary) font-semibold h-7 text-[10px] sm:text-xs rounded-(--radius-buttons) transition-all duration-150"
        >
          {isPending ? t.sending : t.send}
        </Button>
      </CardFooter>
    </Card>
  )
})

interface CounterControlsProps {
  onDecrement: () => void
  onIncrement: () => void
  onIncrementBy: (amount: number) => void
  onReset: () => void
  onUndo: () => void
  canUndo: boolean
  t: PlaygroundDict
}

const CounterControls = memo(function CounterControls({
  onDecrement,
  onIncrement,
  onIncrementBy,
  onReset,
  onUndo,
  canUndo,
  t,
}: CounterControlsProps): React.ReactElement {
  const handleIncrementBy = useCallback(() => {
    onIncrementBy(5)
  }, [onIncrementBy])

  return (
    <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5">
      <Button
        onPress={onDecrement}
        variant="outline"
        size="sm"
        className="font-medium h-7 sm:h-8 min-w-8 sm:min-w-9 px-1.5 sm:px-2 text-xs"
      >
        -1
      </Button>
      <Button
        onPress={onIncrement}
        size="sm"
        className="bg-(--color-accent-primary) hover:brightness-110 text-(--color-bg-primary) font-semibold h-7 sm:h-8 min-w-8 sm:min-w-9 px-1.5 sm:px-2 text-xs rounded-(--radius-buttons) transition-all duration-150"
      >
        +1
      </Button>
      <Button
        onPress={handleIncrementBy}
        variant="outline"
        size="sm"
        className="font-medium h-7 sm:h-8 min-w-8 sm:min-w-9 px-1.5 sm:px-2 text-xs"
      >
        +5
      </Button>
      <Button
        onPress={onReset}
        variant="ghost"
        size="sm"
        className="font-medium h-7 sm:h-8 px-1.5 sm:px-2 text-xs"
      >
        {t.reset}
      </Button>
      <Button
        onPress={onUndo}
        isDisabled={!canUndo}
        variant="ghost"
        size="sm"
        className="font-medium h-7 sm:h-8 px-1.5 sm:px-2 text-xs"
      >
        {t.undo}
      </Button>
    </div>
  )
})

/** Interactive playground for the demo endpoints and the Zustand counter. */
export default function PlaygroundPage(): React.ReactElement {
  const t = useDict().playground
  const [endpoints, dispatch] = useReducer(endpointsReducer, initialEndpoints)
  const lastRequestId = useRef(0)

  const count = useCounterStore((s) => s.count)
  const history = useCounterStore((s) => s.history)
  const increment = useCounterStore((s) => s.increment)
  const decrement = useCounterStore((s) => s.decrement)
  const incrementBy = useCounterStore((s) => s.incrementBy)
  const reset = useCounterStore((s) => s.reset)
  const undo = useCounterStore((s) => s.undo)

  const historyDisplay = history.slice(-5).join(",")
  const canUndo = history.length > 0

  const runRequest = useCallback(
    async (
      key: RequestKey,
      load: () => Promise<ResponseBody>
    ): Promise<void> => {
      const requestId = ++lastRequestId.current
      dispatch({ type: "started", key, requestId })
      try {
        const response = await load()
        dispatch({ type: "loaded", key, requestId, response })
      } catch (error) {
        dispatch({
          type: "failed",
          key,
          requestId,
          message: Error.isError(error) ? error.message : "Unknown error",
        })
      }
    },
    []
  )

  const testHello = useCallback((): void => {
    runRequest("hello", async () => {
      const res = await fetch("/api/hello")
      return (await res.json()) as ApiResponse
    })
  }, [runRequest])

  const testPost = useCallback((): void => {
    runRequest("post", async () => {
      const res = await fetch("/api/hello", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: true, timestamp: Date.now() }),
      })
      return (await res.json()) as ApiResponse
    })
  }, [runRequest])

  const testSkill = useCallback((): void => {
    runRequest("skill", async () => {
      const res = await fetch("/skill.md?raw=1")
      const text = await res.text()
      return text.slice(0, 500) + (text.length > 500 ? "..." : "")
    })
  }, [runRequest])

  return (
    <div className="relative w-full flex-1 flex flex-col px-4 py-6 sm:py-10">
      <Container size="xl" className="flex-1 flex flex-col justify-center">
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-(--color-text-primary) mb-1 sm:mb-2">
            {t.title}
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-(--color-text-secondary) max-w-2xl">
            {t.subtitle}
          </p>
        </div>

        <section className="mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-center justify-between flex-wrap gap-1 sm:gap-2 mb-2">
            <h2 className="text-sm sm:text-base md:text-lg font-semibold text-(--color-text-primary)">
              {t.stateSection}
            </h2>
            <span className="text-[10px] sm:text-xs text-(--color-text-muted)">
              {t.stateHint}
            </span>
          </div>

          <Card className="border border-(--color-border-default) bg-(--color-bg-secondary) shadow-none rounded-(--radius-cards)">
            <CardContent className="p-2 sm:p-3 md:p-4">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                <div className="text-lg sm:text-2xl md:text-3xl font-bold text-(--color-accent-primary) tabular-nums min-w-10 sm:min-w-14 text-center">
                  {count}
                </div>
                <CounterControls
                  onDecrement={decrement}
                  onIncrement={increment}
                  onIncrementBy={incrementBy}
                  onReset={reset}
                  onUndo={undo}
                  canUndo={canUndo}
                  t={t}
                />
                {history.length > 0 && (
                  <div className="text-[10px] sm:text-xs text-(--color-text-muted) font-mono text-center">
                    {t.historyLabel}: [{historyDisplay}]
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <div className="flex items-center justify-between flex-wrap gap-1 mb-2">
            <h2 className="text-xs sm:text-base md:text-lg font-semibold text-(--color-text-primary)">
              {t.apiSection}
            </h2>
            <span className="text-[10px] sm:text-xs text-(--color-text-muted)">
              {t.apiCount.replace("{count}", String(endpointCount))}
            </span>
          </div>

          <div className="grid gap-2 sm:gap-3 md:gap-4 lg:grid-cols-3">
            <EndpointCard
              method="GET"
              path="/api/hello"
              description={t.endpoints.hello}
              state={endpoints.hello}
              onRun={testHello}
              t={t}
            />
            <EndpointCard
              method="POST"
              path="/api/hello"
              description={t.endpoints.post}
              state={endpoints.post}
              onRun={testPost}
              t={t}
            />
            <EndpointCard
              method="GET"
              path="/skill.md?raw=1"
              description={t.endpoints.skill}
              state={endpoints.skill}
              onRun={testSkill}
              t={t}
            />
          </div>
        </section>
      </Container>
    </div>
  )
}
