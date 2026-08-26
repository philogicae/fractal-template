## [unreleased]

### 🚀 Features

- Feat: add AI agent config, Zustand stores, CI workflow, and enhanced API
- Add AGENTS.md and SKILLS.md for AI assistant integration
- Implement Zustand stores (theme with persist, counter with undo)
- Add GitHub Actions lint workflow with Biome
- Create /skills.md API route for dynamic skill discovery
- Refactor ThemeToggle to use global theme store
- Add TypeScript return types across all components
- Enhance /test page with API testing and Zustand demo
- Update README with project structure and clone instructions
- Feat: add reusable UI components, Footer, responsive layout, and fix theme persistence
  Adds Container, FeatureCard, StatusBadge components with @components barrel exports;
  adds Footer integrated into root layout; adds mobile hamburger menu to Navbar;
  updates landing, playground, and 404 pages for mobile-first responsiveness;
  refreshes AGENTS.md/README.md/SKILLS.md with HeroUI v3 patterns.
  Fixes dark/light mode to properly restore user preference on return visits
  by adding an inline theme initialization script that reads localStorage
  before hydration, preventing flash of incorrect theme.
- Feat: comprehensive UI/UX overhaul with performance optimizations and new utilities
- Add error.tsx error boundary and loading.tsx skeleton UI
- Rename /test to /playground with memoized components and improved state management
- Add debounce hooks (useDebounce, useDebouncedCallback, useDebounceState)
- Add media query hooks (useMediaQuery, useBreakpoint)
- Refactor Navbar with memoized sub-components (Logo, DesktopNav, MobileNav, NavLink)
- Refactor ThemeToggle with granular Zustand selectors and hydration handling
- Refactor landing page with CSS animations (AnimatedSection, BackgroundDecor)
- Add animations to globals.css (fade-in, scale-in, slide-in, pulse-glow, shimmer)
- Add security headers and caching to next.config.mjs (HSTS, CSP, 7 headers total)
- Add API route caching with unstable_cache in skills.md/route.ts
- Update all documentation (AGENTS.md, SKILLS.md, README.md) with accurate structure
- Biome linting passes on all 23 files, TypeScript strict mode validated
- Feat: major template overhaul - next-themes, no barrel exports, AGENTS.md v2, Docker

- Replace custom Zustand theme store with next-themes (providers.tsx)
- Remove barrel export pattern from components/ and stores/
- Rewrite AGENTS.md with customization checklist and structured guidance
- Add CHECKLIST.md for project bootstrap tracking
- Add CHANGELOG.md and git-cliff config (cliff.toml)
- Refactor Dockerfile with multi-stage build and node-caged base
- Simplify globals.css design tokens (violet-cyan duotone)
- Update all components with explicit React.ReactElement return types
- Add Skeleton.tsx component and update ThemeToggle for next-themes
- Update next.config.mjs with security headers and caching
- Delete app/stores/theme.ts and app/utils/theme-script.ts (obsolete)
- Update tsconfig.json path aliases (remove @components barrel)
- Feat: add Vercel Analytics and Speed Insights with environment-based conditional rendering
- Feat: add complete internationalization (i18n) system with 4 locales

- Add provider-based i18n layer (no URL segment) with cookie + Accept-Language detection
- Implement server-side locale resolution via getCurrentDictionary()
- Add client LocaleProvider with useLocale() and useDict() hooks
- Create LanguageSwitcher component with HeroUI dropdown
- Add 4 locale dictionaries: en, fr, es, ro with full translations
- Update all pages (landing, error, not-found, playground) for i18n
- Integrate i18n into Navbar, Footer, ThemeToggle components
- Update site config to use labelKey-based navigation
- Add @i18n path alias and update tsconfig
- Update AGENTS.md, SKILLS.md, README.md with i18n conventions
- Feat: auto-sync SKILLS.md version from package.json in /skills.md route
- Feat: add comprehensive design system with dual-theme support and SKILL.md rename

- Add DESIGN.md with complete design tokens, colors, typography, and patterns
- Rename SKILLS.md → SKILL.md (singular) across all files and routes
- Refactor globals.css with dark/light mode CSS variables (pitch black canvas
  with neon lime/cyan in dark; sky white with Mediterranean sunrise in light)
- Update all components to use new --color-\* token naming conventions
- Ship with 4 locales (en, fr, es, ro) by default
- Remove empty app/api/skills/ stub
- Sync AGENTS.md, CHECKLIST.md, README.md with DESIGN.md references
- Feat: add floating navbar with rounded corners and border styling
- Feat: add useClickOutside hook, custom dropdowns, and SEO sitemap

- Add useClickOutside utility hook for dropdown dismiss behavior
- Refactor LanguageSwitcher to custom implementation (replaces HeroUI Dropdown)
- Update ThemeToggle with design-system hover states (inverted colors on hover)
- Add click-outside behavior to mobile menu in Navbar
- Add app/sitemap.ts for automatic SEO sitemap generation
- Update manifest.json with full PWA config (icons, screenshots, display_override)
- Update robots.txt with sitemap reference
- Sync all documentation: AGENTS.md, CHECKLIST.md, DESIGN.md, README.md, SKILL.md
- Update public assets (favicon, PWA icons, OpenGraph screenshot)
- Feat: replace raw color values with CSS variables, fix Tailwind v4 syntax, sync DESIGN.md

- Replace hardcoded white/black in hover states with --color-ghost-white/--color-pitch-black
- Update ThemeToggle, LanguageSwitcher, Navbar hover classes to use semantic tokens
- Fix globals.css theme toggle comment and values
- Fix Tailwind v4 syntax: rounded-[var(--*)] → rounded-(--\*)
- Add Heading Gradient tokens section to DESIGN.md
- Add shadow-halo-color to Shadows tables in DESIGN.md
- Ensure DESIGN.md and globals.css stay synchronized
- Feat: content-negotiated skill.md with minification, home button, mobile fonts

- Transform /skill.md route with content negotiation: styled HTML for browsers
  (markdown rendering, YAML frontmatter highlighting, dark/light theme toggle)
  and raw markdown for agents/curl via Accept header + User-Agent detection
- Add home button (house icon) to left of theme toggle in skill.md header
- Remove all CSS/HTML comments from STYLES and template to prevent pollution
- Add terser + csso dependencies for proper minification
- Minify inline CSS using csso, minify + obfuscate JS using terser
- Add mobile-responsive font sizes (smaller base on <640px screens)
- Add removeConsole to next.config.mjs for app-wide optimization
- Sync DESIGN.md Quick Start CSS with globals.css structure
- Update README.md design token examples to match actual color system
- Feat: add ?raw=1 query parameter for raw markdown in /skill.md route

- Update SKILL.md frontmatter notes to document ?raw=1 parameter usage
- Add @source exclusions in globals.css to prevent Tailwind scanning markdown files
- Update playground endpoint tests to use /skill.md?raw=1 for raw markdown fetch
- Feat: improve content negotiation in /skill.md with tool detection and priority logic
- Feat: expand i18n to 12 locales, rebrand to fractal-template, polish footer

- i18n: add 8 new locales (ar, de, it, ja, ko, pt, ru, zh) sorted by speakers
- brand: rename nextjs-template → fractal-template across all files
- site: update URL to fractal-template.binaryeyelabs.xyz
- footer: add credits link, a11y improvements (sr-only, aria-hidden), cleaner layout
- Feat: upgrade to Node.js 26, pnpm 11.9, add Vitest testing infra

- Node.js 26 everywhere: Dockerfile, CI, @types/node
- pnpm 11.9.0 with updated lockfile
- Add vitest + jsdom, vitest.config.js, CI test job, npm scripts
- Update all deps: HeroUI 3.2.2, Next 16.2.10, Biome 2.5.3, Tailwind 4.3.2, etc.
- CI: trigger on all branches, depot runners, actions/checkout@v7, Next.js cache
- Remove .mdx from resolveExtensions, fix next-env.d.ts path
- Feat: audit bug fixes, fractal-cloud topbar restyle, and unit test suite

fix:

- useClickOutside: accept panel+trigger element ids so menus close via
  their own toggle (mousedown-close + click-reopen race); add Escape-to-close
- Navbar: pass onClick to external nav links so the mobile menu closes on tap
- landing CTAs: replace button-in-anchor nesting with styled anchors
- Footer: server-computed year prop (prerender hydration drift); derive
  author, credits URL and sr-only social labels from siteConfig (+author field)
- biome: scope md exclusion to root (!\*.md) so app/skill.md/route.ts is
  formatted and linted again; fix tab indentation and unused params

perf:

- skill.md route: cache rendered HTML via unstable_cache (marked/csso/terser
  run once per content revision; ~20ms warm)
- deps: remove unused react-icons; prune redundant @source directive

ui:

- port fractal-cloud topbar: soft sky->cloud->azure navbar wash (100deg),
  deep-ocean nav text, light-mode logo invert(1), shadow-xl pill;
  remove dead --color-navbar-\* tokens

test:

- add vitest suite (54 tests / 10 files): i18n registry key-parity across
  12 locales, nav labelKey contract, locale resolution priority
  (cookie > Accept-Language > default), useClickOutside dismissal contract,
  debounce hooks (fake timers), useMediaQuery (matchMedia stub), cn() merge,
  /api/hello echo + 400, /skill.md content negotiation + version sync
- add act/createRoot harness (app/test/react.tsx, no testing-library)
  and server-only stub alias in vitest.config.js

docs/assets:

- sync DESIGN.md (navbar wash + component spec) and AGENTS.md (hook
  signature, new Tests section)
- regenerate public/images/screenshot.jpeg (1280x720, no dev overlay)
- bump biome schema to 2.5.10, version 1.10.0, ignore .playwright-cli/

### 🐛 Bug Fixes

- Fix: update navbar logo styling and site config shortName

### 💼 Changes

- Init

### 🚜 Refactor

- Refactor: standardize counter button min-width values in playground
- Refactor: reduce component sizes and spacing for more compact UI
- Refactor: make Docker Compose configuration fully customizable via .env
- Refactor: remove redundant `code` field from locale metadata

### 📚 Documentation

- Docs: add OpenGraph/Twitter card image and update siteConfig.url to production domain
- Docs: clarify i18n best practices and simplify default locale setup

### ⚙️ Miscellaneous Tasks

- Chore: remove explicit pnpm version from CI workflow
- Chore: update github actions and add Next.js build job
- Chore: remove unused resource hints and optimize image configuration

- Remove Google Fonts preconnect links from layout (not used)
- Replace unoptimized prop with responsive sizes in Navbar Logo
- Clean up robots.txt formatting (remove empty sitemap reference)
- Chore: update changelog
- Chore: update changelog
- Chore: update changelog
- Chore: update changelog
- Chore: bump pnpm to 11.0.8 and version to 1.5.0
- Chore: bump Next.js to 16.2.5, update docs to reflect pnpm 11 and scoped lint command

- deps: upgrade next from 16.2.4 to 16.2.5
- docs: update pnpm requirement from 10+ to 11+ across AGENTS.md, README.md, SKILL.md
- docs: clarify lint command runs `biome check --write app --unsafe` (scoped to app directory)
- version: bump to 1.5.1
- chore: add LanguageSwitcher.tsx to SKILL.md component tour
- Chore: update changelog
- Chore: bump dependencies and add minimumReleaseAge config
- Chore: bump dependencies
- Chore: bump dependencies
- Chore: add passWithNoTests to vitest config to prevent CI failures when no tests exist
- Chore: update deps
- Chore: simplify Docker env vars, use DOCKER_PROJECT_NAME for container and image names
- Chore: upgrade pnpm to 11.17.0 and bump dependencies
- Chore: upgrade TypeScript to 7.0.2 and jsdom to 30.0.1
- Chore: upgrade pnpm to 11.22.0, Next.js to 16.3.1, and add Cloudflare Web Analytics support
