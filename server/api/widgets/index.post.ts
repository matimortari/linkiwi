import { createWidgetSchema } from "#shared/schemas/widget-schema"

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)

  // Rate limit: 30 requests per hour per user
  await enforceRateLimit(event, `widgets:create:${user.id}`, 30)

  const body = await readBody(event)
  const result = createWidgetSchema.safeParse(body)
  if (!result.success) {
    throw createError({ status: 400, statusText: result.error.issues[0]?.message || "Invalid input" })
  }

  // Only one widget per type per user
  const existingWidget = await db.widget.findFirst({ where: { userId: user.id, type: result.data.type } })
  if (existingWidget) {
    throw createError({ status: 409, statusText: `A ${result.data.type} widget already exists` })
  }

  const maxOrderWidget = await db.widget.findFirst({
    where: { userId: user.id },
    orderBy: { order: "desc" },
    select: { order: true },
  })
  const nextOrder = (maxOrderWidget?.order ?? -1) + 1

  const newWidget = await db.widget.create({
    data: { userId: user.id, type: result.data.type, handle: result.data.handle, order: nextOrder },
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

  return { widget: newWidget }
})
