"use client"

import { type Locale, localeMeta, locales } from "@i18n/config"
import { useLocale } from "@i18n/LocaleProvider"
import { useClickOutside } from "@utils/click-outside"
import { cn } from "@utils/tw"
import { useCallback, useState } from "react"

/**
 * Navbar locale picker. Reads from `useLocale()` and persists the choice
 * via `setLocale` → Server Action → RSC refresh.
 *
 * Custom dropdown implementation that floats over content.
 * Styled with template design system:
 * - Dark mode: Graphite surfaces with neon lime accents
 * - Light mode: Azure mist surfaces with turquoise accents
 */
export function LanguageSwitcher(): React.ReactElement {
  const { locale, setLocale, dict, isPending } = useLocale()
  const current = localeMeta[locale]
  const [open, setOpen] = useState(false)

  useClickOutside(open, ["lang-dropdown", "lang-switcher-trigger"], () =>
    setOpen(false)
  )

  const handleSelect = useCallback(
    (loc: Locale) => {
      setLocale(loc)
      setOpen(false)
    },
    [setLocale]
  )

  const toggle = useCallback(() => setOpen((v) => !v), [])

  return (
    <div className="relative">
      <button
        type="button"
        id="lang-switcher-trigger"
        disabled={isPending}
        aria-label={`${dict.nav.language}: ${current.native}`}
        aria-expanded={open}
        onClick={toggle}
        className={cn(
          "lang-switcher",
          "inline-flex items-center justify-center h-6 w-6 sm:h-8 sm:w-8 rounded-lg text-sm sm:text-base leading-none",
          "text-(--color-accent-primary)",
          "transition-colors disabled:opacity-50"
        )}
      >
        <span aria-hidden="true">{current.flag}</span>
      </button>

      {open && (
        <div
          id="lang-dropdown"
          className={cn(
            "absolute top-[calc(100%+8px)] right-0 min-w-[160px]",
            "bg-(--color-bg-secondary) border border-(--color-border-default)",
            "rounded-(--radius-cards) shadow-lg z-50 p-1"
          )}
        >
          <ul aria-label={dict.nav.language} className="flex flex-col gap-0.5">
            {locales.map((loc: Locale) => {
              const meta = localeMeta[loc]
              const isActive = loc === locale
              return (
                <li key={loc}>
                  <button
                    type="button"
                    onClick={() => handleSelect(loc)}
                    className={cn(
                      "w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-xs cursor-pointer outline-none text-left",
                      isActive
                        ? "bg-(--color-bg-elevated) text-(--color-text-primary)"
                        : "text-(--color-text-secondary) hover:text-(--color-ghost-white) hover:bg-(--color-pitch-black) dark:hover:bg-(--color-ghost-white) dark:hover:text-(--color-pitch-black)"
                    )}
                  >
                    <span aria-hidden="true" className="text-base leading-none">
                      {meta.flag}
                    </span>
                    <span>{meta.native}</span>
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="ml-auto text-(--color-accent-primary)"
                      >
                        ✓
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
