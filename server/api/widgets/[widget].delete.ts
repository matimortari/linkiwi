export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)

  // Rate limit: 30 requests per hour per user
  await enforceRateLimit(event, `widgets:delete:${user.id}`, 30, 60 * 60 * 1000)

  const widgetId = getRouterParam(event, "widget")
  if (!widgetId) {
    throw createError({ status: 400, statusText: "Widget ID is required" })
  }

  const widgetData = await db.widget.findUnique({ where: { id: widgetId }, select: { id: true, userId: true } })
  if (!widgetData) {
    throw createError({ status: 404, statusText: "Widget not found" })
  }
  if (widgetData.userId !== user.id) {
    throw createError({ status: 403, statusText: "You don't have permission to delete this widget" })
  }

  await db.widget.delete({ where: { id: widgetId } })

  const userData = await db.user.findUnique({ where: { id: user.id }, select: { slug: true } })
  await deleteCached(CacheKeys.userWidgets(user.id), CacheKeys.userProfile(userData?.slug || ""))

  return { success: true, message: "Widget deleted successfully" }
})
