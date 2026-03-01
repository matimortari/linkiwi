import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../../.data/prisma/client"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const db = new PrismaClient({ adapter })

db.$connect().catch((err) => {
  console.error("Failed to connect to database:", err)
  process.exit(1)
})

export default db
