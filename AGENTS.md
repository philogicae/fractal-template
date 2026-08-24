# AGENTS.md

> **Audience.** AI agents working inside a repository **already cloned** from `philogicae/fractal-template` who need to customize it into a real product. This document is self-contained.
>
> **Keep this file in sync while you work.** Every time you remove demo code, add a route/store/component, introduce an env variable, or change conventions, update the matching section of `AGENTS.md` in the same commit. The next agent reading it must see the current state of the project, not the template's baseline.
>
> **Track progress in [`CHECKLIST.md`](./CHECKLIST.md).** A structured, tickable bootstrap checklist lives at the repo root — it is the **only** source of truth for what has or hasn't been customized yet. This document deliberately does not duplicate that list; it covers conventions and patterns instead. When every box in `CHECKLIST.md` is ticked, delete it or replace it with a project-specific checklist.
>
> **Design Reference:** See [`DESIGN.md`](./DESIGN.md) for the complete design system reference (colors, typography, spacing, components).

## Requirements

- Node.js 24+
- pnpm 11+

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **UI**: HeroUI v3
- **Styling**: Tailwind CSS v4 (CSS-first, via `@tailwindcss/postcss`)
- **Design System**: Pre-configured dark and light modes. See [`DESIGN.md`](./DESIGN.md) for the complete reference (palette, typography, elevation, components).
- **State**: Zustand + `persist` middleware
- **Lint/format**: Biome 2
- **Package manager**: pnpm 11
- **i18n**: Provider-based (cookie + `Accept-Language`), no URL locale segment. Ships with 12 locales (`en`, `zh`, `es`, `ar`, `fr`, `pt`, `ru`, `ja`, `de`, `ko`, `it`, `ro`); delete the ones you don't need when customizing, add more only when needed. **All user-visible text must use i18n** — no hardcoded strings in components
- **Theme**: Light and dark mode support via next-themes. See [`DESIGN.md`](./DESIGN.md) for the complete token reference.

## Customization checklist

**Do not duplicate this list here.** The full, tickable checklist lives in
[`CHECKLIST.md`](./CHECKLIST.md) at the repo root — identity & metadata,
public assets, layout / chrome, landing page & design tokens,
internationalization, demo-code deletions, environment & infrastructure,
documentation, and sanity checks. Work top-to-bottom through that file
and tick boxes as you go; that is the single source of truth for what
remains to be customized in this clone.

This document covers the **conventions** an agent needs to carry out
those steps correctly (code style, i18n wiring, component patterns,
common tasks). When you need a progress tracker, switch to
`CHECKLIST.md`.

## Demo code to remove

These exist **only** to showcase the template:

- `app/playground/` — delete entirely
- `app/api/hello/` — delete or replace with real endpoints
- `app/stores/counter.ts`
- `app/components/FeatureCard.tsx` and `app/components/StatusBadge.tsx` if unused
- `/playground` entry in `siteConfig.nav` (`app/config/site.ts`); the `/skill.md` entry goes only if you also remove the agent surface (see the `SKILL.md` section below)
- Landing-page buttons in `app/page.tsx` that point to the playground, SKILL.md, the GitHub repo, or "Deploy to Vercel"

Keep unless you have a reason to drop them:

- `app/skill.md/route.ts` — serves `SKILL.md` at `/skill.md` with content negotiation: styled HTML for browsers, raw markdown for agents/curl

- `app/components/Container.tsx`, `Skeleton.tsx`, `ThemeToggle.tsx`
- `app/config/site.ts`
- `app/providers.tsx` (wraps children in `next-themes`'s `ThemeProvider`)
- `app/utils/{tw,debounce,media-query,click-outside}.ts`
- `app/{error,loading,not-found}.tsx`
- `app/i18n/*` and `app/components/LanguageSwitcher.tsx` — the internationalization layer is core infrastructure. Drop a locale you don't want (see "Add a locale" above, in reverse) rather than ripping the whole system out.

**`SKILL.md` — rewrite by default, or delete.** The default expectation is that you **rewrite `SKILL.md`** so agents can interact with the shipped application through the `/skill.md` endpoint. Describe the new project's routes, API, auth, env variables, and how an agent should consume it — not how to install the template. Suggested frontmatter + sections:

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

If the project has no agent-facing surface and the user does not want one, delete instead: `SKILL.md`, `app/skill.md/` (route handler), the `/skill.md` entry in `siteConfig.nav` (`app/config/site.ts`), and any landing-page button that links to `/skill.md` in `app/page.tsx`.

## Project structure (template baseline)

```
app/
├── api/                  # Route handlers (GET/POST/PUT/DELETE)
│   └── hello/            #   DEMO: example endpoint — delete or replace
├── skill.md/             # Serves SKILL.md raw at /skill.md
├── components/           # Shared UI (no barrel — import per file)
│   ├── Container.tsx     #   Width wrapper (keep)
│   ├── Skeleton.tsx      #   Themed pulse placeholder (keep)
│   ├── ThemeToggle.tsx   #   Dark/light switch (keep)
│   ├── LanguageSwitcher.tsx # Locale dropdown (keep)
│   ├── FeatureCard.tsx   #   DEMO: landing feature card — delete if unused
│   └── StatusBadge.tsx   #   DEMO: status indicator — delete if unused
├── config/               # Site-wide config (site.ts) — edit here, not in layout/page
│   └── site.ts           #   Name, description, nav, socials, theme colors
├── i18n/                 # Internationalization (provider-based, no URL segment)
│   ├── config.ts         #   SINGLE REGISTRY: Locale, Dictionary, locales,
│   │                     #   localeMeta, hasLocale(), getDictionary() — all
│   │                     #   derived from the statically-imported dictionaries
│   ├── dictionaries/     #   en.json (default). Delete extra locales when customizing;
│   │                     #   add more only when needed. Each ships `meta: { flag, native }`
│   ├── get-locale.ts     #   Accept-Language matcher (zero-dep)
│   ├── server.ts         #   getCurrentLocale(), getCurrentDictionary()
│   ├── actions.ts        #   setLocaleAction Server Action (writes NEXT_LOCALE cookie)
│   └── LocaleProvider.tsx#   client context: useLocale(), useDict()
├── layout/               # Navbar.tsx (with LanguageSwitcher), Footer.tsx
│   ├── Navbar.tsx
│   └── Footer.tsx
├── playground/           # DEMO: interactive playground page — delete
│   └── page.tsx
├── stores/               # Zustand (no barrel — import per file)
│   └── counter.ts        #   DEMO: counter store — delete if unused
├── utils/                 # tw, debounce, media-query, click-outside
│   ├── tw.ts             #   cn() class merger
│   ├── debounce.ts       #   Debounce hooks
│   ├── media-query.ts    #   Responsive hooks
│   └── click-outside.ts  #   useClickOutside hook for dropdowns
├── globals.css           # Design tokens + CSS variables
├── layout.tsx            # Async root layout (reads locale, passes dict to providers)
├── providers.tsx         # Client providers (next-themes + LocaleProvider)
├── page.tsx              # Landing page
├── error.tsx             # Error boundary
├── loading.tsx           # Loading UI with Skeleton
├── not-found.tsx         # 404 page
└── sitemap.ts            # SEO sitemap generation
vitest.config.js          # Vitest test runner config (path aliases, jsdom)
public/                   # Static assets
├── images/
│   ├── logo.gif
│   ├── apple-touch-icon.png
│   ├── 192x192.png
│   ├── 512x512.png
│   └── screenshot.jpeg
├── favicon.ico
├── manifest.json
└── robots.txt
.env.example              # Environment variable template
next.config.mjs           # Next.js config (security headers, images, etc.)
biome.json                # Lint/format config
tsconfig.json             # TypeScript config (includes path aliases)
Dockerfile                # Multi-stage build with standalone output
compose.yaml              # Docker Compose configuration
SKILL.md                  # Agent Skill definition (bootstrap instructions)
AGENTS.md                 # In-repo agent conventions (this file)
README.md                 # Human-facing project overview
CHECKLIST.md              # Tickable bootstrap checklist
DESIGN.md                 # Complete design system reference
```

Path aliases (`tsconfig.json`, with `noUncheckedIndexedAccess` + `noImplicitOverride` on):

```json
"@components/*": ["./app/components/*"],
"@config/*":     ["./app/config/*"],
"@i18n/*":       ["./app/i18n/*"],
"@layout/*":     ["./app/layout/*"],
"@stores/*":     ["./app/stores/*"],
"@utils/*":      ["./app/utils/*"]
```

> No barrel exports. Every import targets a specific file (`@components/Container`, `@stores/counter`, `@layout/Navbar`, ...). Keeps tree-shaking predictable and avoids circular-import traps.

## Code style

**TypeScript**

- Strict mode; explicit return types on exported functions/components.
- `interface` for object shapes, `type` for unions.
- `const` by default; never `var`.

**Naming**

- Components: PascalCase (`Navbar.tsx`)
- Hooks: camelCase with `use` prefix
- Utilities / stores: camelCase

**File placement**

- Pages: `app/<route>/page.tsx`
- API: `app/api/<endpoint>/route.ts` — export `GET`/`POST`/`PUT`/`DELETE`
- Components: `app/components/` — import per file (e.g. `@components/Container`)
- Layout parts: `app/layout/`
- Config: `app/config/site.ts` (site-wide constants)
- Stores: `app/stores/` — import per file (e.g. `@stores/counter`)
- Utilities: `app/utils/`

**Formatting**

- `pnpm lint` runs `biome check --write app --unsafe` over the app directory. Run it before finishing a task.

## Component patterns

**Server vs Client**

- Default to Server Components.
- Add `"use client"` only when a file needs hooks, browser APIs, or event handlers.
- Keep the client boundary small — extract the interactive part into its own component.

**HeroUI v3**

- Button variants: `primary` (default), `secondary`, `tertiary`, `outline`, `ghost`, `danger`, `danger-soft`.
- Button loading prop is `isPending` (not `isLoading`).
- Card parts: `CardHeader`, `CardContent`, `CardFooter` (no `CardBody`).

**Styling**

- Tailwind utilities + CSS variables from `globals.css`.
- Use `cn()` from `@utils/tw` for conditional class merging.
- **Always use CSS variables** — never raw hex values or Tailwind color classes like `text-emerald-500`.

```tsx
// ✅ CORRECT — using CSS variables
<div className="bg-(--color-bg-primary) text-(--color-text-primary)">
  <span className="text-(--color-emerald)">Success</span>
  <span className="text-(--color-rose)">Error</span>
  <Button className="bg-(--color-accent-primary)">Click</Button>
</div>

// ❌ WRONG — raw values or Tailwind colors
<div className="bg-[#08090a] text-[#f8fafc]">
  <span className="text-emerald-500">Success</span>
  <span className="text-rose-500">Error</span>
</div>
```

**Available Color Tokens:**

```
Primitive:  --color-pitch-black, --color-graphite, --color-slate-elevated,
            --color-neon-lime, --color-cyan-glow, --color-emerald,
            --color-amber, --color-rose, --color-electric-violet, ...

Semantic:   --color-bg-primary, --color-bg-secondary, --color-text-primary,
            --color-text-secondary, --color-border-default, ...

Accent:     --color-accent-primary, --color-accent-secondary, --color-accent-hover

Status:     --color-emerald (success), --color-amber (warning),
            --color-rose (error), --color-hot-pink (attention)
```

**Example client component**

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

## Common tasks

**Add a page**

1. Create `app/<route>/page.tsx`.
2. Add an entry to `siteConfig.nav` in `app/config/site.ts` if it should appear in the header. Entries carry a `labelKey` (not a literal label); add the matching key to `NavLabelKey` and to `dict.nav` in every `app/i18n/dictionaries/*.json`.
3. Wrap any user-visible string in the dictionary: in a Server Component use `const { dict } = await getCurrentDictionary()` (`@i18n/server`), in a Client Component use `const dict = useDict()` (`@i18n/LocaleProvider`).

**Add a locale**

1. When customizing, first delete extra locale files you don't need (e.g., `fr.json`, `es.json`, `ro.json`) and remove their imports from `app/i18n/config.ts`.
2. To add a locale: create `app/i18n/dictionaries/<code>.json` — copy `en.json` as a scaffold so the `Dictionary` type stays satisfied. **Update the top-level `meta` object** (`flag`, `native`) — it drives the language switcher.
3. In `app/i18n/config.ts`, add one static import (`import xx from "./dictionaries/xx.json"`) and one entry in the `dictionaries` map. That's it — `Locale`, `locales`, `localeMeta`, `hasLocale()`, `getDictionary()`, and the switcher all derive from that map.

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

**SEO / Sitemap**

The template ships with `app/sitemap.ts` for automatic sitemap generation. When you add/remove routes:

1. Update `app/sitemap.ts` to include new pages
2. Update `public/robots.txt` to reference your production URL
3. Ensure `siteConfig.url` in `app/config/site.ts` matches your production domain

See `app/layout.tsx` for the base metadata, OpenGraph, and Twitter card configuration.

## Theme system

CSS variables live in `app/globals.css`. See [`DESIGN.md`](./DESIGN.md) for the complete design reference including colors, typography, elevation, spacing, and component tokens.

> **Important:** `DESIGN.md` and `app/globals.css` must always stay synchronized. When you add, remove, or modify any design token in `globals.css`, update the corresponding section in `DESIGN.md` immediately. Both files are the source of truth — `globals.css` is the implementation, `DESIGN.md` is the documentation.

The template uses Tailwind utilities for radius (`rounded-*`), shadow (`shadow-*`), and transitions (`transition-*`) alongside CSS custom properties. Animation keyframes (`fade-in-up`, `fade-in`) and a `prefers-reduced-motion` override are defined in `globals.css`.

Dark mode:

- Powered by [`next-themes`](https://github.com/pacocoursey/next-themes) via `app/providers.tsx` (`attribute="class"`, `defaultTheme="dark"`, `enableSystem={false}`, `disableTransitionOnChange`).
- `ThemeProvider` injects its own pre-hydration script, toggles the `dark` class on `<html>`, and persists the choice to `localStorage` (`theme` key).
- `ThemeToggle` (`app/components/ThemeToggle.tsx`) reads `resolvedTheme` and calls `setTheme("light"|"dark")`.
- `html` / `html.dark` background colors in `globals.css` match the first paint so neither mode flashes.
- Dark is always the default — `prefers-color-scheme` is never consulted; the ThemeToggle choice persists in `localStorage` (`theme` key).

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

- `cn(...)` — class merge with Tailwind conflict resolution.
- `useMediaQuery("(max-width: 768px)")`, `useBreakpoint("md")` — `sm | md | lg | xl | 2xl`.
- `useDebounce(value, ms)`, `useDebouncedCallback(fn, ms)`, `useDebounceState(initial, ms)`.
- `useClickOutside(isOpen, elementIds, onClose)` — dismissal behavior for floating menus: closes on `Escape` or pointer-down outside all listed elements. Pass **both** the panel id and the trigger id (e.g. `["lang-dropdown", "lang-switcher-trigger"]`), otherwise mousedown closes the menu and the click on the trigger re-opens it. Used by `LanguageSwitcher` and the mobile menu in `Navbar`.

## Performance

- Default to Server Components; keep `"use client"` boundaries small.
- Reach for `memo()` / `useCallback` / `useMemo` only when profiling shows a real re-render cost. Do **not** wrap zero-prop or stable-prop components in `memo()`.
- Always select Zustand state with a selector (see above).
- `next.config.mjs` enables `output: "standalone"` (slim Docker images), `optimizePackageImports` (for `@heroui/react`, `@heroui/styles`), AVIF/WebP images with a strict `contentSecurityPolicy` on image responses, `optimizeCss`, compression, long-term caching for `/images`, `/fonts`, `/_next/static`, and 6 security headers (HSTS, X-DNS-Prefetch-Control, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy). No page-level CSP is set — add one if your app needs it.
- The `Dockerfile` ships a multi-stage build (`base` → `deps` → `builder` → slim `runner`) that runs `node server.js` from the standalone bundle as a non-root user with a `HEALTHCHECK`.
- CI/CD runs on every push (`lint` → `build` → `test`) via `.github/workflows/ci-cd.yml`.

## Tests

- Runner: Vitest (`pnpm test`), jsdom environment, path aliases resolved in `vitest.config.js`. Tests live next to the code as `*.test.ts(x)`.
- Covered today: i18n registry integrity (key parity across all locale dictionaries, nav `labelKey` contract), server locale-resolution priority (`NEXT_LOCALE` cookie → `Accept-Language` → default), `useClickOutside` dismissal contract (outside/panel/trigger/Escape/unmount), debounce hooks (fake timers), `useMediaQuery` (stubbed `matchMedia`), `cn()` merge behavior, and both route handlers (`/api/hello` echo + 400, `/skill.md` content-negotiation matrix + version sync).
- React hook tests use the tiny `act`/`createRoot` helpers in `app/test/react.tsx` — no `@testing-library` dependency.
- `server-only` is aliased to `app/test/stubs/server-only.ts` in `vitest.config.js` (Next aliases it internally; it is not an installable dependency).
- When adding a utility, hook, or route handler, add a unit test defending its observable contract. Component interactions are verified in the browser, not in unit tests.

## Scripts

```bash
pnpm dev      # Dev server, Turbopack, 0.0.0.0:3000
pnpm build    # Production build
pnpm start    # Production server
pnpm lint     # Biome check + auto-fix
pnpm test     # Vitest run
pnpm upgrade  # pnpm update && pnpm prune
pnpm clean    # rimraf .next out node_modules && pnpm install
pnpm repomix  # Generate a markdown snapshot of the codebase for agents
```

## References

- [Next.js](https://nextjs.org/docs)
- [HeroUI](https://www.heroui.com/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Zustand](https://zustand.docs.pmnd.rs/)
- [Biome](https://biomejs.dev/)
- [AGENTS.md standard](https://agents.md/)
- [Agent Skill spec](https://agentskills.io/specification)
- [`DESIGN.md`](./DESIGN.md) — Complete design system reference
