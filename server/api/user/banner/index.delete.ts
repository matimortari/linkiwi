export default defineEventHandler(async (event) => {
  const sessionUser = await getUserFromSession(event)

  // Rate limit: 10 requests per hour per user
  await enforceRateLimit(event, `user:banner:delete:${sessionUser.id}`, 10)

  const existingBanner = await db.userBanner.findUnique({ where: { userId: sessionUser.id } })
  if (!existingBanner) {
    throw createError({ status: 404, statusText: "No active profile banner found to delete" })
  }

  await db.userBanner.delete({ where: { userId: sessionUser.id } })

  const user = await db.user.findUnique({ where: { id: sessionUser.id }, select: { slug: true } })
  await Promise.all([deleteCached(CacheKeys.userProfile(user?.slug || "")), deleteCached(CacheKeys.userData(sessionUser.id))])

  return { message: "Profile banner deleted successfully" }
})
