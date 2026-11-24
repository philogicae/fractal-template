---
name: fractal-template-bootstrap
description: Bootstrap a new project from philogicae/fractal-template. Covers cloning, the repository tour, customization, demo cleanup, and hand-off checks.
license: MIT
notes: Content negotiation - raw markdown for agents/curl, styled HTML for browsers. Force markdown with ?raw=1 (e.g. /skill.md?raw=1).
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
    - Zustand
    - Biome
    - Vitest
  features:
    - App Router with React Server Components
    - Provider-based i18n (`NEXT_LOCALE` cookie + `Accept-Language`), 12 locales, no `[lang]` segment
    - Dark mode via `next-themes` with FOUC prevention
    - Typed state model (discriminated unions, request-id race guards)
    - Error boundary, loading skeleton, 404, sitemap
    - Utility hooks (`useDebounce`, `useMediaQuery`, `useClickOutside`, `useIsClient`)
    - Security headers, AVIF/WebP images with strict SVG CSP
    - Standalone Docker build and GitHub Actions CI
    - Vitest with a 100% coverage gate
---

# Fractal Template - Bootstrap Skill

> **Audience.** Agents starting a **new project** from `philogicae/fractal-template`. Once the repo is cloned, [`AGENTS.md`](./AGENTS.md) is the conventions reference and [`CHECKLIST.md`](./CHECKLIST.md) is the task list. This skill covers the bootstrap sequence and points to those two files instead of duplicating them.

## 1. Clone and install

```bash
git clone https://github.com/philogicae/fractal-template.git <project-name>
cd <project-name>
rm -rf .git && git init
pnpm install
pnpm dev           # http://localhost:3000
```

Requirements: **Node.js 26+**, **pnpm 12+**.

## 2. Repository tour

```
<project-name>/
├── app/
│   ├── api/hello/               # DEMO endpoint - delete or replace
│   ├── skill.md/                # Serves this file at /skill.md - keep with the agent surface
│   ├── components/              # Container, Skeleton, ThemeToggle, LanguageSwitcher (keep)
│   │                            # FeatureCard, StatusBadge (demo)
│   ├── config/site.ts           # Identity, nav (labelKey), socials, theme colors
│   ├── i18n/                    # Registry, dictionaries, server helpers, LocaleProvider
│   ├── layout/                  # Navbar, Footer
│   ├── playground/              # DEMO page + state.ts reducer - delete
│   ├── stores/counter.ts        # DEMO store - delete
│   ├── test/                    # renderProbe/withLocale harness - keep
│   ├── utils/                   # tw, debounce, media-query, click-outside, hydration - keep
│   ├── globals.css              # Design tokens - customize
│   ├── layout.tsx               # Root layout, metadata, fonts - customize
│   ├── page.tsx                 # Landing page - replace
│   └── error.tsx / loading.tsx / not-found.tsx / sitemap.ts
├── public/                      # favicon, logo, robots - replace
├── .env.example                 # Consumed variables only - extend as needed
├── next.config.mjs              # Headers, images, caching - review
├── Dockerfile / compose.yaml    # Ready to use - names/port via .env
├── README.md                    # Rewrite for the product
├── AGENTS.md                    # Repo conventions - keep in sync
├── CHECKLIST.md                 # Tickable progress - delete when done
├── DESIGN.md                    # Design system reference
└── vitest.config.js             # jsdom, vmThreads pool, 100% coverage
```

Path aliases: `@components`, `@config`, `@i18n`, `@layout`, `@stores`, `@utils`. No barrel exports.

## 3. Customization workflow

**Work from [`CHECKLIST.md`](./CHECKLIST.md)**, top to bottom, ticking boxes as you go. It is the single source of truth for identity, assets, layout, design tokens, i18n, demo cleanup, environment, docs, and sanity checks.

Conventions you need up front (details in [`AGENTS.md`](./AGENTS.md)):

- `app/config/site.ts` is the identity single source of truth: `layout.tsx` metadata, `Navbar`, `Footer`, and landing CTAs derive from it.
- User-visible copy lives in `app/i18n/dictionaries/*.json`, never in JSX. The `Dictionary` type is inferred from `en.json`.
- **Add a locale:** copy `en.json`, translate, update `meta.{flag,native}`, then add one import + one map entry in `app/i18n/config.ts`. **Drop one:** delete the JSON and its import/map entry.
- Nav entries carry a `labelKey`; add the key to `NavLabelKey` and to `dict.nav` in every locale.
- Read copy with `useDict()` on the client and `getCurrentDictionary()` on the server.
- `app/globals.css` and `DESIGN.md` are twin sources of truth for the design system - update both together.
- Pure state modules sit next to their consumer (e.g. `app/playground/state.ts`).

## 4. Delete demo-only code

Remove unless the user explicitly wants it kept:

- `app/playground/` - entire directory, including `state.ts` and tests
- `app/api/hello/` - or replace with real endpoints
- `app/stores/counter.ts` and its test
- `app/components/FeatureCard.tsx` if unused; `app/components/StatusBadge.tsx` (only used by the playground)
- the playground / SKILL.md / GitHub / Vercel CTAs in `app/page.tsx`
- the `/playground` entry in `siteConfig.nav` (`app/config/site.ts`)

Keep `app/skill.md/route.ts` while the agent surface exists.

## 5. Rewrite `SKILL.md` for the new project - or delete it

**Default:** rewrite this file so agents can interact with the shipped app through `/skill.md`: routes, API, auth, env variables, how to consume it.

**Opt-out:** if the app needs no agent surface, delete `SKILL.md`, `app/skill.md/`, the `/skill.md` nav entry, and any `/skill.md` CTA.

Suggested structure:

```markdown
---
name: <project-name>
description: <what the app does, who it is for>
---

# <Project name>

## Overview

## Routes

## API

## Data model / state

## Environment variables

## How an agent should interact with the app
```

Keep `AGENTS.md` accurate throughout - not in a final pass.

## 6. Sanity checks before handing off

```bash
pnpm lint
pnpm test:coverage
pnpm build
```

Then:

- boot `pnpm dev` and click every route in `siteConfig.nav`
- cycle the language switcher through every shipped locale
- grep for leftover template branding: `rg -i "next\.js template|philogicae|fractal-template|playground|counter"`
- confirm `AGENTS.md`, `README.md`, and `CHECKLIST.md` describe what actually remains

## 7. Conventions quick reference

**Stack**

- Next.js 16 App Router + Turbopack; React 19 Server Components by default
- TypeScript strict: explicit return types on exports, `interface` for objects, `type` for unions
- Tailwind 4 CSS-first, no `tailwind.config`; `cn()` from `@utils/tw`
- Biome 2: `pnpm lint` = `biome check --write app --unsafe`
- pnpm 12, committed lockfile

**HeroUI v3**

- Variants: `primary` (default), `secondary`, `tertiary`, `outline`, `ghost`, `danger`, `danger-soft`
- No loading/pending prop on `Button` - track it yourself and pass `isDisabled`
- Card parts: `CardHeader`, `CardContent`, `CardFooter` (no `CardBody`)

**State**

- Derive, don't store; one owner per fact
- Mutually exclusive states are one discriminated union
- Async results carry a request id (or `AbortSignal`); stale results are dropped in a reducer
- `useSyncExternalStore` for external systems, `useTransition` for pending transitions

**Server vs client**

- Server Components by default; `"use client"` only for hooks, browser APIs, or handlers
- Keep client boundaries small and localized

**Tests**

- Colocated `*.test.ts(x)`, Vitest + jsdom, 100 % coverage gate
- `renderProbe` / `withLocale` from `app/test/` - no `@testing-library`
- Use `Error.isError(error)` (cross-realm) instead of `instanceof Error`

**Scripts**

```bash
pnpm dev / build / start
pnpm lint
pnpm test / test:coverage / test:watch / test:ui
pnpm upgrade / clean / repomix
```

## References

- [`AGENTS.md`](./AGENTS.md) - conventions, state model, tasks, testing
- [`CHECKLIST.md`](./CHECKLIST.md) - tickable customization list
- [`DESIGN.md`](./DESIGN.md) - design system reference
- [`README.md`](./README.md) - human-facing overview
- [Next.js](https://nextjs.org/docs), [HeroUI](https://www.heroui.com/docs), [Tailwind CSS v4](https://tailwindcss.com/docs), [Zustand](https://zustand.docs.pmnd.rs/), [Biome](https://biomejs.dev/), [Agent Skill spec](https://agentskills.io/specification)
