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

  return { newItem }
})

defineRouteMeta({
  openAPI: {
    summary: "Create profile item",
    description: "Creates a new profile item. Type determines which nested relation is created (LINK, ICON, WIDGET, PHOTO_GRID, DIVIDER). Icons are unique per platform per user.",
    tags: ["Items"],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["type"],
            properties: {
              type: { type: "string", enum: ["LINK", "WIDGET", "ICON", "DIVIDER", "PHOTO_GRID"] },
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
                required: ["photos"],
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
      200: { description: "Created item with type-specific nested data" },
      400: { description: "Validation error" },
      401: { description: "Unauthenticated" },
      409: { description: "Icon for this platform already exists" },
      429: { description: "Rate limit exceeded" },
    },
  },
})
