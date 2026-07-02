import { defineConfig, env } from "prisma/config"
import "dotenv/config"

export default defineConfig({
  schema: "server/prisma/schema.prisma",
  migrations: { path: "server/prisma/migrations" },
  datasource: { url: env("DATABASE_URL") },
})
