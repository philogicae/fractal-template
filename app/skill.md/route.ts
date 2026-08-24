import { readFile } from "node:fs/promises"
import { join } from "node:path"
import * as csso from "csso"
import { marked } from "marked"
import { unstable_cache } from "next/cache"
import { minify as minifyJs } from "terser"
import { version as appVersion } from "../../package.json"

// ============================================================================
// Constants
// ============================================================================

const CACHE_TAG = "skill-md"
const CACHE_REVALIDATE_SECONDS = 3600 // 1 hour

/** Regex to match version in YAML frontmatter */
const VERSION_REGEX = /^(\s*version:\s*")[^"]*("\s*)$/m

/** Regex to extract frontmatter block (content between --- delimiters) */
const FRONTMATTER_REGEX = /^---\n([\s\S]*?)\n---\n/

/** Browser User-Agent substrings (lowercase for case-insensitive matching) */
const BROWSER_USER_AGENTS = [
  "chrome",
  "safari",
  "firefox",
  "edge",
  "opera",
  "edg", // Edge without 'e'
]

/** Non-browser tool User-Agent indicators (lowercase) */
const NON_BROWSER_USER_AGENTS = [
  "curl",
  "wget",
  "httpie",
  "python-requests",
  "node",
  "axios",
  "postman",
  "insomnia",
  "go-http-client",
  "ruby",
  "java",
  "okhttp",
]

const STYLES = `
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  background-color: #f0f9ff;
}
html.dark {
  background-color: #08090a;
}

:root {
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
  --color-accent-primary: var(--color-neon-lime);
  --color-accent-secondary: var(--color-cyan-glow);
  --color-accent-hover: #bef264;
  --color-code-bg: var(--color-void);
  --color-inline-code-bg: rgba(163, 230, 53, 0.1);
}

html:not(.dark) {
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
  --color-accent-primary: var(--color-turquoise);
  --color-accent-secondary: var(--color-azure);
  --color-accent-hover: #0891b2;
  --color-code-bg: #f1f5f9;
  --color-inline-code-bg: rgba(6, 182, 212, 0.1);
}

body {
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  line-height: 1.6;
  font-size: 13px;
  min-height: 100dvh;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.25rem;
}

.header {
  border-bottom: 1px solid var(--color-border-default);
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.header h1 {
  font-size: 1.375rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-accent-primary) 0%, var(--color-accent-secondary) 50%, var(--color-hot-pink) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
  text-align: left;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.5rem;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-default);
  border-radius: 4px;
  font-size: 0.6875rem;
  color: var(--color-text-muted);
  text-decoration: none;
  transition: all 0.2s;
}

.badge:hover {
  border-color: var(--color-accent-primary);
  color: var(--color-accent-primary);
  background: var(--color-bg-surface);
}

.badge svg {
  width: 10px;
  height: 10px;
}

.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 4px;
  border: 1px solid var(--color-border-default);
  background: var(--color-bg-elevated);
  color: var(--color-accent-primary);
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
}

.theme-toggle:hover {
  background: var(--color-bg-surface);
  border-color: var(--color-accent-primary);
  box-shadow: 0 0 8px var(--color-accent-primary);
}

.theme-toggle svg {
  width: 14px;
  height: 14px;
}

.theme-toggle .theme-icon {
  display: block;
}

.theme-toggle .theme-icon.hidden {
  display: none;
}

.home-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 4px;
  border: 1px solid var(--color-border-default);
  background: var(--color-bg-elevated);
  color: var(--color-accent-primary);
  text-decoration: none;
  transition: all 0.2s;
}

.home-link:hover {
  background: var(--color-bg-surface);
  border-color: var(--color-accent-primary);
  box-shadow: 0 0 8px var(--color-accent-primary);
}

.home-link svg {
  width: 14px;
  height: 14px;
}

/* Mobile content text - smaller than desktop */
  .content {
  font-size: 0.75rem;
}

.content h1 {
  font-size: 1rem;
  font-weight: 700;
  margin: 1.5rem 0 0.5rem;
  color: var(--color-text-primary);
  line-height: 1.3;
}

.content h2 {
  font-size: 0.875rem;
  font-weight: 700;
  margin: 1.25rem 0 0.5rem;
  color: var(--color-accent-secondary);
  padding-bottom: 0.25rem;
  border-bottom: 1px solid var(--color-border-default);
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.content h2:first-of-type {
  margin-top: 0;
}

.content h3 {
  font-size: 0.6875rem;
  font-weight: 700;
  margin: 1rem 0 0.375rem;
  color: var(--color-accent-primary);
}

.content h4 {
  font-size: 0.75rem;
  font-weight: 600;
  margin: 0.875rem 0 0.375rem;
  color: var(--color-text-primary);
}

.content p {
  margin: 0.5rem 0;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.content a {
  color: var(--color-accent-secondary);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all 0.2s ease;
}

.content a:hover {
  color: var(--color-accent-primary);
  border-bottom-color: var(--color-accent-primary);
}

.content .anchor-link {
  opacity: 0;
  margin-right: 0.375rem;
  text-decoration: none;
  color: var(--color-text-muted);
  font-weight: 400;
  transition: opacity 0.2s;
}

.content h1:hover .anchor-link,
.content h2:hover .anchor-link,
.content h3:hover .anchor-link,
.content h4:hover .anchor-link {
  opacity: 0.6;
}

.content .anchor-link:hover {
  color: var(--color-accent-primary);
  opacity: 1;
}

.content ul, .content ol {
  margin: 0.5rem 0;
  padding-left: 1rem;
  color: var(--color-text-secondary);
}

.content li {
  margin: 0.25rem 0;
}

.content ul ul, .content ol ol, .content ul ol, .content ol ul {
  margin: 0.5rem 0;
}

.content blockquote {
  border-left: 3px solid var(--color-accent-primary);
  margin: 0.75rem 0;
  padding: 0.5rem 0.75rem;
  background: linear-gradient(90deg, var(--color-bg-elevated) 0%, transparent 100%);
  border-radius: 0 4px 4px 0;
  color: var(--color-text-secondary);
}

.content blockquote p:first-child {
  margin-top: 0;
}

.content blockquote p:last-child {
  margin-bottom: 0;
}

.content code {
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 0.9em;
  background: var(--color-bg-elevated);
  color: var(--color-accent-primary);
  padding: 0.125rem 0.375rem;
  border-radius: 3px;
  border: 1px solid var(--color-border-subtle);
}

.content pre {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-default);
  border-radius: 6px;
  padding: 0.75rem;
  margin: 0.75rem 0;
  overflow-x: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: relative;
}

.content pre code {
  background: transparent;
  color: var(--color-text-primary);
  padding: 0;
  font-size: inherit;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
}

.content pre code .comment {
  color: var(--color-emerald);
  font-style: italic;
  opacity: 0.8;
}

.content table {
  width: 100%;
  border-collapse: collapse;
  margin: 0.75rem 0;
  font-size: inherit;
  border: 1px solid var(--color-border-default);
  border-radius: 6px;
  overflow: hidden;
}

.content th, .content td {
  padding: 0.5rem 0.625rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border-default);
}

.content th {
  font-weight: 700;
  color: var(--color-accent-secondary);
  background: var(--color-bg-elevated);
  text-transform: uppercase;
  font-size: 0.6875rem;
  letter-spacing: 0.03em;
}

.content tr:hover {
  background: var(--color-bg-elevated);
}

.content tr:last-child td {
  border-bottom: none;
}

.content hr {
  border: none;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-border-default), transparent);
  margin: 1.5rem 0;
}

.frontmatter-card {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-default);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), 0 0 0 1px var(--color-border-subtle);
}

.frontmatter-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-accent-primary), var(--color-accent-secondary));
}

.frontmatter-title {
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-accent-primary);
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.frontmatter-title::before {
  content: '>';
  font-size: 0.75rem;
  font-weight: 800;
}

.frontmatter-content {
  margin: 0;
  padding: 0;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-subtle);
  border-radius: 6px;
  overflow-x: hidden;
}

.frontmatter-content code {
  display: block;
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 0.75rem;
  line-height: 1.6;
  padding: 0.875rem;
  color: var(--color-text-secondary);
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
  tab-size: 2;
  background: transparent;
}

.frontmatter-content .yaml-key {
  color: var(--color-accent-secondary);
  font-weight: 600;
}

.frontmatter-content .yaml-string {
  color: var(--color-accent-primary);
}

.frontmatter-content .yaml-number {
  color: var(--color-electric-violet);
}

.frontmatter-content .yaml-list {
  color: var(--color-text-muted);
}

.frontmatter-content .yaml-comment {
  color: var(--color-emerald);
  font-style: italic;
  opacity: 0.8;
}

.frontmatter-content .yaml-punctuation {
  color: var(--color-text-muted);
}

.content input[type="checkbox"] {
  margin-right: 0.5rem;
  accent-color: var(--color-accent-primary);
}

@media print {
  body {
    background: white;
    color: black;
  }
  
  .header {
    border-bottom-color: #ddd;
  }
  
  .content h2 {
    border-bottom-color: #ddd;
  }
  
  .badge, .theme-toggle, .home-link {
    display: none;
  }
  
  .frontmatter-card {
    border-color: #ddd;
    background: #f5f5f5;
  }
}

@media (max-width: 640px) {
  body {
    font-size: 12px;
  }

  .container {
    padding: 1.5rem 1rem;
  }

  /* Mobile content text - smaller than desktop */
  .content {
    font-size: 0.6875rem;
  }

  .content h1 {
    font-size: 0.9375rem;
  }

  .content h2 {
    font-size: 0.875rem;
  }

  .content h3 {
    font-size: 0.6875rem;
  }

  .content h4 {
    font-size: 0.75rem;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .header h1 {
    font-size: 1.125rem;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-start;
  }
}`

// ============================================================================
// Utilities
// ============================================================================

/**
 * Escapes HTML special characters to prevent XSS.
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
}

/**
 * Generates a URL-friendly slug from heading text.
 */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

/**
 * Minifies CSS using csso with structural optimization.
 */
function minifyCss(content: string): string {
  return csso.minify(content).css
}

/**
 * Minifies and obfuscates JavaScript using terser.
 * Mangles variable names and removes dead code for smaller payload.
 */
async function minifyAndObfuscateJs(content: string): Promise<string> {
  const result = await minifyJs(content, {
    mangle: {
      toplevel: true,
      properties: false,
    },
    compress: {
      dead_code: true,
      drop_console: false,
      drop_debugger: true,
      unused: true,
    },
    format: {
      comments: false,
    },
  })
  return result.code ?? content
}

/**
 * Applies syntax highlighting to YAML frontmatter.
 * IMPORTANT: This function expects ALREADY ESCAPED content to avoid XSS.
 * It uses placeholder markers that are replaced after HTML escaping.
 */
function highlightYaml(yaml: string): string {
  // Use placeholder markers that won't be affected by HTML escaping
  const KEY_MARKER = "\x00KEY\x00"
  const PUNC_MARKER = "\x00PUNC\x00"
  const STR_MARKER = "\x00STR\x00"
  const NUM_MARKER = "\x00NUM\x00"
  const LIST_MARKER = "\x00LIST\x00"
  const COMMENT_MARKER = "\x00COMMENT\x00"
  const END_MARKER = "\x00END\x00"

  let highlighted = yaml

  // First, protect existing HTML entities by temporarily replacing them
  highlighted = highlighted
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

  // Apply highlighting using placeholder markers
  // Keys (including indented/nested keys in metadata)
  highlighted = highlighted.replace(
    /^((?:\s{2})*)([a-zA-Z0-9_-]+)(:)/gm,
    `$1${KEY_MARKER}$2${END_MARKER}${PUNC_MARKER}$3${END_MARKER}`
  )

  // String values (unquoted or quoted)
  highlighted = highlighted.replace(
    /(:\s+)((?:&quot;.*?&quot;)|(?:&#x27;.*?&#x27;)|[^\s#&][^#]*?)(\s*$|\s+#)/gm,
    `$1${STR_MARKER}$2${END_MARKER}$3`
  )

  // Numbers
  highlighted = highlighted.replace(
    /(:\s+)(\d+(?:\.\d+)?)(\s*$|\s+#)/gm,
    `$1${NUM_MARKER}$2${END_MARKER}$3`
  )

  // List markers
  highlighted = highlighted.replace(
    /^(\s*)-(\s)/gm,
    `$1${LIST_MARKER}-${END_MARKER}$2`
  )

  // Comments
  highlighted = highlighted.replace(
    /^((?:\s|[^\S\r\n])*)(#[^#].*)$/gm,
    `$1${COMMENT_MARKER}$2${END_MARKER}`
  )

  // URL links
  highlighted = highlighted.replace(
    /(https?:\/\/[^\s]+)/g,
    `${STR_MARKER}$1${END_MARKER}`
  )

  // Now replace placeholders with actual HTML spans
  highlighted = highlighted
    .replace(new RegExp(KEY_MARKER, "g"), '<span class="yaml-key">')
    .replace(new RegExp(PUNC_MARKER, "g"), '<span class="yaml-punctuation">')
    .replace(new RegExp(STR_MARKER, "g"), '<span class="yaml-string">')
    .replace(new RegExp(NUM_MARKER, "g"), '<span class="yaml-number">')
    .replace(new RegExp(LIST_MARKER, "g"), '<span class="yaml-list">')
    .replace(new RegExp(COMMENT_MARKER, "g"), '<span class="yaml-comment">')
    .replace(new RegExp(END_MARKER, "g"), "</span>")

  return highlighted
}

/**
 * Cached file reader for SKILL.md.
 */
const getSkillContent = unstable_cache(
  async (): Promise<string> =>
    readFile(join(process.cwd(), "SKILL.md"), "utf-8"),
  ["skill-md-content"],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: [CACHE_TAG] }
)

/**
 * Cached full-page renderer. Parsing the markdown, minifying the CSS with
 * csso and mangling the inline JS with terser on every request is wasted
 * work — the output depends only on the file content, so cache it for the
 * same TTL and under the same tag as the source read.
 */
const getRenderedHtml = unstable_cache(
  async (content: string): Promise<string> => {
    const { frontmatter, body, rawFrontmatter } = parseFrontmatter(content)
    const title = frontmatter.name || "Skill Documentation"
    return generateHtmlPage(title, body, frontmatter, rawFrontmatter)
  },
  ["skill-md-html"],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: [CACHE_TAG] }
)

// ============================================================================
// Content Parsing
// ============================================================================

interface ParsedFrontmatter {
  frontmatter: Record<string, string>
  body: string
  rawFrontmatter: string
}

/**
 * Parses YAML frontmatter from markdown content.
 */
function parseFrontmatter(content: string): ParsedFrontmatter {
  const match = content.match(FRONTMATTER_REGEX)

  if (!match) {
    return { frontmatter: {}, body: content, rawFrontmatter: "" }
  }

  const rawFrontmatter = match[1] ?? ""
  const body = content.slice(match[0].length)
  const frontmatter: Record<string, string> = {}

  // Parse only top-level key: value pairs
  for (const line of rawFrontmatter.split("\n")) {
    if (!line.trim() || line.trim().startsWith("#") || line.startsWith(" ")) {
      continue
    }
    const colonIndex = line.indexOf(":")
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim()
      const value = line
        .slice(colonIndex + 1)
        .trim()
        .replace(/^["']|["']$/g, "")
      if (key) {
        frontmatter[key] = value
      }
    }
  }

  return { frontmatter, body, rawFrontmatter }
}

/**
 * Syncs the version in frontmatter with package.json version.
 */
function syncVersion(content: string): string {
  return content.replace(VERSION_REGEX, `$1${appVersion}$2`)
}

// ============================================================================
// HTML Generation
// ============================================================================

/**
 * Renders frontmatter as a styled HTML card with syntax highlighting.
 */
function renderFrontmatterCard(
  frontmatter: Record<string, string>,
  rawFrontmatter: string
): string {
  if (!Object.keys(frontmatter).length) {
    return ""
  }

  const highlightedYaml = highlightYaml(rawFrontmatter)

  return `
    <div class="frontmatter-card">
      <div class="frontmatter-title">Frontmatter</div>
      <pre class="frontmatter-content"><code>${highlightedYaml}</code></pre>
    </div>`
}

/**
 * Post-processes HTML to add anchor links to headings.
 */
function addHeadingAnchors(html: string): string {
  const headingRegex = /<h([1-6])>([^<]*)<\/h[1-6]>/g

  return html.replace(headingRegex, (_match, level, text) => {
    const slug = generateSlug(text)
    return `<h${level} id="${slug}"><a href="#${slug}" class="anchor-link" aria-hidden="true">#</a> ${text}</h${level}>`
  })
}

/**
 * Highlights comments in code blocks.
 * Matches shell-style comments (# comment) in code.
 */
function highlightCodeComments(html: string): string {
  // Match content inside <code> blocks within <pre>
  const codeBlockRegex = /<pre><code([^>]*)>([\s\S]*?)<\/code><\/pre>/g

  return html.replace(codeBlockRegex, (_match, langAttr, code) => {
    // Highlight shell-style comments:
    // 1. Full-line comments: ^\s*#comment
    // 2. Inline comments after code: \s+#comment
    const highlightedCode = code
      .replace(/^(\s*)(#[^#].*)$/gm, '$1<span class="comment">$2</span>')
      .replace(/([\s;])(#[^#].*)$/gm, '$1<span class="comment">$2</span>')

    return `<pre><code${langAttr}>${highlightedCode}</code></pre>`
  })
}

/**
 * Generates a complete HTML page with rendered markdown.
 */
async function generateHtmlPage(
  title: string,
  bodyContent: string,
  frontmatter: Record<string, string>,
  rawFrontmatter: string
): Promise<string> {
  const rawHtml = await marked(bodyContent, { gfm: true })
  const htmlWithAnchors = addHeadingAnchors(rawHtml)
  const htmlContent = highlightCodeComments(htmlWithAnchors)
  const frontmatterHtml = renderFrontmatterCard(frontmatter, rawFrontmatter)

  // Theme toggle script - will be minified before insertion
  const themeScript = `
(function() {
  const toggle = document.getElementById('theme-toggle');
  const moonIcon = document.getElementById('moon-icon');
  const sunIcon = document.getElementById('sun-icon');
  const html = document.documentElement;
  function updateIcons(isDark) {
    if (isDark) {
      moonIcon.classList.add('hidden');
      sunIcon.classList.remove('hidden');
    } else {
      moonIcon.classList.remove('hidden');
      sunIcon.classList.add('hidden');
    }
  }
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  if (currentTheme === 'dark') {
    html.classList.add('dark');
    updateIcons(true);
    toggle.setAttribute('aria-label', 'Switch to light mode');
  } else {
    html.classList.remove('dark');
    updateIcons(false);
    toggle.setAttribute('aria-label', 'Switch to dark mode');
  }
  toggle.addEventListener('click', function() {
    const isDark = html.classList.contains('dark');
    if (isDark) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      updateIcons(false);
      toggle.setAttribute('aria-label', 'Switch to dark mode');
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      updateIcons(true);
      toggle.setAttribute('aria-label', 'Switch to light mode');
    }
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (!localStorage.getItem('theme')) {
      if (e.matches) {
        html.classList.add('dark');
        updateIcons(true);
      } else {
        html.classList.remove('dark');
        updateIcons(false);
      }
    }
  });
})();`

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>${minifyCss(STYLES)}</style>
</head>
<body>
  <div class="container">
    <header class="header">
      <h1>${escapeHtml(title)}</h1>
      <div class="header-actions">
        <a href="/" class="home-link" title="Back to homepage" aria-label="Back to homepage">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </a>
        <button type="button" class="theme-toggle" id="theme-toggle" aria-label="Toggle theme">
          <svg id="moon-icon" class="theme-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
          <svg id="sun-icon" class="theme-icon hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        </button>
        <a href="?raw=1" class="badge" title="View raw markdown">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          Raw Markdown
        </a>
      </div>
    </header>
    ${frontmatterHtml}
    <article class="content">
      ${htmlContent}
    </article>
  </div>
  
  <script>${await minifyAndObfuscateJs(themeScript)}</script>
</body>
</html>`
}

// ============================================================================
// Request Handling
// ============================================================================

/**
 * Content negotiation: determines if request should receive HTML.
 *
 * Priority (returns markdown unless explicitly browser):
 * 1. ?raw=1 → markdown
 * 2. Tool User-Agent (curl, wget, etc.) → markdown
 * 3. Accept: text/markdown|plain|json → markdown
 * 4. Accept: text/html (explicit) → HTML
 * 5. Browser User-Agent → HTML
 * 6. Default → markdown (safe for unknown agents)
 */
function wantsHtml(request: Request): boolean {
  const url = new URL(request.url)
  if (url.searchParams.get("raw") === "1") return false

  const accept = request.headers.get("accept") || ""
  const userAgent = (request.headers.get("user-agent") || "").toLowerCase()

  // Tools/CLI agents get markdown immediately
  if (NON_BROWSER_USER_AGENTS.some((ua) => userAgent.includes(ua))) return false

  // Parse Accept header (strip quality values)
  const types = accept.split(",").map((t) => t.split(";")[0]?.trim() ?? "")

  // Explicit content type requests
  if (
    types.includes("text/markdown") ||
    types.includes("text/plain") ||
    types.includes("application/json")
  ) {
    return false
  }
  if (types.includes("text/html")) return true

  // User-Agent as final signal (browser = HTML, unknown = markdown for safety)
  return BROWSER_USER_AGENTS.some((ua) => userAgent.includes(ua))
}

// ============================================================================
// Route Handler
// ============================================================================

/**
 * Serves SKILL.md at `/skill.md` with smart content negotiation:
 *
 * **HTML Response (styled page):**
 * - Browser User-Agents: Chrome, Safari, Firefox, Edge, Opera
 * - Accept: text/html (explicit)
 *
 * **Raw Markdown Response:**
 * - Tool User-Agents: curl, wget, httpie, python-requests, node, axios, postman, etc.
 * - Accept: text/markdown, text/plain, application/json
 * - Query param: `?raw=1`
 * - Default for unknown agents (safer for agents)
 *
 * **Examples:**
 * - Browser visit → HTML page
 * - `curl /skill.md` → raw markdown
 * - `curl /skill.md?raw=1` → raw markdown (explicit)
 */
export async function GET(request: Request): Promise<Response> {
  const shouldReturnHtml = wantsHtml(request)

  try {
    const content = await getSkillContent()
    const updatedContent = syncVersion(content)

    // Serve raw markdown for agents and curl
    if (!shouldReturnHtml) {
      return new Response(updatedContent, {
        status: 200,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "Cache-Control": "public, max-age=3600",
        },
      })
    }

    // Parse + render once per content revision; marked/csso/terser are
    // too expensive to rerun on every browser request.
    const html = await getRenderedHtml(updatedContent)

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to read SKILL.md"

    // Return error in appropriate format based on what user requested
    if (shouldReturnHtml) {
      const errorHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Error</title></head>
<body style="font-family: system-ui; max-width: 600px; margin: 50px auto; padding: 20px; color: #f43f5e;">
  <h1>Error</h1>
  <p>${escapeHtml(errorMessage)}</p>
  <p><a href="?raw=1" style="color: #c7ff1a;">View raw markdown</a></p>
</body>
</html>`
      return new Response(errorHtml, {
        status: 500,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      })
    }

    return new Response(`Error: ${errorMessage}`, {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  }
}
