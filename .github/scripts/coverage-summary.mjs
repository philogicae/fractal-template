/**
 * Renders the Vitest coverage summary (json-summary reporter) as a markdown
 * table in the GitHub Actions job summary. Runs after `pnpm test:coverage`
 * in CI; exits quietly when no summary was produced.
 */
import { appendFileSync, readFileSync } from "node:fs"

const SUMMARY_PATH = "coverage/coverage-summary.json"
const METRICS = ["statements", "branches", "functions", "lines"]

let summary
try {
  summary = JSON.parse(readFileSync(SUMMARY_PATH, "utf8"))
} catch {
  console.log(`No coverage summary found at ${SUMMARY_PATH} - skipping.`)
  process.exit(0)
}

const percent = (entry, metric) => `${entry[metric].pct}%`
const header = `| File | ${METRICS.map((m) => m[0].toUpperCase() + m.slice(1)).join(" | ")} |`
const divider = `| --- |${METRICS.map(() => " --- |").join("")}`
const rows = Object.entries(summary)
  .filter(([file]) => file !== "total")
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([file, entry]) => {
    const path = file.startsWith(process.cwd())
      ? file.slice(process.cwd().length + 1)
      : file
    return `| \`${path}\` | ${METRICS.map((m) => percent(entry, m)).join(" | ")} |`
  })

const total = summary.total
const headline = METRICS.map(
  (metric) =>
    `${total[metric].pct === 100 ? "✅" : "⚠️"} ${percent(total, metric)} ${metric}`
).join(" · ")

const markdown = [
  "## 🧪 Test coverage",
  "",
  headline,
  "",
  header,
  divider,
  ...rows,
  "",
].join("\n")

if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown)
} else {
  console.log(markdown)
}
