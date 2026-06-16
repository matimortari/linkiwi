import { updateUserPreferencesSchema } from "#shared/schemas/user-schema"

export default defineEventHandler(async (event) => {
  const sessionUser = await getUserFromSession(event)

  // Rate limit: 30 requests per hour per user
  await enforceRateLimit(event, `user:preferences:${sessionUser.id}`, 30)

  const body = await readBody(event)
  const result = updateUserPreferencesSchema.safeParse(body)
  if (!result.success) {
    throw createError({ status: 400, statusText: result.error.issues[0]?.message || "Invalid input" })
  }

  const updatedPreferences = await db.userPreferences.update({ where: { userId: sessionUser.id }, data: result.data })

  const user = await db.user.findUnique({ where: { id: sessionUser.id }, select: { slug: true } })
  await Promise.all([deleteCached(CacheKeys.userData(sessionUser.id)), deleteCached(CacheKeys.userProfile(user?.slug || ""))])

  return { updatedPreferences }
})
