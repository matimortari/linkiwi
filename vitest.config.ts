import { defineVitestProject } from "@nuxt/test-utils/config"
import { loadEnv } from "vite"
import { defineConfig } from "vitest/config"

const env = loadEnv("development", process.cwd(), "")
for (const [key, value] of Object.entries(env)) {
  process.env[key] ??= value
}

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "unit",
          include: ["tests/**/*.{test,spec}.ts"],
          exclude: ["tests/nuxt/**"],
          environment: "node",
        },
      },
      await defineVitestProject({
        test: {
          name: "nuxt",
          include: ["tests/nuxt/**/*.{test,spec}.ts"],
          environment: "nuxt",
        },
      }),

    ],
  },
})
