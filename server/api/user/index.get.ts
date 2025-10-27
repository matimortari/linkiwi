import db from "#server/lib/db"
import { getUserFromSession } from "#server/lib/utils"
import { createError, defineEventHandler } from "h3"

export default defineEventHandler(async (event) => {
  const user = await db.user.findUnique({
    where: { id: (await getUserFromSession(event))?.id },
    select: {
      id: true,
      name: true,
      email: true,
      slug: true,
      description: true,
      preferences: true,
    },
  })
  if (!user) {
    throw createError({ statusCode: 404, message: "User not found" })
  }

  return { user }
})
