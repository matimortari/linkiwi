import { createCommentSchema } from "#shared/schemas/analytics-schema"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const result = createCommentSchema.safeParse(body)
  if (!result.success) {
    throw createError({ status: 400, statusText: result.error.issues[0]?.message || "Invalid input" })
  }

  // Rate limit: 10 requests per hour per IP
  const clientIp = getRequestIP(event, { xForwardedFor: true }) || "anonymous"
  await enforceRateLimit(event, `comments:public-create:${clientIp}`, 10)

  const targetUser = await db.user.findUnique({ where: { id: result.data.userId }, select: { slug: true, preferences: { select: { enableGuestbook: true } } } })
  if (!targetUser) {
    throw createError({ status: 404, statusText: "The target profile does not exist." })
  }
  if (!targetUser.preferences?.enableGuestbook) {
    throw createError({ status: 403, statusText: "This user has disabled their guestbook." })
  }

  const newComment = await db.comment.create({ data: { userId: result.data.userId, name: result.data.name, email: result.data.email || null, message: result.data.message } })

  await deleteCached(CacheKeys.userComments(result.data.userId), CacheKeys.userProfile(targetUser.slug))

  return { newComment }
})

defineRouteMeta({
  openAPI: {
    summary: "Post guestbook comment",
    description: "Posts a comment to a user's guestbook. Requires the target user to have guestbook enabled. Rate limited by IP.",
    tags: ["Analytics"],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["userId", "name", "message"],
            properties: {
              userId: { type: "string" },
              name: { type: "string" },
              email: { type: "string", format: "email" },
              message: { type: "string" },
            },
          },
        },
      },
    },
    responses: {
      200: { description: "Comment posted" },
      400: { description: "Validation error" },
      403: { description: "Guestbook disabled by user" },
      404: { description: "Target profile not found" },
      429: { description: "Rate limit exceeded" },
    },
  },
})
