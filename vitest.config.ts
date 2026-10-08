import { fileURLToPath } from "node:url"
import { defineVitestProject } from "@nuxt/test-utils/config"
import Unimport from "unimport/unplugin"
import { loadEnv } from "vite"
import { defineConfig } from "vitest/config"

const env = loadEnv("development", process.cwd(), "")
for (const [key, value] of Object.entries(env)) {
  process.env[key] ??= value
}

const nitroMocks = fileURLToPath(new URL("./tests/server/nitro-mocks.ts", import.meta.url))

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage",
      include: ["app/utils/**/*.{ts,js}", "shared/schemas/**/*.{ts,js}", "server/utils/**/*.{ts,js}"],
      exclude: ["**/*.d.ts", "**/node_modules/**", "**/tests/**", "app/utils/constants.ts", "app/utils/preferences.ts", "app/utils/themes.ts", "app/utils/carousel-presets.ts"],
    },
    projects: [
      {
        plugins: [
          Unimport.vite({
            dts: false,
            imports: [
              { name: "db", from: nitroMocks },
              { name: "createError", from: nitroMocks },
              { name: "getUserSession", from: nitroMocks },
            ],
          }),
        ],
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
