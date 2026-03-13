import { updateWidgetSchema } from "#shared/schemas/widget-schema"

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)

  // Rate limit: 50 requests per hour per user
  await enforceRateLimit(event, `widgets:update:${user.id}`, 50, 60 * 60 * 1000)

  const widgetId = getRouterParam(event, "widget")
  if (!widgetId) {
    throw createError({ status: 400, statusText: "Widget ID is required" })
  }

  const body = await readBody(event)
  const result = updateWidgetSchema.safeParse(body)
  if (!result.success) {
    throw createError({ status: 400, statusText: result.error.issues[0]?.message || "Invalid input" })
  }

  const widgetData = await db.widget.findUnique({ where: { id: widgetId }, select: { id: true, userId: true } })
  if (!widgetData) {
    throw createError({ status: 404, statusText: "Widget not found" })
  }
  if (widgetData.userId !== user.id) {
    throw createError({ status: 403, statusText: "You don't have permission to update this widget" })
  }

  const updatedWidget = await db.widget.update({
    where: { id: widgetId },
    data: { handle: result.data.handle, order: result.data.order, isVisible: result.data.isVisible },
    select: {
      id: true,
      userId: true,
      type: true,
      handle: true,
      order: true,
      isVisible: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  const userData = await db.user.findUnique({ where: { id: user.id }, select: { slug: true } })
  await deleteCached(CacheKeys.userWidgets(user.id), CacheKeys.userProfile(userData?.slug || ""))

  return { widget: updatedWidget }
})
