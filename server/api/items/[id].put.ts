import { updateProfileItemSchema } from "#shared/schemas/profile-item-schema"

export default defineEventHandler(async (event) => {
  const sessionUser = await getUserFromSession(event)
  const itemId = getRouterParam(event, "id")
  if (!itemId) {
    throw createError({ status: 400, statusText: "Item ID is required" })
  }

  // Rate limit: 50 item modifications per hour per account
  await enforceRateLimit(event, `items:update:${sessionUser.id}`, 50)

  const body = await readBody(event)
  const result = updateProfileItemSchema.safeParse(body)
  if (!result.success) {
    throw createError({ status: 400, statusText: result.error.issues[0]?.message || "Invalid input" })
  }

  const existingItem = await db.profileItem.findUnique({ where: { id: itemId }, select: { userId: true, type: true } })
  if (!existingItem) {
    throw createError({ status: 404, statusText: "Profile item not found" })
  }
  if (existingItem.userId !== sessionUser.id) {
    throw createError({ status: 403, statusText: "You do not have permission to modify this resource" })
  }

  const { order, isPinned, isVisible, scheduledStart, scheduledEnd, scheduleAction, link, icon, widget, photoGrid } = result.data

  // Map global configuration properties
  const updatePayload: any = {
    order,
    isPinned,
    isVisible,
    scheduledStart,
    scheduledEnd,
    scheduleAction,
  }
  if (existingItem.type === "LINK" && link) {
    updatePayload.link = { update: link }
  }

  else if (existingItem.type === "ICON" && icon) {
    if (icon.platform) {
      const duplicateIcon = await db.profileItemIcon.findFirst({ where: { platform: icon.platform, itemId: { not: itemId }, item: { userId: sessionUser.id } } })
      if (duplicateIcon) {
        throw createError({ status: 409, statusText: `A social icon badge for ${icon.platform} already exists.` })
      }
    }
    updatePayload.icon = { update: icon }
  }

  else if (existingItem.type === "WIDGET" && widget) {
    updatePayload.widget = { update: widget }
  }

  else if (existingItem.type === "PHOTO_GRID" && photoGrid?.photos) {
    await db.photoGridItem.deleteMany({ where: { gridId: itemId } })
    updatePayload.photoGrid = { update: { photos: { createMany: { data: photoGrid.photos } } } }
  }

  // Fire the single transaction update statement down to PostgreSQL
  const updatedItem = await db.profileItem.update({
    where: { id: itemId },
    data: updatePayload,
    include: { link: true, icon: true, widget: true, photoGrid: { include: { photos: { orderBy: { order: "asc" } } } } },
  })

  const user = await db.user.findUnique({ where: { id: sessionUser.id }, select: { slug: true } })
  await deleteCached(CacheKeys.userItems(sessionUser.id), CacheKeys.userProfile(user?.slug || ""))

  return { updatedItem }
})
