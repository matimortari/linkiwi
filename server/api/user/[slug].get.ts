import db from "#server/lib/db"

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug")

  const user = await db.user.findUnique({
    where: { slug },
    include: {
      links: true,
      icons: true,
      preferences: true,
    },
  })
  if (!user) {
    throw createError({ statusCode: 404, message: `User with slug '${slug}' not found` })
  }

  return user
})
