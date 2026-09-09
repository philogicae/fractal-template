import "server-only"
import { cookies, headers } from "next/headers"
import {
  type Dictionary,
  getDictionary,
  hasLocale,
  type Locale,
} from "./config"
import { getLocaleFromAcceptLanguage } from "./get-locale"

/** Conventional cookie name - proxies / CDNs can vary cache on it. */
export const LOCALE_COOKIE = "NEXT_LOCALE"

/** Resolve locale: `NEXT_LOCALE` cookie → `Accept-Language` → default. */
export async function getCurrentLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const stored = cookieStore.get(LOCALE_COOKIE)?.value
  if (stored && hasLocale(stored)) return stored
  const headerList = await headers()
  return getLocaleFromAcceptLanguage(headerList.get("accept-language"))
}

/** Convenience: resolve the current locale and load its dictionary. */
export async function getCurrentDictionary(): Promise<{
  locale: Locale
  dict: Dictionary
}> {
  const locale = await getCurrentLocale()
  return { locale, dict: getDictionary(locale) }
}
