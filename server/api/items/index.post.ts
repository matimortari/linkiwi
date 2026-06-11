import { createProfileItemSchema } from "#shared/schemas/profile-item-schema"

export default defineEventHandler(async (event) => {
  const sessionUser = await getUserFromSession(event)

  // Rate limit: 50 item modifications per hour per account
  await enforceRateLimit(event, `items:create:${sessionUser.id}`, 50)

  const body = await readBody(event)
  const result = createProfileItemSchema.safeParse(body)
  if (!result.success) {
    throw createError({ status: 400, statusText: result.error.issues[0]?.message || "Invalid input" })
  }

  // Calculate the dynamic sequencing slot across all components globally
  const maxOrderItem = await db.profileItem.findFirst({ where: { userId: sessionUser.id }, orderBy: { order: "desc" }, select: { order: true } })
  const nextOrder = (maxOrderItem?.order ?? -1) + 1

  // Build out conditional block inputs for nested relations
  const nestedRelationData: any = {}
  if (result.data.type === "LINK") {
    nestedRelationData.link = { create: result.data.link }
  }
  else if (result.data.type === "ICON") {
    const existingIcon = await db.profileItemIcon.findFirst({ where: { item: { userId: sessionUser.id }, platform: result.data.icon.platform } })
    if (existingIcon) {
      throw createError({ status: 409, statusText: `An icon badge for ${result.data.icon.platform} already exists.` })
    }
    nestedRelationData.icon = { create: result.data.icon }
  }
  else if (result.data.type === "WIDGET") {
    nestedRelationData.widget = { create: result.data.widget }
  }
  else if (result.data.type === "PHOTO_GRID") {
    nestedRelationData.photoGrid = { create: { photos: { createMany: { data: result.data.photoGrid.photos } } } }
  }

  // Atomically write the unified item and its nested relation in a single transaction to ensure data integrity
  const newItem = await db.profileItem.create({
    data: {
      userId: sessionUser.id,
      type: result.data.type,
      order: result.data.order ?? nextOrder,
      isPinned: result.data.isPinned,
      isVisible: result.data.isVisible,
      scheduledStart: result.data.scheduledStart,
      scheduledEnd: result.data.scheduledEnd,
      scheduleAction: result.data.scheduleAction,
      ...nestedRelationData,
    },
    include: { link: true, icon: true, widget: true, photoGrid: { include: { photos: true } } },
  })

  const user = await db.user.findUnique({ where: { id: sessionUser.id }, select: { slug: true } })
  await deleteCached(CacheKeys.userItems(sessionUser.id), CacheKeys.userProfile(user?.slug || ""))

  return { item: newItem }
})
