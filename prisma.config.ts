/* eslint-disable e18e/ban-dependencies */
import { defineConfig, env } from "prisma/config"
import "dotenv/config"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
})
