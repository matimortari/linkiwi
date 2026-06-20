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

  // Map global configuration properties
  const updatePayload: any = {
    order: result.data.order,
    isPinned: result.data.isPinned,
    isVisible: result.data.isVisible,
    scheduledStart: result.data.scheduledStart,
    scheduledEnd: result.data.scheduledEnd,
    scheduleAction: result.data.scheduleAction,
  }
  if (existingItem.type === "LINK" && result.data.link) {
    updatePayload.link = { update: result.data.link }
  }

  else if (existingItem.type === "ICON" && result.data.icon) {
    if (result.data.icon.platform) {
      const duplicateIcon = await db.profileItemIcon.findFirst({ where: { platform: result.data.icon.platform, itemId: { not: itemId }, item: { userId: sessionUser.id } } })
      if (duplicateIcon) {
        throw createError({ status: 409, statusText: `A social icon badge for ${result.data.icon.platform} already exists.` })
      }
    }
    updatePayload.icon = { update: result.data.icon }
  }

  else if (existingItem.type === "WIDGET" && result.data.widget) {
    updatePayload.widget = { update: result.data.widget }
  }

  else if (existingItem.type === "PHOTO_GRID" && result.data.photoGrid?.photos) {
    await db.photoGridItem.deleteMany({ where: { gridId: itemId } })
    updatePayload.photoGrid = { update: { photos: { createMany: { data: result.data.photoGrid.photos } } } }
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

defineRouteMeta({
  openAPI: {
    summary: "Update profile item",
    description: "Updates a profile item's configuration and nested relation data. Photo grid photos are fully replaced on update.",
    tags: ["Items"],
    parameters: [
      { in: "path", name: "id", required: true, schema: { type: "string" }, description: "Item ID" },
    ],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              order: { type: "integer" },
              isPinned: { type: "boolean" },
              isVisible: { type: "boolean" },
              scheduledStart: { type: "string", format: "date-time" },
              scheduledEnd: { type: "string", format: "date-time" },
              scheduleAction: { type: "string", enum: ["HIDE", "DELETE"] },
              link: { type: "object", properties: { url: { type: "string" }, label: { type: "string" } } },
              icon: { type: "object", properties: { url: { type: "string" }, platform: { type: "string" }, logo: { type: "string" } } },
              widget: { type: "object", properties: { type: { type: "string", enum: ["GITHUB", "YOUTUBE", "SPOTIFY"] }, handle: { type: "string" } } },
              photoGrid: {
                type: "object",
                properties: {
                  photos: {
                    type: "array",
                    minItems: 1,
                    maxItems: 12,
                    items: {
                      type: "object",
                      required: ["url", "order"],
                      properties: {
                        assetId: { type: "string", description: "Optional user asset ID" },
                        url: { type: "string", format: "uri" },
                        order: { type: "integer", minimum: 0 },
                        alt: { type: "string", description: "Optional alt text, max 200 characters" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    responses: {
      200: { description: "Updated item with type-specific nested data" },
      400: { description: "Validation error" },
      401: { description: "Unauthenticated" },
      403: { description: "Item belongs to a different user" },
      404: { description: "Item not found" },
      409: { description: "Icon for this platform already exists" },
      429: { description: "Rate limit exceeded" },
    },
  },
})
