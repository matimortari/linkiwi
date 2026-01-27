import db from "#server/utils/db"

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug")
  if (!slug) {
    throw createError({ status: 400, statusText: "Slug is required" })
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
    throw createError({ status: 404, statusText: `User '${slug}' not found` })
  }

  return { userProfile }
})
