"use client"

import { useCallback, useSyncExternalStore } from "react"

/**
 * useMediaQuery Hook
 *
 * Reactively tracks CSS media query matches using `useSyncExternalStore`,
 * which avoids an initial-render hydration mismatch and gets the correct
 * client value on the first paint.
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)')
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
 *
 * @param query - CSS media query string
 * @returns Boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(query)
      media.addEventListener("change", onChange)
      return () => media.removeEventListener("change", onChange)
    },
    [query]
  )

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query]
  )

  // Server snapshot: conservatively `false` - components should not render
  // breakpoint-dependent markup on the server.
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}

/**
 * Predefined breakpoint queries for common use cases
 */
export const breakpoints = {
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
} as const

/**
 * useBreakpoint Hook
 *
 * Convenience hook for tracking common breakpoints.
 *
 * @example
 * const isMd = useBreakpoint('md')
 * const isDesktop = useBreakpoint('lg')
 */
export function useBreakpoint(breakpoint: keyof typeof breakpoints): boolean {
  return useMediaQuery(breakpoints[breakpoint])
}
