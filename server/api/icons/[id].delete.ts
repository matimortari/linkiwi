import db from "#server/lib/db"
import { getUserFromSession } from "#server/lib/utils"

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)

  const iconId = getRouterParam(event, "id")
  if (!iconId) {
    throw createError({ statusCode: 400, message: "Social icon ID is required" })
  }

  const icon = await db.userIcon.findUnique({
    where: { id: iconId },
    select: { id: true, userId: true, platform: true },
  })
  if (!icon) {
    throw createError({ statusCode: 404, message: "Icon not found" })
  }
  if (icon.userId !== user.id) {
    throw createError({ statusCode: 403, message: "You don't have permission to delete this social icon" })
  }

  await db.userIcon.delete({
    where: { id: iconId },
  })

  return { success: true, message: "Social icon deleted successfully" }
})
