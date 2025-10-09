import db from "#server/lib/db"
import { getUserFromSession } from "#server/lib/utils"

export default defineEventHandler(async (event) => {
  const sessionUser = await getUserFromSession(event)

  const user = await db.user.findUnique({
    where: { id: sessionUser.id },
    select: { id: true, name: true },
  })
  if (!user) {
    throw createError({ statusCode: 404, message: "User not found" })
  }

  await db.user.delete({
    where: { id: user.id },
  })

  await clearUserSession(event)

  return { success: true, message: "User account deleted successfully" }
})
