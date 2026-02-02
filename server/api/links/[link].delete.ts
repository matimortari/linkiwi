import db from "#server/utils/db"
import { getUserFromSession } from "#server/utils/helpers"
import { CacheKeys, deleteCached } from "#server/utils/redis"

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)
  const linkId = getRouterParam(event, "link")
  if (!linkId) {
    throw createError({ status: 400, statusText: "Link ID is required" })
  }

  const linkData = await db.userLink.findUnique({ where: { id: linkId }, select: { id: true, userId: true } })
  if (!linkData) {
    throw createError({ status: 404, statusText: "Link not found" })
  }
  if (linkData.userId !== user.id) {
    throw createError({ status: 403, statusText: "You don't have permission to delete this link" })
  }

  await db.userLink.delete({ where: { id: linkId } })

  // Invalidate links cache and user profile cache
  const userData = await db.user.findUnique({ where: { id: user.id }, select: { slug: true } })
  await deleteCached(CacheKeys.userLinks(user.id), CacheKeys.userProfile(userData?.slug || ""))

  return { success: true, message: "Link deleted successfully" }
})
