"use client"

import { Container } from "@components/Container"
import { siteConfig } from "@config/site"
import { useDict } from "@i18n/LocaleProvider"

/**
 * Shared site footer with meta links. Left side shows copyright,
 * right side shows credits link + social icons (GitHub, X).
 *
 * Client Component so the footer label can be read from the active
 * dictionary via `useDict()`.
 */
export function Footer({ year }: { year: number }): React.ReactElement {
  const dict = useDict()
  const github = siteConfig.social.find((s) => s.label === "GitHub")
  const x = siteConfig.social.find((s) => s.label === "X")

  return (
    <footer className="relative bg-(--color-bg-primary)/60 backdrop-blur-sm">
      <Container size="full" className="py-1 sm:py-1.5 md:py-2">
        <div className="flex items-center justify-between gap-2 text-[9px] sm:text-[11px] md:text-xs text-(--color-text-muted)">
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
            <span>
              &copy; {year} {siteConfig.author}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <a
              href={siteConfig.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-(--color-text-primary) transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-(--color-accent-primary)"
                aria-hidden="true"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              <span>{dict.footer.credits}</span>
            </a>
            <a
              href={github?.href ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-(--color-text-primary) transition-colors p-0.5"
            >
              <span className="sr-only">{github?.label ?? "GitHub"}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a
              href={x?.href ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-(--color-text-primary) transition-colors p-0.5"
            >
              <span className="sr-only">{x?.label ?? "X"}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </Container>
    </footer>
  )
}
