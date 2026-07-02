export default defineEventHandler(async (event) => {
  const sessionUser = await getUserFromSession(event)
  const commentId = getRouterParam(event, "id")
  if (!commentId) {
    throw createError({ statusCode: 400, statusMessage: "Comment ID is required" })
  }

  // Rate limit: 30 deletion requests per hour per user
  await enforceRateLimit(event, `comments:delete:${sessionUser.id}`, 30)

  const existingComment = await db.comment.findUnique({ where: { id: commentId }, select: { userId: true } })
  if (!existingComment) {
    throw createError({ statusCode: 404, statusMessage: "Comment not found" })
  }
  if (existingComment.userId !== sessionUser.id) {
    throw createError({ statusCode: 403, statusMessage: "You do not have permission to delete this comment." })
  }

  await db.comment.delete({ where: { id: commentId } })

  const user = await db.user.findUnique({ where: { id: sessionUser.id }, select: { slug: true } })

  await deleteCached(CacheKeys.userComments(sessionUser.id), CacheKeys.userProfile(user?.slug || ""))

  return { success: true, message: "Comment deleted successfully." }
})

defineRouteMeta({
  openAPI: {
    summary: "Delete guestbook comment",
    description: "Deletes a guestbook comment for the current user.",
    tags: ["Analytics"],
    parameters: [
      { in: "path", name: "id", required: true, schema: { type: "string" }, description: "Comment ID" },
    ],
    responses: {
      200: { description: "Guestbook comment deleted" },
      401: { description: "Unauthenticated" },
      403: { description: "Comment belongs to a different user" },
      404: { description: "Comment not found" },
      429: { description: "Rate limit exceeded" },
    },
  },
})
