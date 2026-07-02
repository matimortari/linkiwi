export default defineEventHandler(async (event) => {
  const sessionUser = await getUserFromSession(event)
  const itemId = getRouterParam(event, "id")
  if (!itemId) {
    throw createError({ statusCode: 400, statusMessage: "Item ID is required" })
  }

  // Rate limit: 50 deletions per hour per account
  await enforceRateLimit(event, `items:delete:${sessionUser.id}`, 50)

  const existingItem = await db.profileItem.findUnique({ where: { id: itemId }, select: { userId: true, type: true } })
  if (!existingItem) {
    throw createError({ statusCode: 404, statusMessage: "Profile item not found" })
  }
  if (existingItem.userId !== sessionUser.id) {
    throw createError({ statusCode: 403, statusMessage: "You do not have permission to delete this resource" })
  }

  // Delete the item (cascade will handle related records)
  await db.profileItem.delete({ where: { id: itemId } })

  const user = await db.user.findUnique({ where: { id: sessionUser.id }, select: { slug: true } })

  await deleteCached(CacheKeys.userItems(sessionUser.id), CacheKeys.userProfile(user?.slug || ""))

  return { success: true, message: `${existingItem.type} component deleted successfully.` }
})

defineRouteMeta({
  openAPI: {
    summary: "Delete profile item",
    description: "Deletes a profile item for the current user.",
    tags: ["Items"],
    parameters: [
      { in: "path", name: "id", required: true, schema: { type: "string" }, description: "Item ID" },
    ],
    responses: {
      200: { description: "Item deleted" },
      401: { description: "Unauthenticated" },
      403: { description: "Item belongs to a different user" },
      404: { description: "Item not found" },
      429: { description: "Rate limit exceeded" },
    },
  },
})
