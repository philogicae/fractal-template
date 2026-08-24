"use client"

import type { Dictionary, Locale } from "@i18n/config"
import { LocaleProvider } from "@i18n/LocaleProvider"
import { ThemeProvider } from "next-themes"

/**
 * Client-side providers tree.
 *
 * - `next-themes` toggles the `dark` class on `<html>` and injects its own
 *   pre-hydration script to prevent FOUC. HeroUI v3 reads theme via the
 *   same class, so no dedicated provider is needed.
 * - `LocaleProvider` exposes `{ locale, dict, setLocale }` via context to
 *   every Client Component — no URL segment, no prop drilling.
 *
 * See https://beta.heroui.com/docs/customization/dark-mode
 */
export function Providers({
  locale,
  dict,
  children,
}: {
  locale: Locale
  dict: Dictionary
  children: React.ReactNode
}): React.ReactElement {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <LocaleProvider locale={locale} dict={dict}>
        {children}
      </LocaleProvider>
    </ThemeProvider>
  )
}
