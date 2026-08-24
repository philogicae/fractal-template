import { resolve } from "node:path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    alias: {
      "@components": resolve(__dirname, "app/components"),
      "@config": resolve(__dirname, "app/config"),
      "@i18n": resolve(__dirname, "app/i18n"),
      "@layout": resolve(__dirname, "app/layout"),
      "@stores": resolve(__dirname, "app/stores"),
      "@utils": resolve(__dirname, "app/utils"),
      // Next aliases `server-only` internally; point tests at a no-op stub.
      "server-only": resolve(__dirname, "app/test/stubs/server-only.ts"),
    },
  },
  test: {
    include: ["app/**/*.test.ts", "app/**/*.test.tsx"],
    environment: "jsdom",
    passWithNoTests: true,
  },
})
