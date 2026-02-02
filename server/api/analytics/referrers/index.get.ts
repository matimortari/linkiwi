import db from "#server/utils/db"
import { formatSourceLabel, getUserFromSession } from "#server/utils/helpers"

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)
  const query = getQuery(event)

  // Optional date range filtering
  const dateFrom = query.dateFrom ? new Date(query.dateFrom as string) : undefined
  const dateTo = query.dateTo ? new Date(query.dateTo as string) : undefined

  const referrerStats = await db.pageView.groupBy({
    by: ["source"],
    where: {
      userId: user.id,
      source: { not: null }, // Exclude null sources to prevent data integrity issues
      ...(dateFrom || dateTo ? { createdAt: { ...(dateFrom && { gte: dateFrom }), ...(dateTo && { lte: dateTo }) } } : {}),
    },
    _count: { source: true },
    orderBy: { _count: { source: "desc" } },
  })

  const totalViews = referrerStats.reduce((sum, stat) => sum + stat._count.source, 0)

  // Format the response with percentages and labels
  const formattedStats = referrerStats.map(stat => ({
    source: stat.source || "unknown",
    count: stat._count.source,
    percentage: totalViews > 0 ? ((stat._count.source / totalViews) * 100).toFixed(1) : "0",
    label: formatSourceLabel(stat.source || "unknown"),
  }))

  return { referrers: formattedStats, totalViews }
})
