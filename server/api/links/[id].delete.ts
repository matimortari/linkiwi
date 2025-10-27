import db from "#server/lib/db"
import { getUserFromSession } from "#server/lib/utils"

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)

  const linkId = getRouterParam(event, "id")
  if (!linkId) {
    throw createError({ statusCode: 400, message: "Link ID is required" })
  }

  const link = await db.userLink.findUnique({
    where: { id: linkId },
    select: { id: true, userId: true, title: true },
  })
  if (!link) {
    throw createError({ statusCode: 404, message: "Link not found" })
  }
  if (link.userId !== user.id) {
    throw createError({ statusCode: 403, message: "You don't have permission to delete this link" })
  }

  await db.userLink.delete({
    where: { id: linkId },
  })

  return { success: true, message: "Link deleted successfully" }
})
