import { promises as fs } from "node:fs"
import os from "node:os"
import path from "node:path"
import parquet from "parquetjs"

export default defineEventHandler(async (event) => {
  const sessionUser = await getUserFromSession(event)

  // Rate limit: 5 requests per hour per user
  await enforceRateLimit(event, `analytics:delete:${sessionUser.id}`, 5)

  const query = getQuery(event)
  if (query.type && !["pageView", "itemClick"].includes(query.type as string)) {
    throw createError({ status: 400, statusText: "Invalid analytics data collection type" })
  }

  // Construct standard date constraint block matching index patterns
  const dateFilter: any = {}
  if (query.dateFrom) {
    dateFilter.gte = new Date(query.dateFrom as string)
  }
  if (query.dateTo) {
    dateFilter.lte = new Date(query.dateTo as string)
  }

  const hasDateFilter = Object.keys(dateFilter).length > 0
  const prismaDateWhere = hasDateFilter ? { createdAt: dateFilter } : {}

  let pageViews: any[] = []
  let itemClicks: any[] = []

  // Concurrently get rows matching request scope bounds
  if (!query.type || query.type === "pageView") {
    pageViews = await db.pageView.findMany({
      where: { userId: sessionUser.id, ...prismaDateWhere },
      take: 50000,
      orderBy: { createdAt: "asc" },
    })
  }

  if (!query.type || query.type === "itemClick") {
    itemClicks = await db.itemClick.findMany({
      where: { item: { userId: sessionUser.id }, ...prismaDateWhere },
      take: 50000,
      orderBy: { createdAt: "asc" },
      include: { item: { select: { type: true, order: true } } }, // Include parent item information to enrich the cold archive file details
    })
  }
  if (pageViews.length + itemClicks.length === 0) {
    return { success: true, message: "No records found within selected range parameters" }
  }

  const timestamp = Date.now()
  const archiveFiles: File[] = []

  // Compile page views into a compressed Parquet partition
  if (pageViews.length > 0) {
    const schema = new parquet.ParquetSchema({
      id: { type: "UTF8" },
      userId: { type: "UTF8" },
      referrer: { type: "UTF8", optional: true },
      source: { type: "UTF8", optional: true },
      createdAt: { type: "TIMESTAMP_MILLIS" },
    })

    const tempPath = path.join(os.tmpdir(), `pageviews_archive_${timestamp}.parquet`)
    const writer = await parquet.ParquetWriter.openFile(schema, tempPath)
    for (const pv of pageViews) {
      await writer.appendRow({
        id: pv.id,
        userId: pv.userId,
        referrer: pv.referrer ?? null,
        source: pv.source ?? null,
        createdAt: pv.createdAt,
      })
    }

    await writer.close()
    const buffer = await fs.readFile(tempPath)

    archiveFiles.push(new File([new Uint8Array(buffer)], `pageviews_archive_${timestamp}.parquet`, { type: "application/vnd.apache.parquet" }))
    await fs.unlink(tempPath)
  }

  // Compile item clicks into a compressed Parquet partition
  if (itemClicks.length > 0) {
    const schema = new parquet.ParquetSchema({
      id: { type: "UTF8" },
      itemId: { type: "UTF8" },
      itemType: { type: "UTF8" },
      itemOrder: { type: "INT32" },
      createdAt: { type: "TIMESTAMP_MILLIS" },
    })

    const tempPath = path.join(os.tmpdir(), `itemclicks_archive_${timestamp}.parquet`)
    const writer = await parquet.ParquetWriter.openFile(schema, tempPath)
    for (const ic of itemClicks) {
      await writer.appendRow({
        id: ic.id,
        itemId: ic.itemId,
        itemType: ic.item?.type ?? "UNKNOWN",
        itemOrder: ic.item?.order ?? 0,
        createdAt: ic.createdAt,
      })
    }

    await writer.close()
    const buffer = await fs.readFile(tempPath)

    // Fixed: Cast Node Buffer via Uint8Array array boundary wrapping to appease Type Engine
    archiveFiles.push(new File([new Uint8Array(buffer)], `itemclicks_archive_${timestamp}.parquet`, { type: "application/vnd.apache.parquet" }))
    await fs.unlink(tempPath)
  }

  // Push generated data snapshots to cold storage
  for (const file of archiveFiles) {
    await uploadFile({
      path: `archive/user_${sessionUser.id}`,
      file,
      maxSize: 50 * 1024 * 1024, // 50MB
      allowedMimeTypes: ["application/vnd.apache.parquet", "application/octet-stream"],
    })
  }

  // Atomic purging transaction execution across active relations
  let purgedCount = 0
  await db.$transaction(async (tx) => {
    if (pageViews.length > 0) {
      const result = await tx.pageView.deleteMany({ where: { id: { in: pageViews.map(pv => pv.id) } } })
      purgedCount += result.count
    }
    if (itemClicks.length > 0) {
      const result = await tx.itemClick.deleteMany({ where: { id: { in: itemClicks.map(ic => ic.id) } } })
      purgedCount += result.count
    }
  })

  const user = await db.user.findUnique({ where: { id: sessionUser.id }, select: { slug: true } })
  const dynamicOverviewKey = `analytics:overview:${sessionUser.id}:${query.dateFrom || "all"}:${query.dateTo || "all"}`

  await deleteCached(dynamicOverviewKey, CacheKeys.analytics(sessionUser.id), CacheKeys.userProfile(user?.slug || ""))

  return { success: true, message: `Successfully deleted ${purgedCount} entries.` }
})
