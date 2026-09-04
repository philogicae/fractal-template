# Project Bootstrap Checklist

> **Audience.** AI agents (and humans) customizing a new project from `philogicae/fractal-template`. Tick boxes as you go so the next agent picking up the work sees exactly what is left.
>
> **How to use.** Work top to bottom. Every unchecked box is something a fresh clone of the template still ships with. Do not skip §6 (Sanity checks).
>
> **Companion docs.**
>
> - [`AGENTS.md`](./AGENTS.md) — in-repo conventions for agents (code style, patterns, common tasks).
> - [`SKILL.md`](./SKILL.md) — bootstrap skill served at `/skill.md` for agent discovery.
> - [`DESIGN.md`](./DESIGN.md) — complete design system reference (colors, typography, components).
> - [`README.md`](./README.md) — human-facing overview.
>
> Keep these in sync with this checklist whenever you add/remove routes, stores, components, or env variables.

---

## 1. Identity & metadata

> **Most identity fields now live in one file.** Edit `app/config/site.ts` first — it drives `app/layout.tsx` metadata (title, description, applicationName, keywords, openGraph, viewport.themeColor), `Navbar` branding, `Footer` socials, and landing-page CTAs.

- [ ] `app/config/site.ts` → `name`
- [ ] `app/config/site.ts` → `shortName`
- [ ] `app/config/site.ts` → `author` (consumed by `Footer`)
- [ ] `app/config/site.ts` → `description`
- [ ] `app/config/site.ts` → `keywords`
- [ ] `app/config/site.ts` → `url`
- [ ] `app/config/site.ts` → `license`
- [ ] `app/config/site.ts` → `themeColor.light` / `themeColor.dark`
- [ ] `app/config/site.ts` → `nav` entries (remove `/playground`; keep or drop `/skill.md` — see §5)
- [ ] `app/config/site.ts` → `social` entries (GitHub, X)
- [ ] `package.json` → `name`
- [ ] `package.json` → `description`
- [ ] `package.json` → `repository.url`
- [ ] `package.json` → `homepage`
- [ ] `package.json` → `version` (reset to `0.1.0`)
- [ ] `public/manifest.json` → full PWA config: `name`, `short_name`, `id`, `description`, `scope`, `start_url`, `icons` (192x192 + 512x512 with `any` and `maskable` purposes), `screenshots`
- [ ] `app/sitemap.ts` → update routes and URLs to match your site
- [ ] `public/robots.txt` → update host to match `siteConfig.url`
- [ ] `LICENSE` → update copyright holder or replace

## 2. Public assets

> `public/images/` ships with template placeholder assets (logo.gif, apple-touch-icon.png, 192x192.png, 512x512.png, screenshot.jpeg). Replace each with your own branded files — until you do, the references in `app/layout.tsx`, `app/layout/Navbar.tsx`, and `public/manifest.json` will keep pointing at the template placeholders.

- [ ] `public/favicon.ico`
- [ ] `public/images/logo.gif` (used in `Navbar`)
- [ ] `public/images/apple-touch-icon.png`
- [ ] `public/images/192x192.png`
- [ ] `public/images/512x512.png`
- [ ] `public/images/screenshot.jpeg` (OpenGraph / Twitter card image)

## 3. Layout / chrome

> `Navbar` and `Footer` are driven by `siteConfig` (§1). The only hardcoded chrome left here is the logo image itself.

- [ ] `public/images/logo.gif` → replace the shipped placeholder with your brand logo (referenced by `app/layout/Navbar.tsx`)

## 4. Landing page & design tokens

> **Note:** This template ships with a pre-configured design system. See [`DESIGN.md`](./DESIGN.md) for the complete reference (colors, typography, spacing, components). When customizing, you can either:
> - Keep the existing system and just update content (hero text, CTAs, features)
> - Or fully replace the design tokens in `globals.css` with your own brand
>
> **Looking for design inspiration?** Browse curated design templates at [styles.refero.design](https://styles.refero.design/).
>
> **Critical:** `DESIGN.md` and `app/globals.css` must always stay in sync. When you modify design tokens in `globals.css`, immediately update `DESIGN.md` to match. These are twin source-of-truth files — the CSS is the implementation, the markdown is the documentation.

- [ ] `app/page.tsx` → replace hero headline and subtitle (user-visible strings live in `app/i18n/dictionaries/*.json` under `landing.*`)
- [ ] `app/page.tsx` → replace / prune CTA buttons (`/playground`, `/skill.md`, GitHub from `siteConfig.url`, Deploy to Vercel)
- [ ] `app/page.tsx` → replace the `features` array (names stay in TS, descriptions live in `dict.landing.features.*`)
- [x] [`DESIGN.md`](./DESIGN.md) → Design system reference (light/dark modes)
- [x] `app/globals.css` → Design tokens with dark/light mode color variables
- [x] `app/globals.css` → FOUC prevention with white/black background colors
- [x] `app/globals.css` → Complete spacing scale and component classes

### Internationalization

> **Important:** The template ships with 12 locales (`en`, `zh`, `es`, `ar`, `fr`, `pt`, `ru`, `ja`, `de`, `ko`, `it`, `ro` — same order as `app/i18n/config.ts`). When customizing, **delete the extra locales you don't need** and keep only `en.json` (or the locales the user specifically requests).
>
> **All user-visible text must use i18n** — no hardcoded strings in components. In Server Components use `const { dict } = await getCurrentDictionary()`, in Client Components use `const dict = useDict()`.

- [ ] `app/i18n/dictionaries/en.json` → translate every `landing.*`, `playground.*`, `nav.*`, `footer.*`, `error.*`, `notFound.*` string for the new product
- [ ] Delete extra locale files you don't need (e.g., `zh.json`, `ar.json`, `ja.json`)
- [ ] In `app/i18n/config.ts`, remove imports and map entries for deleted locales
- [ ] (Only if user needs more locales) Add each new locale: create `app/i18n/dictionaries/<code>.json`, add import + map entry in `app/i18n/config.ts`
- [ ] Each dictionary file has a valid `meta: { flag, native }` — this is what the language switcher renders
- [ ] `app/config/site.ts` → every nav entry has a `labelKey`; when you add / rename one, also add the key to `NavLabelKey` and to `dict.nav` in every locale file

## 5. Delete demo-only code

These exist **only** to showcase the template. Remove unless the user explicitly wants them kept.

- [ ] `app/playground/` — entire directory
- [ ] `app/api/hello/` — delete or replace with real endpoints
- [ ] `app/stores/counter.ts`
- [ ] `app/components/FeatureCard.tsx` — if unused, delete
- [ ] `app/components/StatusBadge.tsx` — if unused, delete
- [ ] Landing-page buttons in `app/page.tsx` pointing to `/playground`, `/skill.md`, the GitHub repo, or "Deploy to Vercel"
- [ ] `/playground` entry in `siteConfig.nav` (`app/config/site.ts`)
- [ ] `/skill.md` entry in `siteConfig.nav` — **only if** you also remove the agent surface (see next section)

### `SKILL.md` — rewrite (default) or delete

Choose one path:

- [ ] **Rewrite** `SKILL.md` to describe the new app (routes, API, env, how an agent should interact). Use the template in `SKILL.md` §5 as a starting point. Keep `app/skill.md/route.ts` and the `/skill.md` nav entry.
- [ ] **Delete** the agent surface entirely: remove `SKILL.md`, `app/skill.md/`, the `/skill.md` entry in `siteConfig.nav`, and any landing-page button that links to `/skill.md`.

## 6. Environment & infrastructure

- [ ] `.env.example` → prune placeholders, add real variables, document each (`CF_WEB_ANALYTICS_TOKEN` is optional — it enables the Cloudflare Web Analytics beacon in `app/layout.tsx` when set)
- [ ] `compose.yaml` → no edits needed; set `DOCKER_PROJECT_NAME` (compose project name, reused for the container and image names) and `DOCKER_PORT` in `.env` to override the `fractal-template` / `3000` defaults
- [ ] `Dockerfile` → no change needed unless you customize the build (multi-stage, standalone output, non-root runner with HEALTHCHECK)
- [ ] `.github/workflows/ci-cd.yml` → ready to use as-is; review only if you add tests or deploy targets
- [ ] `next.config.mjs` → tighten `images.remotePatterns` to your actual image hosts and add a page-level CSP header if your app needs one (SVG responses already get a strict per-image CSP)

## 7. Documentation

- [ ] `README.md` → rewrite for the new project (title, features, scripts, deployment)
- [ ] `DESIGN.md` → customize to describe your app's design system (or delete if not needed)
- [ ] `AGENTS.md` → update the **Customization checklist**, **Demo code to remove**, and **Project structure** sections to reflect what actually remains. Keep it in sync as you add routes / stores / env variables.
- [ ] `CHECKLIST.md` (this file) → once every box is ticked, either delete it or replace it with a project-specific checklist (deploy steps, release process, etc.)

## 8. Sanity checks before handing off

Run these and fix anything that fails.

- [ ] `pnpm lint` — Biome auto-fix passes
- [ ] `pnpm build` — production build succeeds
- [ ] `pnpm dev` — app boots on http://localhost:3000 with no console errors
- [ ] Every route in `siteConfig.nav` resolves (no 404s)
- [ ] `/playground`, `/api/hello`, `/skill.md` return the expected result (200 if kept, 404 if deleted)
- [ ] Language switcher in the navbar cycles through every locale you ship and the visible strings actually change (no stale English)
- [ ] No leftover template branding — grep should return only intentional matches:

  ```bash
  rg -i "next\.js template|philogicae|fractal-template|playground|counter"
  ```

- [ ] `AGENTS.md` customization checklist no longer lists items that have been completed
- [ ] `SKILL.md` either describes the new app or has been deleted (with its route handler)
