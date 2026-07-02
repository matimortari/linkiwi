import { updateUserSchema } from "#shared/schemas/user-schema"

export default defineEventHandler(async (event) => {
  const sessionUser = await getUserFromSession(event)

  // Rate limit: 30 requests per hour per user
  await enforceRateLimit(event, `user:update:${sessionUser.id}`, 30)

  const body = await readBody(event)
  const result = updateUserSchema.safeParse(body)
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: result.error.issues[0]?.message || "Invalid input" })
  }

  // Get old slug before update to invalidate old cache key
  const oldUser = await db.user.findUnique({ where: { id: sessionUser.id }, select: { slug: true } })
  if (result.data.slug && result.data.slug !== oldUser?.slug) {
    const existingUser = await db.user.findUnique({ where: { slug: result.data.slug } })
    if (existingUser) {
      throw createError({ statusCode: 409, statusMessage: "This username is already taken. Please choose a different one." })
    }
  }

  const updatedUser = await db.user.update({
    where: { id: sessionUser.id },
    data: {
      name: result.data.name,
      slug: result.data.slug,
      description: result.data.description,
      location: result.data.location,
    },
    select: {
      id: true,
      email: true,
      name: true,
      slug: true,
      description: true,
      location: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  await deleteCached(CacheKeys.userData(sessionUser.id), CacheKeys.userProfile(oldUser?.slug || ""), CacheKeys.userProfile(updatedUser.slug))

  return { updatedUser }
})

defineRouteMeta({
  openAPI: {
    summary: "Update user details",
    description: "Updates the user's details.",
    tags: ["User"],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: { type: "string", description: "User name" },
              slug: { type: "string", description: "User username (unique)" },
              description: { type: "string", description: "User description (optional)" },
              location: { type: "string", description: "User location (optional)" },
            },
          },
        },
      },
    },
    responses: {
      200: { description: "Updated user details" },
      400: { description: "Validation error" },
      401: { description: "Unauthenticated" },
      409: { description: "Slug already taken" },
      429: { description: "Rate limit exceeded" },
    },
  },
})
