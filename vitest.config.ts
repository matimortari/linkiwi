import { defineVitestProject } from "@nuxt/test-utils/config"
import { loadEnv } from "vite"
import { defineConfig } from "vitest/config"

const env = loadEnv("development", process.cwd(), "")
for (const [key, value] of Object.entries(env)) {
  process.env[key] ??= value
}

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage",
      include: ["app/utils/**/*.{ts,js}", "shared/schemas/**/*.{ts,js}", "server/utils/**/*.{ts,js}"],
      exclude: ["**/*.d.ts", "**/node_modules/**", "**/tests/**"],
    },
    projects: [
      {
        test: {
          name: "unit",
          include: ["tests/**/*.{test,spec}.ts"],
          exclude: ["tests/app/**"],
          environment: "node",
        },
      },
      await defineVitestProject({
        test: {
          name: "nuxt",
          include: ["tests/app/**/*.{test,spec}.ts"],
          environment: "nuxt",
        },
      }),
    ],
  },
})
