import db from "#server/lib/db"

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug")
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "Slug is required" })
  }

  const userProfile = await db.user.findUnique({
    where: { slug },
    include: {
      links: {
        orderBy: { createdAt: "asc" },
      },
      icons: {
        orderBy: { createdAt: "asc" },
      },
      preferences: true,
    },
  })
  if (!userProfile) {
    throw createError({ statusCode: 404, statusMessage: `User '${slug}' not found` })
  }

  return { userProfile }
})
