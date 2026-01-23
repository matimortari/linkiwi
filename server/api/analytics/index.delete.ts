import db from "#server/lib/db"
import { getUserFromSession } from "#server/lib/utils"

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

  let deletedCount = 0

  if (!type || type === "pageView") {
    const result = await db.pageView.deleteMany({
      where: {
        userId: user.id,
        ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }),
      },
    })
    deletedCount += result.count
  }

  if (!type || type === "linkClick") {
    const userLinks = await db.userLink.findMany({
      where: { userId: user.id },
      select: { id: true },
    })

    if (userLinks.length > 0) {
      const result = await db.linkClick.deleteMany({
        where: {
          userLinkId: { in: userLinks.map(link => link.id) },
          ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }),
        },
      })
      deletedCount += result.count

      await db.userLink.updateMany({
        where: {
          userId: user.id,
          id: { in: userLinks.map(link => link.id) },
        },
        data: { clickCount: 0 },
      })
    }
  }

  if (!type || type === "iconClick") {
    const userIcons = await db.userIcon.findMany({
      where: { userId: user.id },
      select: { id: true },
    })

    if (userIcons.length > 0) {
      const result = await db.iconClick.deleteMany({
        where: {
          userIconId: { in: userIcons.map(icon => icon.id) },
          ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }),
        },
      })
      deletedCount += result.count

      await db.userIcon.updateMany({
        where: {
          userId: user.id,
          id: { in: userIcons.map(icon => icon.id) },
        },
        data: { clickCount: 0 },
      })
    }
  }

  return { success: true, message: `Successfully deleted ${deletedCount} analytics record${deletedCount === 1 ? "" : "s"}` }
})
