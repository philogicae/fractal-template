/**
 * Internationalization - single registry.
 *
 * Add a locale in two steps: create `./dictionaries/<code>.json` (copying
 * the shape of `en.json`, including `meta.{flag,native}`), then add a
 * static import and one entry in the `dictionaries` map below. Everything
 * else (`Locale`, `locales`, `localeMeta`, `hasLocale`, `getDictionary`,
 * the `LanguageSwitcher`) derives from that map.
 */

import ar from "./dictionaries/ar.json"
import de from "./dictionaries/de.json"
import en from "./dictionaries/en.json"
import es from "./dictionaries/es.json"
import fr from "./dictionaries/fr.json"
import it from "./dictionaries/it.json"
import ja from "./dictionaries/ja.json"
import ko from "./dictionaries/ko.json"
import pt from "./dictionaries/pt.json"
import ro from "./dictionaries/ro.json"
import ru from "./dictionaries/ru.json"
import zh from "./dictionaries/zh.json"

// Sorted by total speakers (most spoken to least spoken):
// en ~1.5B, zh ~1.1B, es ~500M, ar ~420M, fr ~300M, pt ~260M, ru ~260M,
// ja ~125M, de ~95M, ko ~80M, it ~65M, ro ~24M
const dictionaries = {
  en,
  zh,
  es,
  ar,
  fr,
  pt,
  ru,
  ja,
  de,
  ko,
  it,
  ro,
} as const satisfies Record<string, Dictionary>

export type Locale = keyof typeof dictionaries
export type Dictionary = typeof en
export type LocaleMeta = Dictionary["meta"]

export const locales = Object.keys(dictionaries) as readonly Locale[]
export const defaultLocale: Locale = "en"

/** Per-locale display metadata extracted from each dict's `meta` field. */
export const localeMeta = Object.fromEntries(
  Object.entries(dictionaries).map(([code, dict]) => [code, dict.meta])
) as Record<Locale, LocaleMeta>

export function hasLocale(value: string): value is Locale {
  return value in dictionaries
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}
