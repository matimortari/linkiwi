import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../../.data/prisma/client"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const db = new PrismaClient({ adapter })

export default db
