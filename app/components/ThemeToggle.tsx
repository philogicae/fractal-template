"use client"

import { useDict } from "@i18n/LocaleProvider"
import { useIsClient } from "@utils/hydration"
import { cn } from "@utils/tw"
import { useTheme } from "next-themes"

function SunIcon({ className }: { className?: string }): React.ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(className)}
    >
      <title>Sun icon</title>
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function MoonIcon({ className }: { className?: string }): React.ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(className)}
    >
      <title>Moon icon</title>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

/**
 * Toggles between light and dark themes via `next-themes`, which handles
 * class application, localStorage persistence, and pre-hydration FOUC
 * prevention.
 *
 * Styling respects template design system:
 * - Dark mode: Neon lime accent for sun, cyan for moon
 * - Light mode: Turquoise accent
 * - Hover: text-primary bg + bg-primary icon (swapped colors)
 */
export function ThemeToggle(): React.ReactElement {
  const { resolvedTheme, setTheme } = useTheme()
  const isClient = useIsClient()
  const dict = useDict()

  const isDark = isClient && resolvedTheme === "dark"
  const Icon = isDark ? SunIcon : MoonIcon
  const label = isDark
    ? dict.nav.themeToLight
    : isClient
      ? dict.nav.themeToDark
      : dict.nav.themeToggle

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      className={cn(
        "theme-toggle",
        "inline-flex items-center justify-center h-6 w-6 sm:h-8 sm:w-8 min-w-0 rounded-lg",
        "text-(--color-accent-primary)",
        "transition-colors",
        "dark:hover:bg-(--color-ghost-white) dark:hover:text-(--color-pitch-black)",
        "hover:bg-(--color-pitch-black) hover:text-(--color-ghost-white)"
      )}
    >
      <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
    </button>
  )
}
