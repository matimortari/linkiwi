import db from "#server/utils/db"
import { getUserFromSession } from "#server/utils/helpers"
import { CacheKeys, deleteCached } from "#server/utils/redis"

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)
  const iconId = getRouterParam(event, "icon")
  if (!iconId) {
    throw createError({ status: 400, statusText: "Icon ID is required" })
  }

  const iconData = await db.userIcon.findUnique({ where: { id: iconId }, select: { id: true, userId: true } })
  if (!iconData) {
    throw createError({ status: 404, statusText: "Social icon not found" })
  }
  if (iconData.userId !== user.id) {
    throw createError({ status: 403, statusText: "You don't have permission to delete this social icon" })
  }

  await db.userIcon.delete({ where: { id: iconId } })

  // Invalidate icons cache and user profile cache
  const userData = await db.user.findUnique({ where: { id: user.id }, select: { slug: true } })
  await deleteCached(CacheKeys.userIcons(user.id), CacheKeys.userProfile(userData?.slug || ""))

  return { success: true, message: "Social icon deleted successfully" }
})
