# Design System — Style Reference
> Browse curated design templates at [styles.refero.design](https://styles.refero.design/)

**Theme:** dark + light variants

A sophisticated interface with two distinct personalities. In dark mode, pitch black creates an immersive, professional command center canvas punctuated by neon lime and cyan accents — high contrast, high energy, developer-tool aesthetic. In light mode, sky white provides a fresh, airy background; the navbar carries a soft sky-to-azure wash (Sky White → Cloud Light → Azure Mist) anchored by turquoise accents. Both modes share Inter Variable typography with tight tracking and compact 6px-radius components.

## Tokens — Colors

### Primitive Colors — Dark Mode

| Name | Value | Token | Role |
|------|-------|-------|------|
| Pitch Black | `#08090a` | `--color-pitch-black` | Page background — the deepest black creates an immersive, pro-grade canvas |
| Void | `#0a0a0f` | `--color-void` | Near-black void surfaces for deep UI sections |
| Graphite | `#111113` | `--color-graphite` | Elevated card backgrounds — one step up from pitch black |
| Slate Elevated | `#1a1a1e` | `--color-slate-elevated` | Secondary elevated surfaces for prominent cards |
| Slate Border | `#27272a` | `--color-slate-border` | Borders and dividers — the defining edge color |
| Slate Muted | `#3f3f46` | `--color-slate-muted` | Subtle borders, tertiary surfaces, disabled states |
| Ghost White | `#f8fafc` | `--color-ghost-white` | Primary text and icons — high contrast against dark surfaces |
| Cloud | `#cbd5e1` | `--color-cloud` | Secondary text — slightly subdued for supporting content |
| Steel Blue | `#94a3b8` | `--color-steel-blue` | Tertiary text, inactive states, metadata |
| Slate Dim | `#64748b` | `--color-slate-dim` | Muted labels and helper text |
| Neon Lime | `#a3e635` | `--color-neon-lime` | **Primary accent** — CTA buttons, gradient starts, focus states |
| Cyan Glow | `#06b6d4` | `--color-cyan-glow` | **Secondary accent** — gradient ends, highlights, info states |
| Electric Violet | `#8b5cf6` | `--color-electric-violet` | Decorative gradients, special highlights, purple accents |
| Hot Pink | `#ec4899` | `--color-hot-pink` | Attention grabbers, decorative accents |
| Emerald | `#10b981` | `--color-emerald` | Success states, positive indicators, confirmation |
| Amber | `#f59e0b` | `--color-amber` | Warning states, caution indicators |
| Rose | `#f43f5e` | `--color-rose` | Critical errors, destructive actions, alerts |

### Primitive Colors — Light Mode

| Name | Value | Token | Role |
|------|-------|-------|------|
| Sky White | `#f0f9ff` | `--color-sky-white` | Page background — light blue sky creates an airy, fresh canvas |
| Cloud Light | `#e0f2fe` | `--color-cloud-light` | Elevated surfaces, soft blue elevation |
| Azure Mist | `#bae6fd` | `--color-azure-mist` | Secondary backgrounds, borders, dividers |
| Sand Pale | `#fefce8` | `--color-sand-pale` | Warm highlights, soft accents, selected states |
| Deep Ocean | `#0c4a6e` | `--color-deep-ocean` | Primary text — sea blue anchors the typography |
| Sea Stone | `#334155` | `--color-sea-stone` | Secondary text — muted blue-gray for supporting content |
| Warm Slate | `#475569` | `--color-warm-slate` | Tertiary text, metadata, helper text |
| Turquoise | `#06b6d4` | `--color-turquoise` | **Primary accent** — Mediterranean water, main interactive color |
| Azure | `#0ea5e9` | `--color-azure` | **Secondary accent** — morning sky, gradient partner |
| Coral Soft | `#fda4af` | `--color-coral-soft` | Soft sunset accents, decorative highlights |
| Sand Warm | `#fde68a` | `--color-sand-warm` | Warm sandy highlights, warning tints |

### Navbar Wash — Light Mode

The light-mode navbar is a soft cool wash at 100deg (see `html:not(.dark) header` in `globals.css`): Sky White → Cloud Light → Azure Mist. Logo/nav text renders in Deep Ocean for contrast; no dedicated gradient tokens are used.

### Heading Gradient Tokens

| Name | Token | Dark Mode Value | Light Mode Value |
|------|-------|---------------|------------------|
| Gradient Start | `--color-heading-gradient-start` | `var(--color-neon-lime)` | `var(--color-amber)` |
| Gradient End | `--color-heading-gradient-end` | `var(--color-cyan-glow)` | `var(--color-azure)` |

### Semantic Tokens — Dark Mode

| Role | Token | Value |
|------|-------|-------|
| Background Primary | `--color-bg-primary` | `var(--color-pitch-black)` |
| Background Secondary | `--color-bg-secondary` | `var(--color-graphite)` |
| Background Elevated | `--color-bg-elevated` | `var(--color-slate-elevated)` |
| Background Surface | `--color-bg-surface` | `var(--color-slate-border)` |
| Text Primary | `--color-text-primary` | `var(--color-ghost-white)` |
| Text Secondary | `--color-text-secondary` | `var(--color-cloud)` |
| Text Muted | `--color-text-muted` | `var(--color-steel-blue)` |
| Text Tertiary | `--color-text-tertiary` | `var(--color-slate-dim)` |
| Border Default | `--color-border-default` | `var(--color-slate-border)` |
| Border Subtle | `--color-border-subtle` | `var(--color-slate-muted)` |
| Border Input | `--color-border-input` | `var(--color-slate-muted)` |
| Accent Primary | `--color-accent-primary` | `var(--color-neon-lime)` |
| Accent Secondary | `--color-accent-secondary` | `var(--color-cyan-glow)` |
| Accent Hover | `--color-accent-hover` | `#bef264` (lightened lime) |

### Semantic Tokens — Light Mode

| Role | Token | Value |
|------|-------|-------|
| Background Primary | `--color-bg-primary` | `var(--color-sky-white)` |
| Background Secondary | `--color-bg-secondary` | `var(--color-cloud-light)` |
| Background Elevated | `--color-bg-elevated` | `var(--color-sky-white)` |
| Background Surface | `--color-bg-surface` | `var(--color-azure-mist)` |
| Text Primary | `--color-text-primary` | `var(--color-deep-ocean)` |
| Text Secondary | `--color-text-secondary` | `var(--color-sea-stone)` |
| Text Muted | `--color-text-muted` | `var(--color-warm-slate)` |
| Text Tertiary | `--color-text-tertiary` | `#64748b` |
| Border Default | `--color-border-default` | `var(--color-azure-mist)` |
| Border Subtle | `--color-border-subtle` | `var(--color-cloud-light)` |
| Border Input | `--color-border-input` | `var(--color-azure-mist)` |
| Accent Primary | `--color-accent-primary` | `var(--color-turquoise)` |
| Accent Secondary | `--color-accent-secondary` | `var(--color-azure)` |
| Accent Hover | `--color-accent-hover` | `#0891b2` (darkened turquoise) |

---

## Tokens — Typography

### Inter Variable — All UI text including headings, body text, and interactive elements

**Weights:** 300, 400, 510, 590  
**Substitute:** Inter (Google Fonts) with weights 300, 400, 500, 600  
**Sizes:** 10px, 13px, 14px, 16px, 17px, 24px, 32px, 48px, 72px  
**Line height:** 1.0–1.47  
**Letter spacing:** -0.22px to -0.1px  
**Role:** Clean, modern, highly legible at small sizes. Weight 590 is the signature semibold for buttons and emphasis; weight 300 for display headlines creates an airy, open feel. Tight tracking (-0.13px at 14px) keeps UI text crisp and compact.

### IBM Plex Mono — Code snippets, technical details, data displays

**Weight:** 400  
**Substitute:** JetBrains Mono, SFMono-Regular, Menlo  
**Sizes:** 13px, 14px  
**Line height:** 1.4–1.69  
**Role:** Monospace signals machine-generated or technical content within prose. Used for API responses, code blocks, and inline technical annotations.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.4 | -0.1px | `--text-caption` |
| body-sm | 13px | 1.4 | -0.11px | `--text-body-sm` |
| body | 14px | 1.4 | -0.13px | `--text-body` |
| body-lg | 16px | 1.47 | -0.15px | `--text-body-lg` |
| heading-sm | 17px | 1.2 | -0.12px | `--text-heading-sm` |
| heading | 24px | 1.33 | -0.22px | `--text-heading` |
| heading-lg | 32px | 1.2 | -0.22px | `--text-heading-lg` |
| display-sm | 48px | 1.2 | -0.22px | `--text-display-sm` |
| display | 72px | 1.0 | -0.22px | `--text-display` |

---

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Token | Value |
|-------|-------|
| `--spacing-4` | 4px |
| `--spacing-8` | 8px |
| `--spacing-12` | 12px |
| `--spacing-16` | 16px |
| `--spacing-20` | 20px |
| `--spacing-24` | 24px |
| `--spacing-28` | 28px |
| `--spacing-32` | 32px |
| `--spacing-36` | 36px |
| `--spacing-40` | 40px |
| `--spacing-48` | 48px |
| `--spacing-56` | 56px |
| `--spacing-64` | 64px |
| `--spacing-80` | 80px |
| `--spacing-96` | 96px |
| `--spacing-128` | 128px |

### Layout

| Property | Value | Token |
|----------|-------|-------|
| Element gap | 8px | `--element-gap` |
| Section gap | 24px | `--section-gap` |
| Card padding | 12px | `--card-padding` |
| Page max-width | 1200px | `--page-max-width` |
| Navbar height | 48px | `--navbar-height` |
| Navbar mobile | 44px | `--navbar-height-mobile` |

### Border Radius

| Element | Value | Token |
|---------|-------|-------|
| Pill | 9999px | `--radius-pill` |
| Tags | 2px | `--radius-tags` |
| Badges | 4px | `--radius-badges` |
| Cards | 6px | `--radius-cards` |
| Inputs | 6px | `--radius-inputs` |
| Buttons | 6px | `--radius-buttons` |
| Default | 6px | `--radius-default` |

### Shadows — Dark Mode

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.4) 0px 2px 4px 0px` | `--shadow-sm` |
| md | `rgba(0, 0, 0, 0.2) 0px 0px 12px 0px inset` | `--shadow-md` |
| subtle | `rgb(35, 37, 42) 0px 0px 0px 1px inset` | `--shadow-subtle` |
| subtle-2 | `rgba(0, 0, 0, 0.2) 0px 0px 0px 1px` | `--shadow-subtle-2` |
| subtle-3 | Complex multi-layer shadow | `--shadow-subtle-3` |
| xl | `rgba(8, 9, 10, 0.6) 0px 4px 32px 0px` | `--shadow-xl` |
| input | `rgba(0, 0, 0, 0.2) 0px 0px 0px 1px` | `--shadow-input` |
| focus | `rgba(228, 242, 34, 0.4) 0px 0px 0px 2px` | `--shadow-focus` |
| halo-color | `transparent` | `--shadow-halo-color` | Logo halo effect (used in light mode) |

### Shadows — Light Mode

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(6, 182, 212, 0.06) 0px 2px 4px 0px` | `--shadow-sm` |
| md | `rgba(14, 165, 233, 0.04) 0px 0px 12px 0px inset` | `--shadow-md` |
| subtle | `rgb(224, 242, 254) 0px 0px 0px 1px inset` | `--shadow-subtle` |
| subtle-2 | `rgba(6, 182, 212, 0.08) 0px 0px 0px 1px` | `--shadow-subtle-2` |
| subtle-3 | Complex multi-layer cyan-tinted shadow | `--shadow-subtle-3` |
| xl | `rgba(6, 182, 212, 0.1) 0px 4px 32px 0px` | `--shadow-xl` |
| input | `rgba(6, 182, 212, 0.08) 0px 0px 0px 1px` | `--shadow-input` |
| focus | `rgba(6, 182, 212, 0.3) 0px 0px 0px 2px` | `--shadow-focus` |
| halo-color | `rgba(0, 0, 0, 0.3)` | `--shadow-halo-color` | Logo halo for white logo on light bg |

---

## Components

### Navbar

**Role:** Top-level navigation — logo, nav links, language switcher, theme toggle, mobile menu

- Floating pill: `sticky top-3 z-50 mx-3 sm:mx-4 md:mx-6 rounded-lg shadow-(--shadow-xl)`, `border` `--color-border-default`, solid `--color-bg-primary` in dark mode
- **Light mode:** the pill carries a soft sky-to-azure wash (Sky White → Cloud Light → Azure Mist, 100deg, see `html:not(.dark) header`); logo/nav text becomes deep-ocean
- Height: `--navbar-height` (desktop) / `--navbar-height-mobile` (mobile); padding `px-3 sm:px-4 md:px-6`
- Hover rule: nav links and the lang switcher get a surface fill with primary text (`--color-bg-surface` / `--color-text-primary`); the theme toggle inverts to `--color-pitch-black` / `--color-ghost-white`
- Mobile menu: absolute dropdown below the pill (`top-[calc(100%+8px)] right-0`, `rounded-(--radius-cards)`, `bg-secondary`, `shadow-lg`, `z-50`); dismisses on outside click and `Escape`

**Logo** (`globals.css`): the `logo.gif` mark is white-on-transparent. It renders untouched in dark mode; in light mode CSS `invert(1)` flips the glyph dark so it reads against the light navbar wash (matching the deep-ocean nav text).

### Primary Action Button (Filled)
**Role:** Main CTA — Get Started, Submit, Confirm

Dark mode: Background `#a3e635` (Neon Lime), text `#08090a` (Pitch Black), border-radius 6px, padding 12px 24px, font Inter 590 15px. Hover: slight brightness increase.

Light mode: Background `#06b6d4` (Turquoise), text `#f0f9ff` (Sky White), border-radius 6px, same padding and font. Hover: slight brightness increase.

### Ghost Navigation Button
**Role:** Navigation and secondary actions

Background transparent, text `--color-text-primary`, border-radius 0px (in nav) or 6px (standalone), no explicit padding. Hover: subtle background fill at 50% opacity of surface color.

### Dropdown Menus (Language & Mobile)
**Role:** Floating menus that overlay content without pushing page elements

- **Position:** Absolute, floating over content (`absolute top-[calc(100%+8px)] right-0`)
- **Background:** `--color-bg-secondary` (graphite in dark, cloud-light in light)
- **Border:** 1px solid `--color-border-default`
- **Border radius:** `--radius-cards` (6px)
- **Shadow:** `--shadow-xl`
- **Z-index:** 50 to overlay other content
- **Minimum width:** 160px (lang), 200px (mobile)
- **Spacing:** 8px gap from trigger (`top-[calc(100%+8px)]`)

**Click-outside behavior:** Menus close when clicking anywhere on the page — including the navbar/topbar — except inside the dropdown menu itself or its trigger, and close on `Escape`. Implemented via the `useClickOutside` hook (pass both panel and trigger ids).

### Theme Toggle Icon
**Role:** Sun/moon icon for dark/light mode switching

- **Default color:** `--color-accent-primary` (neon lime in dark, turquoise in light)
- **Dark mode hover:** `--color-text-primary` background (white) with `--color-bg-primary` icon (black)
- **Light mode hover:** `--color-text-primary` background (black) with `--color-bg-primary` icon (white)
- **Size:** 6x6 (mobile), 8x8 (desktop) rounded button

### Default Card
**Role:** Content container

Dark mode: Background `#111113` (Graphite), border 1px solid `#27272a`, border-radius 6px, shadow `rgba(0, 0, 0, 0.4) 0px 2px 4px 0px`, padding 12px.

Light mode: Background `#f0f9ff` (Sky White), border 1px solid `#bae6fd`, border-radius 6px, shadow `rgba(6, 182, 212, 0.06) 0px 2px 4px 0px`, padding 12px.

### Elevated Card
**Role:** Prominent content, modals, dialogs

Dark mode: Background `#1a1a1e` (Slate Elevated), border-radius 6px, inset shadow `rgb(35, 37, 42) 0px 0px 0px 1px`, padding 24px vertical.

Light mode: Background `#f0f9ff`, border 1px solid `#bae6fd`, same radius and padding.

### Input Field
**Role:** User input, form fields

Dark mode: Background transparent with `#27272a` border, text `#f8fafc`, border-radius 6px, padding 12px 14px. Focus: border color shifts to lighter, shadow appears.

Light mode: Background `#ffffff`, text `#0c4a6e`, border 1px solid `#bae6fd`, border-radius 6px, padding 12px 14px. Focus: border shifts to turquoise.

### Badge
**Role:** Label or tag

Background `--color-slate-muted` (dark) or `--color-azure-mist` (light), text `--color-text-muted`, border-radius 4px, padding 0px 6px, font 10px.

### Status Badge
**Role:** Status indicator with colored dot

Uses status colors directly on the dot: `--color-emerald` for success, `--color-amber` for warning, `--color-rose` for error, `--color-accent-primary` for loading. Border and background use semantic tokens.

---

## Surfaces

| Level | Name (Dark) | Value | Purpose |
|-------|-------------|-------|---------|
| 0 | Pitch Black | `#08090a` | Base page background — pro, immersive |
| 1 | Graphite | `#111113` | Primary card surface |
| 2 | Slate Elevated | `#1a1a1e` | Prominent cards, modals |
| 3 | Slate Border | `#27272a` | Borders, overlays |

| Level | Name (Light) | Value | Purpose |
|-------|--------------|-------|---------|
| 0 | Sky White | `#f0f9ff` | Base page background — light blue sky |
| 1 | Cloud Light | `#e0f2fe` | Primary card surface — soft blue elevation |
| 2 | Azure Mist | `#bae6fd` | Secondary surfaces, borders |
| 3 | Azure Mist | `#bae6fd` | Borders, dividers — azure tinted |

---

## Elevation

**Dark Mode:** Layered elevation comes from subtle shadows with black tints. Cards use `rgba(0, 0, 0, 0.4) 0px 2px 4px 0px` — just enough to lift off the pitch black ground. Inset shadows like `rgb(35, 37, 42) 0px 0px 0px 1px inset` create internal borders without adding visual weight. Focus states glow with lime: `rgba(228, 242, 34, 0.4) 0px 0px 0px 2px`.

**Light Mode:** Fresh, airy shadows with cyan tints. Cards use `rgba(6, 182, 212, 0.06) 0px 2px 4px 0px` — barely-there elevation that suggests floating on water. The inset border `rgb(224, 242, 254) 0px 0px 0px 1px inset` creates a hairline without harsh edges. Focus states glow with turquoise.

---

## Do's and Don'ts

### Do
- Use Pitch Black (`#08090a`) for dark mode page background — professional, pro feel
- Use Sky White (`#f0f9ff`) for light mode page background — light blue sky, Mediterranean morning
- Apply **paired accents** — Lime + Cyan for dark mode, Turquoise + Azure for light mode
- Use the full warm gradient in light mode navbar: Orange → Amber → Yellow → Sand → Azure Mist
- Layer surfaces for depth using the 4-level hierarchy with subtle color tints
- Use Inter Variable with tight letter-spacing (-0.22px for display, -0.13px for body)
- Maintain 6px default radius (cards, buttons, inputs), 2px tags, 4px badges
- Use Steel Blue (`#94a3b8`) for dark mode tertiary text
- Use Warm Slate (`#475569`) for light mode tertiary text
- Keep layout compact with 8px element gaps
- Use semantic color tokens (`--color-*`) instead of raw hex values

### Don't
- Don't mix accent colors randomly — stick to the defined pairs
- Don't use low-contrast accent combinations
- Don't vary border-radius from the system defaults
- Don't use heavy, diffuse shadows — elevation comes from layered surfaces and color
- Don't use loose letter-spacing on UI text
- Don't break the 4px base unit for spacing
- Don't use raw hex values in components — always use CSS variables

---

## Similar Brands

- **Vercel** — Dark UI with strong typography, geometric layouts, paired accent colors
- **GitHub** — Functional dark-themed UI for developer tools, layered surfaces
- **Linear** — High-contrast dark mode, layered surfaces, clear typography, subdued palette
- **Raycast** — High-contrast dark mode, minimalist design, command-center aesthetic
- **Supabase** — Dark background with vibrant accent colors, developer-focused

---

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors - Dark Mode */
  --color-pitch-black: #08090a;
  --color-void: #0a0a0f;
  --color-graphite: #111113;
  --color-slate-elevated: #1a1a1e;
  --color-slate-border: #27272a;
  --color-slate-muted: #3f3f46;
  --color-ghost-white: #f8fafc;
  --color-cloud: #cbd5e1;
  --color-steel-blue: #94a3b8;
  --color-slate-dim: #64748b;
  --color-neon-lime: #a3e635;
  --color-cyan-glow: #06b6d4;
  --color-electric-violet: #8b5cf6;
  --color-hot-pink: #ec4899;
  --color-emerald: #10b981;
  --color-amber: #f59e0b;
  --color-rose: #f43f5e;

  /* Heading Gradients */
  --color-heading-gradient-start: var(--color-neon-lime); /* dark mode default */
  --color-heading-gradient-end: var(--color-cyan-glow); /* dark mode default */

  /* Colors - Light Mode */
  --color-sky-white: #f0f9ff;
  --color-cloud-light: #e0f2fe;
  --color-azure-mist: #bae6fd;
  --color-sand-pale: #fefce8;
  --color-deep-ocean: #0c4a6e;
  --color-sea-stone: #334155;
  --color-warm-slate: #475569;
  --color-turquoise: #06b6d4;
  --color-azure: #0ea5e9;
  --color-coral-soft: #fda4af;
  --color-sand-warm: #fde68a;

  /* Semantic - Dark Mode */
  --color-bg-primary: var(--color-pitch-black);
  --color-bg-secondary: var(--color-graphite);
  --color-bg-elevated: var(--color-slate-elevated);
  --color-bg-surface: var(--color-slate-border);
  --color-text-primary: var(--color-ghost-white);
  --color-text-secondary: var(--color-cloud);
  --color-text-muted: var(--color-steel-blue);
  --color-text-tertiary: var(--color-slate-dim);
  --color-border-default: var(--color-slate-border);
  --color-border-subtle: var(--color-slate-muted);
  --color-border-input: var(--color-slate-muted);
  --color-accent-primary: var(--color-neon-lime);
  --color-accent-secondary: var(--color-cyan-glow);
  --color-accent-hover: #bef264;

  /* Typography - Font Families */
  --font-sans: "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography - Scale */
  --text-caption: 10px;
  --leading-caption: 1.4;
  --tracking-caption: -0.1px;

  --text-body: 14px;
  --leading-body: 1.4;
  --tracking-body: -0.13px;

  --text-body-sm: 13px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.11px;

  --text-body-lg: 16px;
  --leading-body-lg: 1.47;
  --tracking-body-lg: -0.15px;

  --text-heading-sm: 17px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.12px;

  --text-heading: 24px;
  --leading-heading: 1.33;
  --tracking-heading: -0.22px;

  --text-heading-lg: 32px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.22px;

  --text-display-sm: 48px;
  --leading-display-sm: 1.2;
  --tracking-display-sm: -0.22px;

  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -0.22px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Layout */
  --element-gap: 8px;
  --section-gap: 24px;
  --card-padding: 12px;
  --page-max-width: 1200px;
  --navbar-height: 48px;
  --navbar-height-mobile: 44px;

  /* Border Radius */
  --radius-pill: 9999px;
  --radius-tags: 2px;
  --radius-badges: 4px;
  --radius-cards: 6px;
  --radius-inputs: 6px;
  --radius-buttons: 6px;
  --radius-default: 6px;

  /* Shadows - Dark Mode */
  --shadow-sm: rgba(0, 0, 0, 0.4) 0px 2px 4px 0px;
  --shadow-md: rgba(0, 0, 0, 0.2) 0px 0px 12px 0px inset;
  --shadow-subtle: rgb(35, 37, 42) 0px 0px 0px 1px inset;
  --shadow-subtle-2: rgba(0, 0, 0, 0.2) 0px 0px 0px 1px;
  --shadow-subtle-3: rgba(0, 0, 0, 0.01) 0px 5px 2px 0px, rgba(0, 0, 0, 0.04) 0px 3px 2px 0px, rgba(0, 0, 0, 0.07) 0px 1px 1px 0px, rgba(0, 0, 0, 0.08) 0px 0px 1px 0px;
  --shadow-xl: rgba(8, 9, 10, 0.6) 0px 4px 32px 0px;
  --shadow-input: rgba(0, 0, 0, 0.2) 0px 0px 0px 1px;
  --shadow-focus: rgba(228, 242, 34, 0.4) 0px 0px 0px 2px;
  --shadow-halo-color: transparent;
}

html:not(.dark) {
  /* Semantic Tokens - Mediterranean Summer Morning */
  --color-bg-primary: var(--color-sky-white);
  --color-bg-secondary: var(--color-cloud-light);
  --color-bg-elevated: var(--color-sky-white);
  --color-bg-surface: var(--color-azure-mist);

  --color-text-primary: var(--color-deep-ocean);
  --color-text-secondary: var(--color-sea-stone);
  --color-text-muted: var(--color-warm-slate);
  --color-text-tertiary: #64748b;

  --color-border-default: var(--color-azure-mist);
  --color-border-subtle: var(--color-cloud-light);
  --color-border-input: var(--color-azure-mist);

  --color-accent-primary: var(--color-turquoise);
  --color-accent-secondary: var(--color-azure);
  --color-accent-hover: #0891b2;

  /* Shadows - fresh morning tints */
  --shadow-sm: rgba(6, 182, 212, 0.06) 0px 2px 4px 0px;
  --shadow-md: rgba(14, 165, 233, 0.04) 0px 0px 12px 0px inset;
  --shadow-subtle: rgb(224, 242, 254) 0px 0px 0px 1px inset;
  --shadow-subtle-2: rgba(6, 182, 212, 0.08) 0px 0px 0px 1px;
  --shadow-subtle-3: rgba(6, 182, 212, 0.02) 0px 5px 2px 0px, rgba(14, 165, 233, 0.03) 0px 3px 2px 0px, rgba(6, 182, 212, 0.04) 0px 1px 1px 0px, rgba(14, 165, 233, 0.05) 0px 0px 1px 0px;
  --shadow-xl: rgba(6, 182, 212, 0.1) 0px 4px 32px 0px;
  --shadow-input: rgba(6, 182, 212, 0.08) 0px 0px 0px 1px;
  --shadow-focus: rgba(6, 182, 212, 0.3) 0px 0px 0px 2px;
  --shadow-halo-color: rgba(0, 0, 0, 0.3);

  /* Light mode heading gradient override */
  --color-heading-gradient-start: var(--color-amber);
  --color-heading-gradient-end: var(--color-azure);
}
```
