import db from "#server/utils/db"
import { categorizeReferrer } from "#server/utils/helpers"
import { CacheKeys, deleteCached } from "#server/utils/redis"
import { analyticsRecordSchema } from "#shared/schemas/analytics-schema"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const analyticsData = analyticsRecordSchema.safeParse(body)
  if (!analyticsData.success) {
    throw createError({ status: 400, statusText: analyticsData.error.issues[0]?.message })
  }

  const { type, userId, id } = analyticsData.data

  const user = await db.user.findUnique({ where: { id: userId }, select: { id: true } })
  if (!user) {
    throw createError({ status: 404, statusText: "User not found" })
  }

  // Do not record analytics for own profile views/clicks
  const session = await getUserSession(event)
  if (session?.user?.id === userId) {
    return
  }

  switch (type) {
    case "pageView": {
      const referrer = analyticsData.data.referrer || getHeader(event, "referer") || null // The referrer header uses 'referer' due to a misspelling from the original HTTP spec that has been preserved for compatibility
      const source = categorizeReferrer(referrer)
      await db.pageView.create({ data: { userId, referrer, source } })

      // Invalidate analytics cache
      await deleteCached(CacheKeys.analytics(userId))

      return { message: "Page view recorded successfully" }
    }

    case "link": {
      if (!id) {
        throw createError({ status: 400, statusText: "Link ID is required" })
      }

      const link = await db.userLink.findFirst({
        where: { id, userId },
        select: { id: true, clicks: true },
      })
      if (!link) {
        throw createError({ status: 404, statusText: "Link not found" })
      }

      const [linkClick] = await db.$transaction([
        db.linkClick.create({
          data: { userLinkId: id },
        }),
        db.userLink.update({
          where: { id },
          data: { clickCount: { increment: 1 } },
        }),
      ])

      // Invalidate analytics and links cache (clickCount changed)
      const userData = await db.user.findUnique({ where: { id: userId }, select: { slug: true } })
      await deleteCached(CacheKeys.analytics(userId), CacheKeys.userLinks(userId), CacheKeys.userProfile(userData?.slug || ""))

      return {
        message: "Link click recorded successfully",
        linkClick: { userLinkId: linkClick.userLinkId, createdAt: linkClick.createdAt },
      }
    }

    case "icon": {
      if (!id) {
        throw createError({ status: 400, statusText: "Icon ID is required" })
      }

      const icon = await db.userIcon.findFirst({
        where: { id, userId },
        select: { id: true, clicks: true },
      })
      if (!icon) {
        throw createError({ status: 404, statusText: "Icon not found" })
      }

      const [iconClick] = await db.$transaction([
        db.iconClick.create({
          data: { userIconId: id },
        }),
        db.userIcon.update({
          where: { id },
          data: { clickCount: { increment: 1 } },
        }),
      ])

      // Invalidate analytics and icons cache (clickCount changed)
      const userData = await db.user.findUnique({ where: { id: userId }, select: { slug: true } })
      await deleteCached(CacheKeys.analytics(userId), CacheKeys.userIcons(userId), CacheKeys.userProfile(userData?.slug || ""))

      return {
        message: "Social icon click recorded successfully",
        iconClick: { userIconId: iconClick.userIconId, createdAt: iconClick.createdAt },
      }
    }

    default:
      throw createError({ status: 400, statusText: "Invalid analytics type" })
  }
})
