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
    environment: "jsdom",
    passWithNoTests: true,
  },
})
