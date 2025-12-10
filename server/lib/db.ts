// Prisma Client instantiation (https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/postgresql#7-instantiate-prisma-client)

import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../../prisma/.generated/client"
import "dotenv/config"

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const db = new PrismaClient({ adapter })

export default db
