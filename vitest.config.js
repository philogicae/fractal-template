import { resolve } from "node:path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: {
      // Next aliases `server-only` internally; point tests at a no-op stub.
      "server-only": resolve(import.meta.dirname, "app/test/stubs/server-only.ts"),
    },
  },
  test: {
    include: ["app/**/*.test.ts", "app/**/*.test.tsx"],
    // vmThreads creates the jsdom environment once per worker and reuses it
    // across files (vm contexts keep per-file isolation) instead of paying a
    // fresh jsdom per test file. maxWorkers caps the pool at 3 threads.
    pool: "vmThreads",
    maxWorkers: 3,
    environment: "jsdom",
    passWithNoTests: true,
    coverage: {
      provider: "v8",
      all: true,
      include: ["app/**/*.{ts,tsx}"],
      exclude: [
        "app/**/*.test.{ts,tsx}",
        "app/test/**",
        "app/globals.css",
      ],
      reporter: process.env.CI ? ["text", "json-summary"] : ["text"],
      // Every shipped file is expected to stay fully covered. Relax these
      // when adding code that cannot be meaningfully unit-tested.
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
  },
})
