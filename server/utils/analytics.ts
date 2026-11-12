interface DailyCount {
  date: string
  count: number
}

interface TypedDailyCount {
  date: string
  type: string
  count: number
}

interface SourceCount {
  source: string | null
  count: number
}

interface LinkClickCount {
  itemId: string
  label: string
  count: number
}

function toUtcDateKey(value: Date | string): string | null {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date.toISOString().slice(0, 10)
}

/**
 * Merges per-day page views and typed item clicks into a single time series.
 */
export function mergeDailyStats(views: DailyCount[], clicks: TypedDailyCount[]): AnalyticsDailyStat[] {
  const byDate = new Map<string, AnalyticsDailyStat>()

  function bucket(date: string): AnalyticsDailyStat {
    let row = byDate.get(date)
    if (!row) {
      row = { date, pageViews: 0, linkClicks: 0, iconClicks: 0, widgetClicks: 0 }
      byDate.set(date, row)
    }
    return row
  }

  for (const view of views) {
    const date = toUtcDateKey(view.date)
    if (!date) {
      continue
    }
    bucket(date).pageViews += view.count
  }

  for (const click of clicks) {
    const date = toUtcDateKey(click.date)
    if (!date) {
      continue
    }

    const row = bucket(date)
    if (click.type === "LINK") {
      row.linkClicks += click.count
    }
    else if (click.type === "ICON") {
      row.iconClicks += click.count
    }
    else if (click.type === "WIDGET") {
      row.widgetClicks += click.count
    }
  }

  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * Turns grouped source counts into the top-N referrer rows used by analytics charts.
 */
export function summarizeReferrers(sources: SourceCount[], totalViews: number, limit: number = 6): AnalyticsReferrer[] {
  const counts: Record<string, number> = {}
  for (const row of sources) {
    const source = row.source?.trim() ? row.source.trim().toLowerCase() : "direct"
    counts[source] = (counts[source] ?? 0) + row.count
  }

  return Object.entries(counts).map(([source, count]) => ({
    source,
    count,
    percentage: totalViews ? ((count / totalViews) * 100).toFixed(1) : "0.0",
  })).sort((a, b) => b.count - a.count).slice(0, limit)
}

function dateBounds(dateFrom?: Date, dateTo?: Date) {
  const from = dateFrom && !Number.isNaN(dateFrom.getTime()) ? dateFrom : new Date(0)
  const to = dateTo && !Number.isNaN(dateTo.getTime()) ? dateTo : new Date("9999-12-31T23:59:59.999Z")
  return { from, to }
}

/**
 * Aggregates page views and item clicks in the database. Returns chart-ready totals
 * instead of every analytics row.
 */
export async function fetchAnalyticsSummary(userId: string, dateFrom?: Date, dateTo?: Date): Promise<AnalyticsSummary> {
  const { from, to } = dateBounds(dateFrom, dateTo)
  const createdAt = { gte: from, lte: to }

  const [totalViews, totalClicks, sourceGroups, viewsByDate, clicksByDate, clicksPerLink] = await Promise.all([
    db.pageView.count({ where: { userId, createdAt } }),
    db.itemClick.count({ where: { item: { userId }, createdAt } }),
    db.pageView.groupBy({
      by: ["source"],
      where: { userId, createdAt },
      _count: { _all: true },
    }),
    db.$queryRaw<DailyCount[]>`
      SELECT to_char((pv."createdAt" AT TIME ZONE 'UTC')::date, 'YYYY-MM-DD') AS date, COUNT(*)::int AS count
      FROM "PageView" pv
      WHERE pv."userId" = ${userId}
        AND pv."createdAt" >= ${from}
        AND pv."createdAt" <= ${to}
      GROUP BY 1
      ORDER BY 1
    `,
    db.$queryRaw<TypedDailyCount[]>`
      SELECT to_char((ic."createdAt" AT TIME ZONE 'UTC')::date, 'YYYY-MM-DD') AS date, pi.type::text AS type, COUNT(*)::int AS count
      FROM "ItemClick" ic
      INNER JOIN "ProfileItem" pi ON pi.id = ic."itemId"
      WHERE pi."userId" = ${userId}
        AND ic."createdAt" >= ${from}
        AND ic."createdAt" <= ${to}
      GROUP BY 1, 2
      ORDER BY 1
    `,
    db.$queryRaw<LinkClickCount[]>`
      SELECT pi.id AS "itemId", COALESCE(pil.label, pii.platform, 'Unknown') AS label, COUNT(*)::int AS count
      FROM "ItemClick" ic
      INNER JOIN "ProfileItem" pi ON pi.id = ic."itemId"
      LEFT JOIN "ProfileItemLink" pil ON pil."itemId" = pi.id
      LEFT JOIN "ProfileItemIcon" pii ON pii."itemId" = pi.id
      WHERE pi."userId" = ${userId}
        AND pi.type IN ('LINK', 'ICON')
        AND ic."createdAt" >= ${from}
        AND ic."createdAt" <= ${to}
      GROUP BY pi.id, COALESCE(pil.label, pii.platform, 'Unknown')
      ORDER BY count DESC
    `,
  ])

  return {
    totalViews,
    totalClicks,
    stats: mergeDailyStats(viewsByDate, clicksByDate),
    topReferrers: summarizeReferrers(sourceGroups.map(row => ({ source: row.source, count: row._count._all })), totalViews),
    clicksPerLink,
  }
}
