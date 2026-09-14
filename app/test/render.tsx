import { defaultLocale, getDictionary, type Locale } from "@i18n/config"
import { LocaleProvider } from "@i18n/LocaleProvider"
import { type ProbeHandle, renderProbe } from "./react"

export { type ProbeHandle, renderProbe } from "./react"

/**
 * Wrap `ui` in a real `LocaleProvider` so dictionary consumers
 * (`useDict`, `useLocale`) render without prop drilling. Use this to
 * re-render a provider-wrapped tree through `probe.render`.
 *
 * Callers must mock `next/navigation` (the provider calls `useRouter`)
 * and, when they trigger `setLocale`, `@i18n/actions`.
 */
export function withLocale(
  ui: React.ReactElement,
  locale: Locale = defaultLocale
): React.ReactElement {
  return (
    <LocaleProvider locale={locale} dict={getDictionary(locale)}>
      {ui}
    </LocaleProvider>
  )
}

/** Mount `ui` inside a real `LocaleProvider`. */
export function renderWithLocale(
  ui: React.ReactElement,
  locale: Locale = defaultLocale
): ProbeHandle {
  return renderProbe(withLocale(ui, locale))
}
