import { updateUserIconSchema } from "#shared/schemas/icon-schema"

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)

  // Rate limit: 30 requests per hour per user
  await enforceRateLimit(event, `icons:update:${user.id}`, 30, 60 * 60 * 1000)

  const iconId = getRouterParam(event, "icon")
  if (!iconId) {
    throw createError({ status: 400, statusText: "Icon ID is required" })
  }
  const body = await readBody(event)
  const result = updateUserIconSchema.safeParse(body)
  if (!result.success) {
    throw createError({ status: 400, statusText: result.error.issues[0]?.message || "Invalid input" })
  }

  const iconData = await db.userIcon.findUnique({ where: { id: iconId }, select: { id: true, userId: true } })
  if (!iconData) {
    throw createError({ status: 404, statusText: "Icon not found" })
  }
  if (iconData.userId !== user.id) {
    throw createError({ status: 403, statusText: "You don't have permission to update this icon" })
  }

  const updatedIcon = await db.userIcon.update({
    where: { id: iconId },
    data: { order: result.data.order, isVisible: result.data.isVisible },
    select: {
      id: true,
      userId: true,
      url: true,
      platform: true,
      logo: true,
      order: true,
      clickCount: true,
      isVisible: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  // Invalidate icons cache and user profile cache
  const userData = await db.user.findUnique({ where: { id: user.id }, select: { slug: true } })
  await deleteCached(CacheKeys.userIcons(user.id), CacheKeys.userProfile(userData?.slug || ""))

  return { icon: updatedIcon }
})
