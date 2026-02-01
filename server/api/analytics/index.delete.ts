import db from "#server/utils/db"
import { getUserFromSession } from "#server/utils/helpers"
import { CacheKeys, deleteCached } from "#server/utils/redis"

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)
  const query = getQuery(event)
  const { type, dateFrom, dateTo } = query

  // Validate type if provided
  if (type && !["pageView", "linkClick", "iconClick"].includes(type as string)) {
    throw createError({ status: 400, statusText: "Invalid analytics type" })
  }

  // Build date filter
  const dateFilter: any = {}
  if (dateFrom) {
    dateFilter.gte = new Date(dateFrom as string)
  }
  if (dateTo) {
    dateFilter.lte = new Date(dateTo as string)
  }

  const hasDateFilter = Object.keys(dateFilter).length > 0
  let deletedCount = 0

  await db.$transaction(async (tx) => {
    if (!type || type === "pageView") {
      const result = await tx.pageView.deleteMany({
        where: { userId: user.id, ...(hasDateFilter && { createdAt: dateFilter }) },
      })
      deletedCount += result.count
    }

    if (!type || type === "linkClick") {
      const userLinks = await tx.userLink.findMany({
        where: { userId: user.id },
        select: { id: true },
      })

      if (userLinks.length > 0) {
        const result = await tx.linkClick.deleteMany({
          where: {
            userLinkId: { in: userLinks.map(link => link.id) },
            ...(hasDateFilter && { createdAt: dateFilter }),
          },
        })
        deletedCount += result.count

        // Only reset clickCount if deleting all clicks with no date filter
        if (!hasDateFilter) {
          await tx.userLink.updateMany({
            where: {
              userId: user.id,
              id: { in: userLinks.map(link => link.id) },
            },
            data: { clickCount: 0 },
          })
        }
        else {
          for (const link of userLinks) {
            const remainingClicks = await tx.linkClick.count({
              where: { userLinkId: link.id },
            })
            await tx.userLink.update({
              where: { id: link.id },
              data: { clickCount: remainingClicks },
            })
          }
        }
      }
    }

    if (!type || type === "iconClick") {
      const userIcons = await tx.userIcon.findMany({
        where: { userId: user.id },
        select: { id: true },
      })

      if (userIcons.length > 0) {
        const result = await tx.iconClick.deleteMany({
          where: {
            userIconId: { in: userIcons.map(icon => icon.id) },
            ...(hasDateFilter && { createdAt: dateFilter }),
          },
        })
        deletedCount += result.count

        // Only reset clickCount if deleting all clicks with no date filter
        if (!hasDateFilter) {
          await tx.userIcon.updateMany({
            where: {
              userId: user.id,
              id: { in: userIcons.map(icon => icon.id) },
            },
            data: { clickCount: 0 },
          })
        }
        else {
          for (const icon of userIcons) {
            const remainingClicks = await tx.iconClick.count({
              where: { userIconId: icon.id },
            })
            await tx.userIcon.update({
              where: { id: icon.id },
              data: { clickCount: remainingClicks },
            })
          }
        }
      }
    }
  })

  // Invalidate analytics, links, and icons cache
  const userData = await db.user.findUnique({ where: { id: user.id }, select: { slug: true } })
  await deleteCached(CacheKeys.analytics(user.id), CacheKeys.userLinks(user.id), CacheKeys.userIcons(user.id), CacheKeys.userProfile(userData?.slug || ""))

  return { success: true, message: `Successfully deleted ${deletedCount} analytics record${deletedCount === 1 ? "" : "s"}` }
})
