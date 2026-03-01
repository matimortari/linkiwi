import { updateUserPreferencesSchema } from "#shared/schemas/user-schema"

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)

  // Rate limit: 30 requests per hour per user
  await enforceRateLimit(event, `user:preferences:${user.id}`, 30, 60 * 60 * 1000)

  const body = await readBody(event)
  const result = updateUserPreferencesSchema.safeParse(body)
  if (!result.success) {
    throw createError({ status: 400, statusText: result.error.issues[0]?.message || "Invalid input" })
  }

  const updatedPreferences = await db.userPreferences.update({ where: { userId: user.id }, data: result.data })

  // Invalidate user data cache and profile cache
  const userData = await db.user.findUnique({ where: { id: user.id }, select: { slug: true } })
  await deleteCached(CacheKeys.userData(user.id), CacheKeys.userProfile(userData?.slug || ""))

  return { updatedPreferences }
})
