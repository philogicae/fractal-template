# Fractal Template

[![Node](https://img.shields.io/badge/node-26%2B-blue)](https://nodejs.org)
[![pnpm](https://img.shields.io/badge/pnpm-11%2B-blue)](https://pnpm.io)
[![Actions status](https://github.com/philogicae/fractal-template/actions/workflows/ci-cd.yml/badge.svg?cache-control=no-cache)](https://github.com/philogicae/fractal-template/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/philogicae/fractal-template)

A modern Next.js template with HeroUI, Tailwind CSS, and TypeScript.

## Features

- **Next.js 16** — App Router with React Server Components
- **React 19** — Latest React features and improvements
- **TypeScript** — Full type safety with strict configuration
- **Tailwind CSS 4** — Utility-first styling with CSS variables
- **HeroUI v3** — Beautiful, accessible UI components
- **Zustand** — Lightweight state management with persistence
- **Dark Mode** — `next-themes` with `localStorage` persistence, dark by default (light mode one toggle away), and FOUC prevention (see [`DESIGN.md`](./DESIGN.md))
- **Biome** — Fast linting and code formatting
- **Mobile-first** — Fully responsive layout
- **Path Aliases** — Clean per-file imports with `@components/*`, `@config/*`, `@layout/*`, `@stores/*`, `@utils/*`
- **Site config** — Brand, nav, and socials centralized in `app/config/site.ts`
- **Built-in UX pages** — `error.tsx` boundary, `loading.tsx` skeletons, `not-found.tsx` 404
- **Utility hooks** — `useDebounce`, `useDebouncedCallback`, `useDebounceState`, `useMediaQuery`, `useBreakpoint`
- **Reduced-motion aware** — `prefers-reduced-motion` handled globally in `globals.css`
- **Production-ready** — Multi-stage `Dockerfile` with `output: "standalone"`, GitHub Actions CI/CD, 6 security headers, AVIF/WebP images (with strict CSP), long-term static caching
- **Agent-ready** — [`AGENTS.md`](./AGENTS.md), [`SKILL.md`](./SKILL.md), [`DESIGN.md`](./DESIGN.md), [`CHECKLIST.md`](./CHECKLIST.md), and a `/skill.md` route for dynamic agent discovery
- **Internationalization** — server-resolved locale (cookie + `Accept-Language`) with a typed JSON-dictionary system, a client `LocaleProvider`, and a navbar `LanguageSwitcher`. Ships with **12 locales** (`en`, `zh`, `es`, `ar`, `fr`, `pt`, `ru`, `ja`, `de`, `ko`, `it`, `ro`); delete the ones you don't need when customizing, add more only when needed — no `[lang]` URL segment. **All user-visible text must use i18n** — no hardcoded strings in components

## Getting Started

### Prerequisites

- Node.js 26+ (enforced via `package.json` `engines` + `.npmrc` `engine-strict`)
- pnpm 11+

### Clone and Setup

```bash
git clone https://github.com/philogicae/fractal-template.git my-project
cd my-project
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `pnpm dev` — Start development server with Turbo
- `pnpm build` — Build for production
- `pnpm start` — Start production server
- `pnpm lint` — Run Biome linter and formatter (auto-fix)
- `pnpm test` — Run Vitest
- `pnpm test:watch` — Run Vitest in watch mode
- `pnpm test:ui` — Run Vitest with browser UI
- `pnpm upgrade` — Update all dependencies
- `pnpm clean` — Clean build artifacts and reinstall
- `pnpm repomix` — Generate codebase summary for AI agents (markdown)

## Project Structure

```
app/
├── api/                   # API routes
│   └── hello/
│       └── route.ts       # (demo) Example GET/POST endpoint
├── skill.md/
│   └── route.ts           # Serves SKILL.md: HTML for browsers, raw markdown for agents (cached 1h)
├── components/            # Reusable UI components
│   ├── Container.tsx      # Page width wrapper
│   ├── FeatureCard.tsx    # (demo) Landing page feature card
│   ├── LanguageSwitcher.tsx # Locale dropdown (custom implementation)
│   ├── Skeleton.tsx       # Themed pulse placeholder
│   ├── StatusBadge.tsx    # (demo) Status indicator with colored dot
│   └── ThemeToggle.tsx    # Dark/light theme switch (uses next-themes)
├── config/                # Site-wide config (single source of truth)
│   └── site.ts            # Name, description, nav, socials, theme colors
├── i18n/                  # Internationalization (no URL segment)
│   ├── config.ts          # Single registry: Locale, Dictionary, locales,
│   │                      #   localeMeta, hasLocale(), getDictionary()
│   ├── dictionaries/      # 12 locale files ship (en.json is the default/fallback).
│   │                      # Delete extra locales when customizing;
│   │                      # add more only when needed
│   ├── get-locale.ts      # Accept-Language matcher (zero-dep)
│   ├── server.ts          # getCurrentLocale / getCurrentDictionary
│   ├── actions.ts         # Server Action: set NEXT_LOCALE cookie
│   └── LocaleProvider.tsx # Client context + useLocale / useDict
├── layout/                # Layout components (no barrel)
│   ├── Navbar.tsx         # Responsive navbar with mobile menu + LanguageSwitcher
│   └── Footer.tsx         # Site footer with links
├── playground/            # (demo) Interactive API + state playground
│   └── page.tsx
├── stores/                # Zustand state stores
│   └── counter.ts         # (demo) counter store
├── test/                  # Test harness (Vitest)
│   ├── react.tsx          # act/createRoot harness (no testing-library)
│   └── stubs/
│       └── server-only.ts # Stub for the `server-only` package in tests
├── utils/                 # Utility functions
│   ├── tw.ts              # cn() class merger
│   ├── debounce.ts        # Debounce hooks
│   ├── media-query.ts     # Responsive hooks
│   └── click-outside.ts   # useClickOutside hook for dropdowns
├── globals.css            # Global styles and design tokens
├── layout.tsx             # Root layout (Navbar + main + Footer)
├── providers.tsx          # Client providers (next-themes + LocaleProvider)
├── page.tsx               # Landing page
├── error.tsx              # Error boundary
├── loading.tsx            # Loading UI
├── not-found.tsx          # 404 page
└── sitemap.ts             # SEO sitemap generation

vitest.config.js           # Vitest configuration (path aliases, jsdom)
                           # Colocated tests ship as *.test.ts(x) next to the code (10 files)
.env.example               # Environment variable template
public/                    # Static assets
├── images/
│   ├── logo.gif
│   ├── apple-touch-icon.png
│   ├── 192x192.png
│   ├── 512x512.png
│   └── screenshot.jpeg
├── favicon.ico
├── manifest.json
└── robots.txt

SKILL.md                   # Agent Skill definition (served at /skill.md)
AGENTS.md                  # In-repo agent conventions
CHECKLIST.md               # Tickable bootstrap checklist (delete once done)
DESIGN.md                  # Complete design system reference
pnpm-workspace.yaml        # pnpm workspace config (engine-strict, lockfile settings)
```

## AI Agent Configuration

This project includes AI agent configuration files:

- **AGENTS.md** — conventions for an agent working inside an already-cloned repo: customization checklist, code style, and architecture guidance. Meant to be kept in sync as the project evolves.
- **SKILL.md** — bootstrap skill for an agent starting a **new** project from this template: clone, folder tour, customize / delete checklist, and the conventions it needs to do that correctly. Once the project ships, this file should be rewritten to describe the new app (routes, API, env) — or deleted if there is no agent-facing surface.
- **CHECKLIST.md** — structured, tickable bootstrap checklist that mirrors the customization / delete / sanity-check steps from `AGENTS.md` and `SKILL.md`. Agents should tick boxes as they go so the next session sees exactly what is left. Delete it once every box is ticked.

Usable with (and beyond): [Claude Code](https://claude.ai/code), [Cursor](https://www.cursor.com/), [Windsurf](https://windsurf.com/), [OpenClaw](https://openclaw.ai/), [Hermes](https://hermes-agent.nousresearch.com/)

### AGENTS.md

Standardized instructions following the [AGENTS.md standard](https://agents.md/):

- Project overview and architecture
- Code style and conventions (TypeScript, naming)
- Component patterns (Client vs Server)
- Development workflows and commands

### SKILL.md

Agent Skill definition following the [Agent Skill specification](https://agentskills.io/specification):

- Skill metadata and compatibility
- Bootstrap workflow (clone, folder tour, customize / delete checklist)
- Template conventions reference (stack, code style, common tasks, theme, utilities)
- Template for rewriting `SKILL.md` after customization so agents can interact with the shipped app

The skill definition is served at `/skill.md` with content negotiation: beautiful HTML for human browsers, raw markdown for agents and curl.

### Live Demo

Visit the [live demo](https://fractal-template.binaryeyelabs.xyz) to see the template in action: a single hero section with animated CTA buttons (playground, SKILL.md, GitHub, Deploy to Vercel) above a feature grid.

## Deployment

### Docker

A multi-stage `Dockerfile` (`base` → `deps` → `builder` → slim `runner`) and `compose.yaml` are included. The `runner` stage serves the Next.js standalone bundle (`node server.js`) as a non-root user with a `HEALTHCHECK`. Base image: [`platformatic/node-caged:26-alpine`](https://hub.docker.com/r/platformatic/node-caged) — Node.js with V8 pointer compression enabled (~50% memory reduction for pointer-heavy workloads).

```bash
docker compose up --build       # Build and run on :3000
```

`compose.yaml` sets `NODE_ENV=production` and optionally loads a local `.env` file. Two variables are configurable via `.env`: `DOCKER_PROJECT_NAME` (compose project name, reused for the container and image names) and `DOCKER_PORT` (host port) — defaults fall back to `fractal-template` / `3000`.

### GitHub Actions

`.github/workflows/ci-cd.yml` ships ready to use — no edits needed.

### Production hardening (built-in, via `next.config.mjs`)

- **Security headers** — HSTS, X-DNS-Prefetch-Control, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy. No page-level CSP is set — add one if your app needs it.
- **Image optimization** — AVIF/WebP formats, 24h minimum cache TTL, remote patterns over HTTPS, strict `contentSecurityPolicy` on image responses to neutralize SVG XSS.
- **Standalone output** — `output: "standalone"` in `next.config.mjs` produces a minimal production server bundle for slim Docker images.
- **Long-term caching** — 1 week for `/images`, `/fonts`, and `/_next/static` (Next.js content-hashed URLs make this safe).
- **Package import optimization** — `@heroui/react`, `@heroui/styles` tree-shaken via `experimental.optimizePackageImports`.
- **Compression** — enabled by default; `x-powered-by` header stripped.

### Environment variables

- `CF_WEB_ANALYTICS_TOKEN` — optional. When set, the Cloudflare Web Analytics beacon is injected in `app/layout.tsx`; omit it to disable the beacon.
- `VERCEL_ANALYTICS_ID` — injected automatically by Vercel. `app/layout.tsx` gates both Vercel `Analytics` and `SpeedInsights` on `process.env.VERCEL`, so they render only on Vercel deployments.

See [`.env.example`](./.env.example) for the full annotated list.

## Customization

### Design Tokens

Edit `app/globals.css` to customize colors, spacing, and layout vars. See [`DESIGN.md`](./DESIGN.md) for the complete reference:

> **Note:** These files must stay synchronized — `globals.css` is the implementation, `DESIGN.md` is the documentation. When you modify tokens in one, update the other immediately.

```css
:root {
  /* Dark Mode: Pitch Black Canvas */
  --color-bg-primary: #08090a; /* Page background */
  --color-bg-secondary: #111113; /* Elevated surfaces */
  --color-bg-elevated: #1a1a1e; /* Cards */
  --color-text-primary: #f8fafc; /* Primary text */
  --color-text-secondary: #cbd5e1; /* Secondary text */
  --color-text-muted: #94a3b8; /* Tertiary text */

  /* Primary accent (dark mode) */
  --color-accent-primary: #a3e635; /* Neon lime - buttons, links, focus */
  --color-accent-secondary: #06b6d4; /* Cyan glow - gradients, highlights */
}

html:not(.dark) {
  /* Light Mode: Mediterranean Sky */
  --color-bg-primary: #f0f9ff; /* Sky white - page background */
  --color-bg-secondary: #e0f2fe; /* Cloud light - elevated surfaces */
  --color-bg-elevated: #f0f9ff; /* Cards */
  --color-text-primary: #0c4a6e; /* Deep ocean - primary text */
  --color-text-secondary: #334155; /* Sea stone - secondary text */
  --color-text-muted: #475569; /* Warm slate - tertiary text */

  /* Primary accent (light mode) */
  --color-accent-primary: #06b6d4; /* Turquoise - buttons, links, focus */
  --color-accent-secondary: #0ea5e9; /* Azure - gradients, highlights */
}
```

**Typography:** Inter (static weights 300–700) with tight tracking (-0.1px to -0.22px); IBM Plex Mono (400/500) for code.

**Components:** 6px radius buttons/cards/inputs, 2px tags, 4px badges. Compact density with 8px element gaps. Layered surfaces for elevation with subtle shadows.

**Looking for design inspiration?** Browse curated design templates at [styles.refero.design](https://styles.refero.design/).

### Path Aliases

Configured in `tsconfig.json`:

```json
{
  "paths": {
    "@components/*": ["./app/components/*"],
    "@config/*": ["./app/config/*"],
    "@i18n/*": ["./app/i18n/*"],
    "@layout/*": ["./app/layout/*"],
    "@stores/*": ["./app/stores/*"],
    "@utils/*": ["./app/utils/*"]
  }
}
```

> No barrel exports: each file imports exactly what it needs (e.g. `@components/Container`, `@stores/counter`). `@layout` is intentionally **not** a barrel because it would conflict with `app/layout.tsx`.

### Reusable Components

```tsx
import { Container } from "@components/Container";
import { FeatureCard } from "@components/FeatureCard";
import { Skeleton } from "@components/Skeleton";
import { StatusBadge } from "@components/StatusBadge";
import { ThemeToggle } from "@components/ThemeToggle";

<Container size="md">
  <FeatureCard icon="▲" name="Next.js 16" description="App Router" />
  <StatusBadge status="success" />
  <Skeleton className="h-6 w-32" />
</Container>;
```

### Site Config

Edit `app/config/site.ts` — it is the **single source of truth** for brand name, description, keywords, URL, theme colors, nav links, and socials. `app/layout.tsx` metadata, `Navbar`, `Footer`, `manifest.json`-facing values, and landing-page CTAs all derive from it.

```ts
import { siteConfig } from "@config/site";

siteConfig.name;
siteConfig.url;
siteConfig.nav;
siteConfig.social;
```

### Utility Hooks

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

- `cn(...)` — Tailwind-aware class merge (clsx + tailwind-merge).
- `useMediaQuery("(max-width: 768px)")`, `useBreakpoint("md")` — `sm | md | lg | xl | 2xl`.
- `useDebounce(value, ms)` / `useDebouncedCallback(fn, ms)` / `useDebounceState(initial, ms)`.
- `useClickOutside(isOpen, elementId, onClose)` — closes dropdowns/menus when clicking outside the specified element.

### HeroUI Button Variants

HeroUI v3 Button variants: `primary` (default), `secondary`, `tertiary`, `outline`, `ghost`, `danger`, `danger-soft`.

Card parts: `CardHeader`, `CardContent`, `CardFooter` (no `CardBody`). Button loading prop is `isPending` (not `isLoading`).

### Internationalization

The template ships with a **provider-based** i18n layer — no `[lang]` URL segment, no `middleware.ts`, no full-page reload on locale change.

**Flow.** The root layout (`app/layout.tsx`) resolves the active locale server-side via `getCurrentDictionary()` (`app/i18n/server.ts`): cookie `NEXT_LOCALE` → `Accept-Language` header → `defaultLocale`. It then loads the matching JSON dictionary and injects both into the `<Providers>` tree (`app/providers.tsx`). A client `LocaleProvider` (`app/i18n/LocaleProvider.tsx`) exposes them via `useLocale()` / `useDict()`. The `LanguageSwitcher` calls the `setLocaleAction` Server Action to persist the cookie and then `router.refresh()` inside a transition so every Server Component re-renders with the new dictionary.

```ts
// Client component
import { useDict } from "@i18n/LocaleProvider";
const t = useDict().nav;

// Server component
import { getCurrentDictionary } from "@i18n/server";
const { dict, locale } = await getCurrentDictionary();
```

**Supported locales** (see `app/i18n/config.ts`): `en` (default), `zh`, `es`, `ar`, `fr`, `pt`, `ru`, `ja`, `de`, `ko`, `it`, `ro`. Delete extra locale files when customizing; add more only when needed. **All user-visible text must use i18n** — in Server Components use `const { dict } = await getCurrentDictionary()`, in Client Components use `const dict = useDict()`.

Site-wide nav entries in `app/config/site.ts` carry a `labelKey` (not a literal label); the `Navbar` resolves it against `dict.nav`, which guarantees translation coverage at the type level.

## API Playground (demo)

Visit `/playground` to test the API endpoints and Zustand state management:

- GET/POST requests to `/api/hello` with live status badges
- GET request to `/skill.md` (returns raw SKILL.md content)
- Zustand counter demo (increment, decrement, +5, reset, undo)

> The `/playground` page, `/api/hello` route, the counter store, and `FeatureCard` / `StatusBadge` components are included as examples only. When starting a new project from this template, remove them — see `SKILL.md` and `AGENTS.md` for the full customization checklist.

## License

MIT License
