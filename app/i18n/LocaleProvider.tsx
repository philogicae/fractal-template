"use client"

import { useRouter } from "next/navigation"
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useTransition,
} from "react"
import { setLocaleAction } from "./actions"
import type { Dictionary, Locale } from "./config"

interface LocaleContextValue {
  locale: Locale
  dict: Dictionary
  setLocale: (locale: Locale) => void
  isPending: boolean
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

/**
 * Bridges the server-resolved `{ locale, dict }` into client components.
 * `setLocale` persists the choice (Server Action) then refreshes RSCs so
 * the whole tree re-renders with the new dictionary - no page reload.
 */
export function LocaleProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale
  dict: Dictionary
  children: React.ReactNode
}): React.ReactElement {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const setLocale = useCallback(
    (next: Locale): void => {
      if (next === locale) return
      startTransition(async () => {
        await setLocaleAction(next)
        router.refresh()
      })
    },
    [locale, router]
  )

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, dict, setLocale, isPending }),
    [locale, dict, setLocale, isPending]
  )

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  )
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    throw new Error("useLocale must be used within <LocaleProvider>")
  }
  return ctx
}

/** Sugar for the common case of only needing the dictionary. */
export function useDict(): Dictionary {
  return useLocale().dict
}
