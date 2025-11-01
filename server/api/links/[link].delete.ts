import db from "#server/lib/db"
import { getUserFromSession } from "#server/lib/utils"

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)

  const link = getRouterParam(event, "link")
  if (!link) {
    throw createError({ statusCode: 400, message: "Link ID is required" })
  }

  const linkData = await db.userLink.findUnique({
    where: { id: link },
    select: { id: true, userId: true, title: true },
  })
  if (!linkData) {
    throw createError({ statusCode: 404, message: "Link not found" })
  }
  if (linkData.userId !== user.id) {
    throw createError({ statusCode: 403, message: "You don't have permission to delete this link" })
  }

  await db.userLink.delete({
    where: { id: link },
  })

  return { success: true, message: "Link deleted successfully" }
})
