"use client"

import { useSyncExternalStore } from "react"

/** `false` on the server and during hydration, `true` once the client owns the tree. */
export function useIsClient(): boolean {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)
}

function subscribe(): () => void {
  return () => {}
}

function getClientSnapshot(): boolean {
  return true
}

function getServerSnapshot(): boolean {
  return false
}
