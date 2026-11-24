# Fractal Template

[![Node](https://img.shields.io/badge/node-26%2B-blue)](https://nodejs.org)
[![pnpm](https://img.shields.io/badge/pnpm-12%2B-blue)](https://pnpm.io)
[![Actions status](https://github.com/philogicae/fractal-template/actions/workflows/ci-cd.yml/badge.svg?cache-control=no-cache)](https://github.com/philogicae/fractal-template/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/philogicae/fractal-template)

A modern Next.js template with HeroUI, Tailwind CSS, TypeScript, Biome, and a provider-based i18n layer.

## Features

- **Next.js 16** - App Router, React Server Components, Turbopack
- **React 19** - `useTransition`, `useSyncExternalStore`, `useEffectEvent`
- **TypeScript** - strict mode, typed dictionaries, checked indexed access
- **Tailwind CSS 4** - CSS-first tokens, no `tailwind.config`
- **HeroUI v3** - accessible components
- **Zustand** - small stores read through selectors, no middleware required
- **State model** - discriminated unions, derived values, request-id race guards (see [`AGENTS.md`](./AGENTS.md#state-model))
- **Dark mode** - `next-themes`, dark by default, FOUC-safe first paint (see [`DESIGN.md`](./DESIGN.md))
- **i18n** - server-resolved locale (cookie + `Accept-Language`), no `[lang]` segment, 12 locales shipped
- **Tests** - Vitest + jsdom with a 100 % coverage gate
- **Biome 2** - lint + format
- **Production-ready** - standalone Docker image, GitHub Actions CI, security headers, AVIF/WebP images, long-term static caching
- **Agent-ready** - [`AGENTS.md`](./AGENTS.md), [`SKILL.md`](./SKILL.md), [`DESIGN.md`](./DESIGN.md), [`CHECKLIST.md`](./CHECKLIST.md), and a live `/skill.md` route

## Quick start

Requirements: **Node.js 26+** and **pnpm 12+** (the exact pnpm version is pinned by `packageManager` in `package.json`).

```bash
git clone https://github.com/philogicae/fractal-template.git my-project
cd my-project
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Dev server with Turbopack on `0.0.0.0:3000` |
| `pnpm build` | Production build |
| `pnpm start` | Production server |
| `pnpm lint` | Biome check + auto-fix (`app/` only) |
| `pnpm test` | Vitest run |
| `pnpm test:coverage` | Vitest run with the 100 % coverage gate |
| `pnpm test:watch` | Vitest watch mode |
| `pnpm test:ui` | Vitest UI |
| `pnpm upgrade` | `pnpm update && pnpm prune` |
| `pnpm clean` | Remove `.next`/`out`/`node_modules` and reinstall |
| `pnpm repomix` | Markdown snapshot of the codebase for agents |

## Project structure

```
app/
├── api/hello/            # DEMO: GET/POST echo endpoint
├── skill.md/             # Serves SKILL.md at /skill.md (HTML for browsers, markdown for agents)
├── components/           # Shared UI, imported per file (no barrel)
├── config/site.ts        # Brand, nav, socials, theme colors
├── i18n/                 # Locale registry, dictionaries, server helpers, client provider
├── layout/               # Navbar, Footer
├── playground/           # DEMO: endpoint + state playground (page.tsx, state.ts)
├── stores/counter.ts     # DEMO: Zustand store
├── test/                 # act/createRoot harness and LocaleProvider wrappers
├── utils/                # tw, debounce, media-query, click-outside, hydration
├── globals.css           # Design tokens
├── layout.tsx            # Root layout (locale, fonts, metadata, analytics)
├── providers.tsx         # next-themes + LocaleProvider
├── page.tsx              # Landing page
├── error.tsx             # Error boundary
├── loading.tsx           # Loading skeleton
├── not-found.tsx         # 404
└── sitemap.ts            # Sitemap
vitest.config.js          # jsdom, tsconfig paths, vmThreads pool, 100 % coverage
```

Tests live next to the code as `*.test.ts(x)`.

## Architecture

- **Server first.** Pages are Server Components; `"use client"` is limited to interactive leaves (navbar, switcher, toggle, playground) and providers.
- **One owner per fact.** Server data comes from RSC loaders, URL state from `searchParams`, transient UI from local state, shared client state from a store. No effects that copy values between owners.
- **State model.** Mutually exclusive states are discriminated unions; async results carry a request id so a stale response cannot overwrite a newer one. Reference: `app/playground/state.ts`. Details: [`AGENTS.md`](./AGENTS.md#state-model).
- **i18n.** `app/layout.tsx` resolves the locale from the `NEXT_LOCALE` cookie, then `Accept-Language`, then `defaultLocale`, and passes the typed dictionary to `<Providers>`. Client components read `useDict()`; Server Components read `getCurrentDictionary()`. The language switcher calls `setLocaleAction` then `router.refresh()` inside a transition.
- **Design tokens.** `app/globals.css` is the implementation, [`DESIGN.md`](./DESIGN.md) is the documentation. Keep them in sync.

## Customization

Start with [`CHECKLIST.md`](./CHECKLIST.md) - it is the tickable source of truth for turning the template into a product. The conventions you need to execute it are in [`AGENTS.md`](./AGENTS.md).

The main entry points:

- `app/config/site.ts` - name, description, URL, keywords, theme colors, nav (`labelKey`, not labels), socials.
- `app/i18n/dictionaries/*.json` - all user-visible copy. Delete locales you do not need; add one JSON + one registry entry to add a locale.
- `app/globals.css` + [`DESIGN.md`](./DESIGN.md) - palette, typography, spacing, radii, shadows.
- `app/page.tsx` - landing hero and demos.
- `public/images/*`, `public/favicon.ico`, `public/robots.txt`.

### Path aliases

```json
"@components/*": ["./app/components/*"],
"@config/*":     ["./app/config/*"],
"@i18n/*":       ["./app/i18n/*"],
"@layout/*":     ["./app/layout/*"],
"@stores/*":     ["./app/stores/*"],
"@utils/*":      ["./app/utils/*"]
```

No barrel exports: import the file (`@components/Container`, `@stores/counter`).

### HeroUI notes

- Button variants: `primary` (default), `secondary`, `tertiary`, `outline`, `ghost`, `danger`, `danger-soft`.
- `Button` has **no** loading/pending prop. Track pending yourself and pass `isDisabled`, plus your own label or spinner.
- Card parts: `CardHeader`, `CardContent`, `CardFooter` (no `CardBody`).

### Utilities

- `cn()` - Tailwind-aware class merge.
- `useMediaQuery`, `useBreakpoint` - `useSyncExternalStore`-backed.
- `useDebounce`, `useDebouncedCallback`, `useDebounceState`.
- `useClickOutside(isOpen, elementIds, onClose)` - pass the panel **and** trigger ids.
- `useIsClient()` - `false` during SSR/hydration, `true` afterwards.

## Demo surface

`/playground` exercises `/api/hello` and `/skill.md`, plus the Zustand counter. Remove it when starting a product:

- `app/playground/`
- `app/api/hello/`
- `app/stores/counter.ts`
- `app/components/FeatureCard.tsx` if unused
- `app/components/StatusBadge.tsx` (only consumed by the playground)
- the `/playground` nav entry and the matching landing-page CTAs

## Deployment

### Docker

The `Dockerfile` is a multi-stage build (`base` → `deps` → `builder` → `runner`) on `platformatic/node-caged:26-alpine`, serving the standalone bundle with `node server.js` as a non-root user with a `HEALTHCHECK`.

```bash
docker compose up --build   # http://localhost:3000
```

`compose.yaml` reads `DOCKER_PROJECT_NAME` and `DOCKER_PORT` from `.env` (defaults: `fractal-template`, `3000`).

### CI

`.github/workflows/ci-cd.yml` runs `lint` (`pnpm biome ci app`) → `build` → `tests` (`pnpm test:coverage`, coverage table in the job summary) on every push.

### Production hardening (`next.config.mjs`)

- Security headers: HSTS, X-DNS-Prefetch-Control, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy.
- Images: AVIF/WebP, 24 h cache, strict per-image CSP for SVG.
- `output: "standalone"` off Vercel, `optimizePackageImports` for HeroUI, compression, 1-week `/images` and `/fonts` caching.
- No page-level CSP is set - add one if your app needs it.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `VERCEL` | Set automatically by Vercel; gates Analytics/SpeedInsights and disables `output: "standalone"` |
| `CF_WEB_ANALYTICS_TOKEN` | Optional; enables the Cloudflare Web Analytics beacon |
| `DOCKER_PROJECT_NAME` / `DOCKER_PORT` | Consumed by `compose.yaml` |

No other variable is read by the code. Add yours to [`.env.example`](./.env.example) and to this table.

## Documentation map

| File | Audience | Contents |
| --- | --- | --- |
| [`README.md`](./README.md) | Humans | Overview, setup, deployment |
| [`AGENTS.md`](./AGENTS.md) | Agents in the repo | Conventions, state model, tasks, tests |
| [`SKILL.md`](./SKILL.md) | Agents bootstrapping | Clone → customize → hand off (served at `/skill.md`) |
| [`CHECKLIST.md`](./CHECKLIST.md) | Agents bootstrapping | Tickable customization progress |
| [`DESIGN.md`](./DESIGN.md) | Designers/devs | Full token and component reference |
| [`CHANGELOG.md`](./CHANGELOG.md) | Maintainers | Generated by git-cliff (`cliff.toml`) |

## License

MIT License
