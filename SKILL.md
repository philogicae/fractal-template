---
name: fractal-template-bootstrap
description: Bootstrap skill for starting a new project from the philogicae/fractal-template. Use when a user asks to scaffold a new webapp. Covers cloning, the folder layout, what must be customized/deleted, and the template's conventions.
license: MIT
notes: Content negotiation - Returns raw markdown for agents/curl (detected via User-Agent). Returns styled HTML for browsers. Use '?raw=1' query parameter to force raw markdown (e.g., /skill.md?raw=1).
metadata:
  author: philogicae
  version: "0.0.0-auto-synced"
  template-type: nextjs
  source: https://github.com/philogicae/fractal-template
  live-demo: https://fractal-template.binaryeyelabs.xyz
  stack:
    - Next.js 16 (App Router, Turbopack)
    - React 19
    - TypeScript (strict)
    - Tailwind CSS v4 (CSS-first)
    - HeroUI v3
    - Zustand (+ persist)
    - Biome
  features:
    - App Router + React Server Components
    - Internationalization via a server-resolved locale (`NEXT_LOCALE` cookie + `Accept-Language`) and a client `LocaleProvider` — **no `[lang]` URL segment**. Ships with 12 locales (`en`, `zh`, `es`, `ar`, `fr`, `pt`, `ru`, `ja`, `de`, `ko`, `it`, `ro`); delete the ones you don't need when customizing, add more only when needed. **All user-visible text must use i18n** — no hardcoded strings in components
    - Dark mode via `next-themes` with FOUC prevention (theme-aware html background)
    - Mobile-first responsive layout
    - Error boundary, loading (Skeleton-based) and 404 pages
    - Debounce hooks, `useSyncExternalStore`-backed media-query hook
    - Security headers, AVIF/WebP image optimization with strict SVG CSP
    - Site-wide config at `app/config/site.ts` as single source of truth
    - Multi-stage Dockerfile with Next.js standalone output
    - Pre-configured design system with dark/light modes — see [`DESIGN.md`](./DESIGN.md) for complete reference
---

# Fractal Template — Bootstrap Skill

> **Audience.** AI agents spinning up a **new project** from `philogicae/fractal-template`. This document is self-contained: it covers both the bootstrap steps and the conventions the agent needs to customize the repo correctly.

## 1. Clone and install

```bash
git clone https://github.com/philogicae/fractal-template.git <project-name>
cd <project-name>
rm -rf .git && git init
pnpm install
pnpm dev           # http://localhost:3000
```

Requirements: **Node.js 24+**, **pnpm 11+**, modern browser.

## 2. Repository tour

```
<project-name>/
├── app/
│   ├── api/
│   │   └── hello/               # DEMO endpoint — delete or replace
│   ├── skill.md/                # Route that serves SKILL.md raw — KEEP
│   ├── components/              # Shared UI (no barrel — import per file)
│   │   ├── Container.tsx        # Keep (generic width wrapper)
│   │   ├── FeatureCard.tsx      # DEMO — delete if unused
│   │   ├── LanguageSwitcher.tsx # Keep (locale dropdown)
│   │   ├── Skeleton.tsx         # Keep (themed pulse placeholder)
│   │   ├── StatusBadge.tsx      # DEMO — delete if unused
│   │   └── ThemeToggle.tsx      # Keep (uses next-themes)
│   ├── config/                  # Site-wide config (single source of truth)
│   │   └── site.ts              # Name, description, nav (labelKey), socials, theme colors
│   ├── i18n/                    # Internationalization (provider-based, no URL segment)
│   │   ├── config.ts            # SINGLE REGISTRY: Locale, Dictionary, locales,
│   │   │                        # localeMeta, hasLocale(), getDictionary()
│   │   ├── dictionaries/        # en.json (default). Delete extra locales when customizing;
│   │   │                        # add more only when needed. Each ships `meta: { flag, native }`
│   │   ├── get-locale.ts        # Zero-dep Accept-Language matcher
│   │   ├── server.ts            # getCurrentLocale(), getCurrentDictionary()
│   │   ├── actions.ts           # setLocaleAction Server Action (NEXT_LOCALE cookie)
│   │   └── LocaleProvider.tsx   # Client context: useLocale(), useDict()
│   ├── layout/                  # Navbar.tsx (with LanguageSwitcher), Footer.tsx — driven by `@config/site`
│   ├── stores/                  # Zustand (no barrel — import per file)
│   │   └── counter.ts           # DEMO — delete
│   ├── utils/                   # cn(), debounce, media-query, click-outside — Keep
│   ├── playground/              # DEMO page — DELETE
│   ├── globals.css              # Design tokens — CUSTOMIZE
│   ├── layout.tsx               # Root layout + metadata — CUSTOMIZE
│   ├── providers.tsx            # Client providers (next-themes) — Keep
│   ├── page.tsx                 # Landing page — REPLACE
│   ├── error.tsx / loading.tsx / not-found.tsx   # Keep, restyle
├── public/                      # favicon, logo, manifest, robots — REPLACE
├── .env.example                 # Customize variables
├── next.config.mjs              # Security headers, image formats — review
├── biome.json                   # Lint/format config
├── package.json                 # name/description/repo — CUSTOMIZE
├── Dockerfile / compose.yaml    # Ready to use — override names/port via .env
├── README.md                    # REWRITE for the new project
├── AGENTS.md                    # In-repo agent conventions — keep in sync as you modify the project
├── SKILL.md                     # REWRITE to describe the new app (see §5) or delete if the app needs no agent surface
├── CHECKLIST.md                 # Tickable bootstrap checklist — delete once every box is ticked
├── DESIGN.md                    # Complete design system reference
└── vitest.config.js             # Test runner configuration
```

**Path aliases** (`tsconfig.json`):

```json
"@components/*": ["./app/components/*"],
"@config/*":     ["./app/config/*"],
"@i18n/*":       ["./app/i18n/*"],
"@layout/*":     ["./app/layout/*"],
"@stores/*":     ["./app/stores/*"],
"@utils/*":      ["./app/utils/*"]
```

> No barrel exports. Every import targets a specific file (`@components/Container`, `@stores/counter`, `@layout/Navbar`, ...).

## 3. Customization checklist

**Use `CHECKLIST.md` at the repo root — do not work from a list in this
document.** `CHECKLIST.md` is the single, tickable source of truth for
every customization step (identity & metadata, public assets, layout /
chrome, landing page, design tokens, internationalization, demo-code
deletions, environment & infrastructure, documentation, sanity checks). Work
through it top-to-bottom and tick boxes as you go so the next session
sees exactly what is left.

This skill covers the **conventions** needed to carry out those steps
correctly (i18n wiring, `siteConfig` as the identity single-source-of-truth,
nav `labelKey` contract, common tasks); the project-wide instructions below
support that work. For the task list itself, switch to `CHECKLIST.md`.

### Conventions worth knowing up front

- `app/config/site.ts` is the identity single source of truth; `app/layout.tsx` metadata, `Navbar`, `Footer`, and landing-page CTAs all derive from it.
- User-visible copy lives in `app/i18n/dictionaries/*.json`, **not** in JSX. The `Dictionary` type is inferred from `en.json`; keep keys in sync across locales or TypeScript fails.
- **Add a locale:** create `app/i18n/dictionaries/<code>.json` (including `meta.{flag,native}`), then add one static import + one entry in the `dictionaries` map in `app/i18n/config.ts`. **Drop a locale:** delete the JSON and remove its import + map entry. Everything else derives from that map.
- Nav entries in `app/config/site.ts` carry a `labelKey` — add the matching key to `NavLabelKey` and to `dict.nav` in every locale file when adding / renaming one.
- Read the dictionary via `useDict()` (`@i18n/LocaleProvider`) on the client and `getCurrentDictionary()` (`@i18n/server`) on the server. Both resolve the same active locale.
- `public/images/` ships **empty**; supply `favicon.ico`, `logo.gif`, `apple-touch-icon.png`, `192x192.png`, `512x512.png`, `screenshot.jpeg` or the references in `layout.tsx`, `Navbar.tsx`, and `manifest.json` will 404.

## 4. Delete demo-only code

These files exist only to showcase the template. Remove them before writing product code, unless the user explicitly wants them kept:

- `app/playground/` — full directory.
- `app/api/hello/` — replace with real endpoints or delete.
- `app/stores/counter.ts`.
- `app/components/FeatureCard.tsx`, `app/components/StatusBadge.tsx` (only if not reused). `Skeleton.tsx` is not demo — keep it.
- The "Try the Playground" / "Read SKILL.md" / "View on GitHub" / "Deploy to Vercel" buttons in `app/page.tsx`.
- The `/skill.md` and `/playground` entries in `siteConfig.nav` (`app/config/site.ts`).

Keep the `app/skill.md/route.ts` handler — it is the delivery mechanism for the rewritten `SKILL.md` (see §5).

## 5. Rewrite `SKILL.md` for the new project (default) — or delete it

**Default path.** After customization, **this file must be rewritten** so agents can interact with the shipped application through `/skill.md`. Its new purpose is to describe the app — its routes, API, auth, and how an agent should consume it — not how to install the template.

**Opt-out.** If the project has no agent-facing surface and the user does not want one, delete instead:

- this `SKILL.md` file,
- the `app/skill.md/` route handler,
- the `/skill.md` entry in `siteConfig.nav` (`app/config/site.ts`),
- any landing-page button that links to `/skill.md` in `app/page.tsx`.

Suggested structure when rewriting:

```markdown
---
name: <project-name>
description: <what the app does, who it is for>
---

# <Project name>

## Overview

Short description of the product and its primary users.

## Routes

- `/` — <purpose>
- `/<route>` — <purpose>

## API

- `GET /api/<endpoint>` — params, response shape, auth
- `POST /api/<endpoint>` — body, response shape

## Data model / state

- Zustand stores and what they own
- External data sources, DB, third-party APIs

## Environment variables

List every required variable with a one-line description.

## How an agent should interact with the app

- Preferred endpoints for programmatic use
- Auth flow
- Rate limits, error shapes
```

**`AGENTS.md` must be kept in sync throughout customization** — not as a one-shot pass at the end. As soon as you remove the playground / counter store / demo components, drop them from the "Demo code to remove" list; as soon as you add new routes, stores, or env variables, record them in the relevant sections so the next agent reading `AGENTS.md` sees an accurate picture of the project.

## 6. Sanity checks before handing off

```bash
pnpm lint        # Biome auto-fix
pnpm build       # Production build must succeed
```

Grep for any leftover template branding:

```bash
rg -i "next\.js template|philogicae|fractal-template|playground|counter"
```

Every match should be intentional.

---

# Reference — template conventions

Quick reference for the conventions baked into the template, needed while customizing.

## Tech stack details

**Framework**

- Next.js 16 (App Router, Turbopack) — `next dev --turbo`, `next build --turbo`
- React 19 — Server Components by default
- TypeScript strict mode — explicit return types on exports, `interface` for objects, `type` for unions

**Styling**

- Tailwind CSS v4 via `@tailwindcss/postcss` (CSS-first config, no `tailwind.config`)
- CSS variables in `app/globals.css` consumed as `bg-(--color-ghost-canvas)`, etc.
- `cn()` helper from `@utils/tw` for conditional class merging (wraps `clsx` + `tailwind-merge`)

**UI — HeroUI v3**

- Button variants: `primary` (default), `secondary`, `tertiary`, `outline`, `ghost`, `danger`, `danger-soft`
- Button loading prop: `isPending` (not `isLoading`)
- Card parts: `CardHeader`, `CardContent`, `CardFooter` (no `CardBody`)

**State — Zustand**

- Global state in `app/stores/`, imported per file (e.g. `@stores/counter`)
- `persist` middleware available from `zustand/middleware` when you need `localStorage` sync
- Always subscribe with a **selector** to avoid unnecessary re-renders

**Dev tooling**

- Biome 2 for lint + format (`pnpm lint` runs `biome check --write app --unsafe` over the app directory)
- pnpm 11 with a committed `pnpm-lock.yaml`

## Code conventions

**File placement**

- Pages: `app/<route>/page.tsx`
- API routes: `app/api/<endpoint>/route.ts` — export `GET` / `POST` / `PUT` / `DELETE`
- Shared components: `app/components/` — import per file (e.g. `@components/Container`)
- Layout parts: `app/layout/`
- Config: `app/config/site.ts` (site-wide constants)
- Zustand stores: `app/stores/` — import per file (e.g. `@stores/counter`)
- Utilities: `app/utils/`

**Naming**

- Components: PascalCase (`Navbar.tsx`)
- Hooks: camelCase with `use` prefix
- Utilities / stores: camelCase

**Server vs Client components**

- Default to Server Components.
- Add `"use client"` only when a file needs hooks, browser APIs, or event handlers.
- Keep the client boundary small — extract the interactive part into its own component.

**Imports**

```ts
import { Container } from "@components/Container";
import { ThemeToggle } from "@components/ThemeToggle";
import { siteConfig } from "@config/site";
import { NavBar } from "@layout/Navbar";
import { useCounterStore } from "@stores/counter";
import { cn } from "@utils/tw";
```

## Common tasks

**Add a page**

1. Create `app/<route>/page.tsx`.
2. Add an entry to `siteConfig.nav` in `app/config/site.ts` if it should appear in the header.

**Add an API route**

```ts
// app/api/<endpoint>/route.ts
export async function GET(): Promise<Response> {
  return Response.json({ ok: true });
}

export async function POST(request: Request): Promise<Response> {
  const body = await request.json();
  return Response.json({ received: body });
}
```

**Create a Zustand store**

```ts
// app/stores/<name>.ts
import { create } from "zustand";

interface State {
  value: string;
  setValue: (v: string) => void;
}

export const useMyStore = create<State>()((set) => ({
  value: "",
  setValue: (v) => set({ value: v }),
}));
```

**Consume a store (with selectors)**

```ts
import { useCounterStore } from "@stores/counter";

// Good — re-renders only when `count` changes
const count = useCounterStore((s) => s.count);

// Bad — re-renders on any state change
const { count } = useCounterStore();
```

**Client component example**

```tsx
"use client";
import { Container } from "@components/Container";
import { Button } from "@heroui/react";
import { useState } from "react";

export function Example(): React.ReactElement {
  const [value, setValue] = useState("");
  return (
    <Container size="md">
      <Button variant="outline" onPress={() => setValue("x")}>
        Click
      </Button>
    </Container>
  );
}
```

## Theme system

CSS variables (`app/globals.css`):

See [`DESIGN.md`](./DESIGN.md) for the complete design reference including the color palette, typography, elevation, and component tokens.

> **Important:** `DESIGN.md` and `app/globals.css` must always stay synchronized. When you modify any design token in `globals.css`, update the corresponding section in `DESIGN.md` immediately. These are twin source-of-truth files — the CSS is the implementation, the markdown is the documentation.

**Looking for design inspiration?** Browse curated design templates at [styles.refero.design](https://styles.refero.design/).

Usage:

```tsx
<div className="bg-(--color-bg-primary) text-(--color-text-primary)">
  <button className="btn-primary">Click</button>
  <button className="btn-cta-ghost">Ghost</button>
</div>
```

Dark mode:

- Powered by [`next-themes`](https://github.com/pacocoursey/next-themes) via `app/providers.tsx` (`attribute="class"`, `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange`).
- `ThemeProvider` injects its own pre-hydration script, toggles the `dark` class on `<html>`, and persists the choice to `localStorage` (`theme` key).
- `ThemeToggle` (`app/components/ThemeToggle.tsx`) reads `resolvedTheme` and calls `setTheme("light"|"dark")`.
- `html` / `html.dark` background colors in `globals.css` match the first paint so neither mode flashes.
- Falls back to `prefers-color-scheme` when no preference is stored.

## Utilities

```ts
import { cn } from "@utils/tw";
import { useMediaQuery, useBreakpoint } from "@utils/media-query";
import {
  useDebounce,
  useDebouncedCallback,
  useDebounceState,
} from "@utils/debounce";
import { useClickOutside } from "@utils/click-outside";
```

- `cn(...classes)` — Tailwind-aware class merge.
- `useMediaQuery("(max-width: 768px)")`, `useBreakpoint("md")` — `sm | md | lg | xl | 2xl`.
- `useDebounce(value, ms)` — debounced value.
- `useDebouncedCallback(fn, ms)` — debounced callback.
- `useDebounceState(initial, ms)` — returns `[value, debouncedValue, setValue]`.
- `useClickOutside(isOpen, elementId, onClose)` — closes dropdowns/menus when clicking outside the specified element.

## Performance notes

- Default to Server Components; keep `"use client"` boundaries small.
- Reach for `memo()` / `useCallback` / `useMemo` only when profiling shows a real re-render cost. Do not wrap zero-prop or stable-prop components in `memo()`.
- Always select Zustand state with a selector.
- `next.config.mjs` enables `output: "standalone"`, `optimizePackageImports` (for `@heroui/react`, `@heroui/styles`), AVIF/WebP images with a strict `contentSecurityPolicy` on image responses, `optimizeCss`, compression, long-term caching for `/images`, `/fonts`, `/_next/static`, and 6 security headers (HSTS, X-DNS-Prefetch-Control, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy). No page-level CSP is set — add one if your app needs it.
- CI/CD runs on every push (`lint` → `build` → `test`) via `.github/workflows/ci-cd.yml`.

## Scripts

```bash
pnpm dev      # Dev server, Turbopack, 0.0.0.0:3000
pnpm build    # Production build (Turbopack)
pnpm start    # Production server
pnpm lint     # Biome check + auto-fix
pnpm test     # Vitest run
pnpm upgrade  # pnpm update && pnpm prune
pnpm clean    # rimraf .next out node_modules && pnpm install
pnpm repomix  # Markdown snapshot of the codebase for agents
```

## References

- [Next.js](https://nextjs.org/docs)
- [HeroUI](https://www.heroui.com/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Zustand](https://zustand.docs.pmnd.rs/)
- [Biome](https://biomejs.dev/)
- [AGENTS.md standard](https://agents.md/)
- [Agent Skill spec](https://agentskills.io/specification)
- [DESIGN.md](./DESIGN.md) — Complete design system reference
