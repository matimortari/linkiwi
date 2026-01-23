import db from "#server/lib/db"
import { getUserFromSession } from "#server/lib/utils"

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)
  const linkId = getRouterParam(event, "link")
  if (!linkId) {
    throw createError({ status: 400, statusText: "Link ID is required" })
  }

  const linkData = await db.userLink.findUnique({
    where: { id: linkId },
    select: { id: true, userId: true },
  })
  if (!linkData) {
    throw createError({ status: 404, statusText: "Link not found" })
  }
  if (linkData.userId !== user.id) {
    throw createError({ status: 403, statusText: "You don't have permission to delete this link" })
  }

  await db.userLink.delete({
    where: { id: linkId },
  })

  return { success: true, message: "Link deleted successfully" }
})
