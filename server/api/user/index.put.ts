import db from "#server/utils/db"
import { getUserFromSession } from "#server/utils/helpers"
import { CacheKeys, deleteCached } from "#server/utils/redis"
import { updateUserSchema } from "#shared/schemas/user-schema"

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)
  const body = await readBody(event)
  const result = updateUserSchema.safeParse(body)
  if (!result.success) {
    throw createError({ status: 400, statusText: result.error.issues[0]?.message || "Invalid input" })
  }

  // Get old slug before update to invalidate old cache key
  const oldUser = await db.user.findUnique({ where: { id: user.id }, select: { slug: true } })
  if (result.data.slug && result.data.slug !== oldUser?.slug) {
    const existingUser = await db.user.findUnique({ where: { slug: result.data.slug } })
    if (existingUser) {
      throw createError({ status: 409, statusText: "This username is already taken. Please choose a different one." })
    }
  }

  const updatedUser = await db.user.update({
    where: { id: user.id },
    data: { name: result.data.name, slug: result.data.slug, description: result.data.description },
    select: {
      id: true,
      email: true,
      name: true,
      slug: true,
      description: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  // Invalidate both old and new profile caches, plus user data cache
  await deleteCached(CacheKeys.userData(user.id), CacheKeys.userProfile(oldUser?.slug || ""), CacheKeys.userProfile(updatedUser.slug))

  return { updatedUser }
})
