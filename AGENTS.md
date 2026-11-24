# AGENTS.md

> **Audience.** Agents working inside a repository cloned from `philogicae/fractal-template`, customizing it into a product.
>
> **Keep this file current.** When you remove demo code, add a route/store/component/env variable, or change a convention, update the matching section here in the same commit.
>
> **Progress tracking lives in [`CHECKLIST.md`](./CHECKLIST.md)** - the only source of truth for what remains to customize. This file covers conventions and patterns, not the task list. Delete `CHECKLIST.md` once every box is ticked.
>
> **Design reference:** [`DESIGN.md`](./DESIGN.md) (tokens, typography, components).

## Project overview

- **Framework**: Next.js 16 (App Router, Turbopack)
- **UI**: HeroUI v3 (`@heroui/react` 3.2.x)
- **Styling**: Tailwind CSS v4 (CSS-first, via `@tailwindcss/postcss`)
- **State**: Zustand for shared client facts; local state/reducers for the rest (see [State model](#state-model))
- **Lint/format**: Biome 2
- **Package manager**: pnpm 12 (pinned via `packageManager`)
- **Tests**: Vitest 5 + jsdom, 100 % coverage gate
- **i18n**: provider-based (cookie + `Accept-Language`), no URL locale segment. 12 locales ship (`en`, `zh`, `es`, `ar`, `fr`, `pt`, `ru`, `ja`, `de`, `ko`, `it`, `ro`). **All user-visible text must use i18n**
- **Theme**: `next-themes`, dark by default, light mode one toggle away

## Demo code to remove

These exist only to showcase the template:

- `app/playground/` - delete the whole directory (`page.tsx`, `state.ts`, tests)
- `app/api/hello/` - delete or replace with real endpoints
- `app/stores/counter.ts` and its test
- `app/components/FeatureCard.tsx` if unused; `app/components/StatusBadge.tsx` only with the playground (it has no other consumer)
- the `/playground` entry in `siteConfig.nav` (`app/config/site.ts`); the `/skill.md` entry goes only with the agent surface
- landing-page CTAs in `app/page.tsx` for the playground, SKILL.md, GitHub, or Vercel

Keep unless you have a reason to drop them:

- `app/skill.md/route.ts` - serves `SKILL.md` at `/skill.md` (HTML for browsers, raw markdown for agents/curl)
- `app/components/Container.tsx`, `Skeleton.tsx`, `ThemeToggle.tsx`, `LanguageSwitcher.tsx`
- `app/config/site.ts`, `app/providers.tsx`
- `app/utils/{tw,debounce,media-query,click-outside,hydration}.ts`
- `app/{error,loading,not-found}.tsx`
- `app/i18n/*` - core infrastructure. Drop a locale rather than ripping the system out.

**`SKILL.md` - rewrite by default, or delete.** Rewrite it so agents can interact with the shipped app through `/skill.md`: routes, API, auth, env variables, how to consume it. If there is no agent-facing surface, delete `SKILL.md`, `app/skill.md/`, the `/skill.md` nav entry, and any `/skill.md` CTA.

## Setup

Requirements: Node.js 26+, pnpm 12+. The CI and Dockerfile pin Node 26 and pnpm 12.23.0.

```bash
pnpm dev           # Turbopack, 0.0.0.0:3000
pnpm build         # production build
pnpm start         # production server
pnpm lint          # biome check --write app --unsafe
pnpm test          # vitest run
pnpm test:coverage # vitest run --coverage (100% thresholds)
pnpm test:watch    # watch mode
pnpm test:ui       # Vitest UI
pnpm upgrade       # pnpm update && pnpm prune
pnpm clean         # rimraf .next out node_modules && pnpm install
pnpm repomix       # markdown snapshot for agents
```

## Code style

**TypeScript**

- Strict mode, `noUncheckedIndexedAccess`, `noImplicitOverride`.
- Explicit return types on exported functions/components.
- `interface` for object shapes, `type` for unions.
- `const` by default; never `var`.

**Naming**

- Components: PascalCase (`Navbar.tsx`)
- Hooks: camelCase with `use` prefix
- Utilities / stores: camelCase

**Placement**

- Pages: `app/<route>/page.tsx`
- API: `app/api/<endpoint>/route.ts` (`GET`/`POST`/`PUT`/`DELETE`)
- Components: `app/components/` (import per file)
- Layout parts: `app/layout/`
- Config: `app/config/site.ts`
- Stores: `app/stores/`
- Utilities: `app/utils/`
- Pure state modules: colocated with their consumer (e.g. `app/playground/state.ts`)

**Formatting**

`pnpm lint` runs `biome check --write app --unsafe`. Run it before finishing.

## Component patterns

- Default to Server Components; add `"use client"` only for hooks, browser APIs, or event handlers. Keep the client boundary small.
- HeroUI v3:
  - Button variants: `primary` (default), `secondary`, `tertiary`, `outline`, `ghost`, `danger`, `danger-soft`.
  - `Button` has **no** loading/pending prop (3.2.x). Track pending yourself, pass `isDisabled`, render your own label/spinner.
  - Card parts: `CardHeader`, `CardContent`, `CardFooter` (no `CardBody`).
- Always use CSS variables, never raw hex or Tailwind palette classes (`text-emerald-500`). Use `cn()` from `@utils/tw`.

```tsx
<div className="bg-(--color-bg-primary) text-(--color-text-primary)">
  <span className="text-(--color-emerald)">Success</span>
  <span className="text-(--color-rose)">Error</span>
</div>
```

Common tokens:

```
Primitive: --color-pitch-black, --color-graphite, --color-slate-elevated,
           --color-neon-lime, --color-cyan-glow, --color-emerald,
           --color-amber, --color-rose, --color-electric-violet
Semantic:  --color-bg-primary/secondary/elevated/surface,
           --color-text-primary/secondary/muted/tertiary,
           --color-border-default/subtle/input
Accent:    --color-accent-primary/secondary/hover
```

## State model

- **Derive, don't store.** No `useState` for a value computable from props, other state, the URL, or a store. No effect whose only job is copying one value into another.
- **One owner per fact.** Server data: RSC. URL state: `searchParams`. Unsaved drafts: local state. Shared client facts: one store read through selectors.
- **Impossible states must not type-check.** Mutually exclusive UI states are one discriminated union (`idle | loading | success | error`), each variant carrying only its own data.
- **Async work has a validity rule.** Carry a request id (or `AbortSignal`); drop results from superseded requests in the reducer. Reference: `app/playground/state.ts` and its race test.
- **Use the platform primitive.** `useSyncExternalStore` for external systems (media query, hydration, browser APIs), `useTransition` for pending transitions, `useActionState` for forms.
- Reset a subtree with `key`; reset same-component state during render (see `Navbar`), not in an effect.

## Testing

- Vitest, jsdom, path aliases from `tsconfig.json`. Tests sit next to the code as `*.test.ts(x)`.
- Pool: `vmThreads`, `maxWorkers: 3`, so jsdom is created once per worker and vm contexts keep per-file isolation. Do not switch to `threads`/`forks` or `isolate: false` (mock identities leak across files).
- Coverage is enforced at **100 %** (statements, branches, functions, lines) with `all: true`. CI runs `pnpm test:coverage`, so an untested file or branch fails the build. Relax the thresholds only for code that cannot be meaningfully unit-tested.
- CI publishes the coverage table to the job summary via `.github/scripts/coverage-summary.mjs` (reads `json-summary`, emitted only when `process.env.CI` is set).
- Render tests use `app/test/react.tsx` (`renderProbe`, `act`/`createRoot`) and `app/test/render.tsx` (`withLocale`/`renderWithLocale`) - no `@testing-library`. Tests mock the Next pieces they need (`next/navigation`, `next/link`, `next/image`, `next/font/google`, `next/headers`, `@i18n/actions`).
- `server-only` is aliased to `app/test/stubs/server-only.ts`.
- `biome.json` disables `correctness/noComponentHookFactories` for test files: probes intentionally close over local spies.
- Node built-ins run outside the VM realm, so their errors fail `instanceof Error` under this pool. Use `Error.isError(error)`.
- Every utility, hook, route handler, component, and page gets a test defending its observable contract. Visual polish is verified in the browser.

## Project structure

```
app/
├── api/hello/            # DEMO endpoint (+ route.test.ts)
├── skill.md/             # /skill.md content negotiation (HTML vs markdown)
├── components/           # Container, Skeleton, ThemeToggle, LanguageSwitcher,
│                         #   FeatureCard (demo), StatusBadge (demo)
├── config/site.ts        # Brand, nav (labelKey), socials, theme colors
├── i18n/
│   ├── config.ts         # Locale, Dictionary, locales, localeMeta,
│   │                     #   hasLocale(), getDictionary()
│   ├── dictionaries/     # en.json default; each has meta { flag, native }
│   ├── get-locale.ts     # Accept-Language matcher (zero-dep)
│   ├── server.ts         # getCurrentLocale(), getCurrentDictionary()
│   ├── actions.ts        # setLocaleAction (NEXT_LOCALE cookie)
│   └── LocaleProvider.tsx# useLocale(), useDict()
├── layout/               # Navbar.tsx, Footer.tsx
├── playground/           # DEMO: page.tsx + state.ts (reducer) + tests
├── stores/counter.ts     # DEMO store
├── test/                 # react.tsx, render.tsx, stubs/server-only.ts
├── utils/                # tw, debounce, media-query, click-outside, hydration
├── globals.css           # Design tokens + component classes
├── layout.tsx            # Root layout: locale, fonts, metadata, analytics
├── providers.tsx         # next-themes + LocaleProvider
├── page.tsx              # Landing page
├── error.tsx / loading.tsx / not-found.tsx
└── sitemap.ts
vitest.config.js          # jsdom, tsconfig paths, vmThreads pool, coverage gate
next.config.mjs           # security headers, images, caching
```

Path aliases (`@components`, `@config`, `@i18n`, `@layout`, `@stores`, `@utils`). No barrel exports.

## Common tasks

**Add a page**

1. Create `app/<route>/page.tsx`.
2. Add a `siteConfig.nav` entry if it belongs in the header. Entries carry a `labelKey`; add the key to `NavLabelKey` and to `dict.nav` in every dictionary.
3. Localize copy: `getCurrentDictionary()` in Server Components, `useDict()` in Client Components.

**Add a locale**

1. Copy `en.json` to `app/i18n/dictionaries/<code>.json` and translate it. Update `meta.{flag,native}`.
2. Add one static import and one entry to the `dictionaries` map in `app/i18n/config.ts`.
3. `Locale`, `locales`, `localeMeta`, `hasLocale()`, `getDictionary()`, and the switcher derive from that map.

**Add an API route**

```ts
// app/api/<endpoint>/route.ts
export async function GET(): Promise<Response> {
  return Response.json({ ok: true })
}
```

**Create a store and read it**

```ts
export const useMyStore = create<State>()((set) => ({
  value: "",
  setValue: (value) => set({ value }),
}))

const value = useMyStore((state) => state.value) // selector: re-renders only on change
```

**SEO**

Update `app/sitemap.ts` and `public/robots.txt` when routes change; keep `siteConfig.url` on the production domain. Base metadata lives in `app/layout.tsx`.

## Theme system

CSS variables live in `app/globals.css`. [`DESIGN.md`](./DESIGN.md) documents them - keep both in sync.

- `next-themes` via `app/providers.tsx` (`attribute="class"`, `defaultTheme="dark"`, `enableSystem={false}`, `disableTransitionOnChange`), persisted in `localStorage` (`theme`).
- `ThemeToggle` uses `resolvedTheme` + `setTheme`; `useIsClient()` avoids hydration branching.
- `html` / `html.dark` backgrounds match the first paint (no flash). Dark is always the default; `prefers-color-scheme` is never consulted.
- Animations (`fade-in-up`, `fade-in`) and the `prefers-reduced-motion` override live in `globals.css`.

## Utilities

```ts
import { cn } from "@utils/tw"
import { useMediaQuery, useBreakpoint } from "@utils/media-query"
import { useDebounce, useDebouncedCallback, useDebounceState } from "@utils/debounce"
import { useClickOutside } from "@utils/click-outside"
import { useIsClient } from "@utils/hydration"
```

- `useClickOutside(isOpen, elementIds, onClose)` - closes on `Escape` or pointer-down outside every listed id. Pass **both** the panel and the trigger, or the trigger click re-opens the menu. Used by `LanguageSwitcher` and the `Navbar` mobile menu.
- `useIsClient()` - `false` during SSR/hydration, `true` after. Use instead of `useState(false)` + `useEffect(setMounted)`.

## Performance

- Server Components by default; small client boundaries.
- `memo()` / `useCallback` / `useMemo` only for measured cost - not for zero-prop or stable-prop components.
- Select Zustand state with a selector.
- `next.config.mjs`: standalone output (off Vercel), `optimizePackageImports` (HeroUI), AVIF/WebP with a strict image CSP, compression, 1-week `/images` + `/fonts` caching, 6 security headers. No page-level CSP - add one if needed.
- `Dockerfile`: multi-stage, standalone bundle, non-root user, `HEALTHCHECK`.
- CI on every push: `lint` → `build` → `tests`. The lint job runs `pnpm biome ci app` (check only, stricter than local `pnpm lint`).

## Environment variables

Only these are consumed today (also listed in `.env.example` and `README.md`):

- `VERCEL` - auto-set by Vercel; gates Analytics/SpeedInsights and disables `output: "standalone"`.
- `CF_WEB_ANALYTICS_TOKEN` - optional; enables the Cloudflare beacon in `app/layout.tsx`.
- `DOCKER_PROJECT_NAME` / `DOCKER_PORT` - consumed by `compose.yaml`.

When you add a variable: read it, document it in `.env.example`, `README.md`, and this list.

## References

- [Next.js](https://nextjs.org/docs)
- [HeroUI](https://www.heroui.com/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Zustand](https://zustand.docs.pmnd.rs/)
- [Biome](https://biomejs.dev/)
- [AGENTS.md standard](https://agents.md/)
- [`DESIGN.md`](./DESIGN.md)
