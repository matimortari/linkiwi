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
    description: "Creates a new profile item for the current user.",
    tags: ["Items"],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["type"],
            properties: {
              type: { type: "string", enum: ["LINK", "WIDGET", "ICON", "DIVIDER", "PHOTO_GRID"], description: "Type of profile item" },
              order: { type: "integer", description: "Position of the item in the profile" },
              isPinned: { type: "boolean", description: "Whether the item is pinned to the top of the profile (true/false)" },
              isVisible: { type: "boolean", description: "Whether the item is publicly visible (true/false)" },
              scheduledStart: { type: "string", format: "date-time", description: "Date and time to start the schedule" },
              scheduledEnd: { type: "string", format: "date-time", description: "Date and time to end the schedule" },
              scheduleAction: { type: "string", enum: ["HIDE", "DELETE"], description: "Action to take when the schedule is reached" },
              link: { type: "object", properties: { url: { type: "string", description: "URL of the link" }, label: { type: "string", description: "Label of the link" } } },
              icon: { type: "object", properties: { url: { type: "string", description: "URL of the social icon" }, platform: { type: "string", description: "Platform of the icon" }, logo: { type: "string", description: "Logo of the icon" } } },
              widget: { type: "object", properties: { type: { type: "string", enum: ["GITHUB", "YOUTUBE", "SPOTIFY"] }, handle: { type: "string", description: "Handle for widgets" } } },
              photoGrid: {
                type: "object",
                required: ["photos"],
                properties: {
                  photos: {
                    type: "array",
                    description: "Array of photos for the photo grid",
                    minItems: 1,
                    maxItems: 12,
                    items: {
                      type: "object",
                      required: ["url", "order"],
                      properties: {
                        assetId: { type: "string", description: "Optional user asset ID for the photo" },
                        url: { type: "string", format: "uri", description: "URL for the photo" },
                        order: { type: "integer", minimum: 0, description: "Position of the photo in the grid" },
                        alt: { type: "string", description: "Optional alt text for the photo (max 200 characters)" },
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
      200: { description: "Created item with type-specific data" },
      400: { description: "Validation error" },
      401: { description: "Unauthenticated" },
      409: { description: "Icon for this platform already exists" },
      429: { description: "Rate limit exceeded" },
    },
  },
})
