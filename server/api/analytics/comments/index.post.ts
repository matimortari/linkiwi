import { createCommentSchema } from "#shared/schemas/analytics-schema"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const result = createCommentSchema.safeParse(body)
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: result.error.issues[0]?.message || "Invalid input" })
  }

  // Rate limit: 10 requests per hour per IP
  const clientIp = getRequestIP(event, { xForwardedFor: true }) || "anonymous"
  await enforceRateLimit(event, `comments:public-create:${clientIp}`, 10)

  const targetUser = await db.user.findUnique({ where: { id: result.data.userId }, select: { slug: true, preferences: { select: { enableGuestbook: true } } } })
  if (!targetUser) {
    throw createError({ statusCode: 404, statusMessage: "The target profile does not exist." })
  }
  if (!targetUser.preferences?.enableGuestbook) {
    throw createError({ statusCode: 403, statusMessage: "This user has disabled their guestbook." })
  }

  const newComment = await db.comment.create({ data: { userId: result.data.userId, name: result.data.name, email: result.data.email || null, message: result.data.message } })

  await deleteCached(CacheKeys.userComments(result.data.userId), CacheKeys.userProfile(targetUser.slug))

  return { newComment }
})

defineRouteMeta({
  openAPI: {
    summary: "Post comment to guestbook",
    description: "Posts a comment to the current user's guestbook.",
    tags: ["Analytics"],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["userId", "name", "message"],
            properties: {
              userId: { type: "string", description: "ID of the user to post the comment to" },
              name: { type: "string", description: "Name of the commenter" },
              email: { type: "string", format: "email", description: "Email of the commenter" },
              message: { type: "string", description: "Message of the comment" },
            },
          },
        },
      },
    },
    responses: {
      200: { description: "Guestbook comment posted" },
      400: { description: "Validation error" },
      403: { description: "Guestbook disabled by user" },
      404: { description: "Target profile not found" },
      429: { description: "Rate limit exceeded" },
    },
  },
})
