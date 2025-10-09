import type { EventHandlerRequest, H3Event } from "h3"
import db from "#server/lib/db"

export async function getUserFromSession(event: H3Event<EventHandlerRequest>) {
  const session = await getUserSession(event)
  if (session?.user?.id) {
    return session.user
  }

  const authHeader = event.node.req.headers.authorization
  if (!authHeader) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" })
  }

  return session.user
}

export async function generateSlug(base: string = ""): Promise<string> {
  const cleanedBase = base
    .normalize("NFKD")
    .replace(/[\u0300-\u036F]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-") // One or more whitespace characters to hyphen
    .replace(/[^a-z0-9-]/g, "") // Any character NOT a-z, 0-9, or hyphen
    .replace(/(-)+/g, "-") // One or more hyphens
    .replace(/^(-)+|(-)+$/g, "") // Leading OR trailing hyphens
    || "user"

  let slug: string
  let exists = true
  let attempt = 0

  while (exists && attempt < 5) {
    const randomString = Math.random().toString(36).slice(2, 8)
    slug = `${cleanedBase}-${randomString}`
    const existingUser = await db.user.findUnique({ where: { slug } })
    exists = !!existingUser
    attempt++
  }

  return slug!
}
