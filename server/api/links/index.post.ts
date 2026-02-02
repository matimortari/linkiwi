import db from "#server/utils/db"
import { getUserFromSession } from "#server/utils/helpers"
import { CacheKeys, deleteCached } from "#server/utils/redis"
import { createUserLinkSchema } from "#shared/schemas/link-schema"

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)
  const body = await readBody(event)
  const result = createUserLinkSchema.safeParse(body)
  if (!result.success) {
    throw createError({ status: 400, statusText: result.error.issues[0]?.message || "Invalid input" })
  }

  const newLink = await db.userLink.create({
    data: { userId: user.id, url: result.data.url, title: result.data.title },
    select: {
      id: true,
      userId: true,
      url: true,
      title: true,
      clickCount: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  // Invalidate links cache and user profile cache
  const userData = await db.user.findUnique({ where: { id: user.id }, select: { slug: true } })
  await deleteCached(CacheKeys.userLinks(user.id), CacheKeys.userProfile(userData?.slug || ""))

  return { link: newLink }
})
