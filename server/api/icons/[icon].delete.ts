import db from "#server/lib/db"
import { getUserFromSession } from "#server/lib/utils"

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)
  const iconId = getRouterParam(event, "icon")
  if (!iconId) {
    throw createError({ status: 400, statusText: "Icon ID is required" })
  }

  const iconData = await db.userIcon.findUnique({
    where: { id: iconId },
    select: { id: true, userId: true },
  })
  if (!iconData) {
    throw createError({ status: 404, statusText: "Icon not found" })
  }
  if (iconData.userId !== user.id) {
    throw createError({ status: 403, statusText: "You don't have permission to delete this icon" })
  }

  await db.userIcon.delete({
    where: { id: iconId },
  })

  return { success: true, message: "Icon deleted successfully" }
})
