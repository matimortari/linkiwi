export default defineEventHandler(async (event) => {
  const sessionUser = await getUserFromSession(event)
  const commentId = getRouterParam(event, "id")
  if (!commentId) {
    throw createError({ status: 400, statusText: "Comment ID is required" })
  }

  // Rate limit: 30 deletion requests per hour per user
  await enforceRateLimit(event, `comments:delete:${sessionUser.id}`, 30)

  const existingComment = await db.comment.findUnique({ where: { id: commentId }, select: { userId: true } })
  if (!existingComment) {
    throw createError({ status: 404, statusText: "Comment not found" })
  }
  if (existingComment.userId !== sessionUser.id) {
    throw createError({ status: 403, statusText: "You do not have permission to delete this comment." })
  }

  await db.comment.delete({ where: { id: commentId } })

  const user = await db.user.findUnique({ where: { id: sessionUser.id }, select: { slug: true } })

  await deleteCached(CacheKeys.userComments(sessionUser.id), CacheKeys.userProfile(user?.slug || ""))

  return { success: true, message: "Comment deleted successfully." }
})

defineRouteMeta({
  openAPI: {
    summary: "Delete comment",
    description: "Deletes a guestbook comment. Only the profile owner can delete their own comments.",
    tags: ["Analytics"],
    parameters: [
      { in: "path", name: "id", required: true, schema: { type: "string" }, description: "Comment ID" },
    ],
    responses: {
      200: { description: "Comment deleted" },
      401: { description: "Unauthenticated" },
      403: { description: "Comment belongs to a different user" },
      404: { description: "Comment not found" },
      429: { description: "Rate limit exceeded" },
    },
  },
})
