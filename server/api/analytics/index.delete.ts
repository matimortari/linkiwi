import { Buffer } from "node:buffer"
import { promises as fs } from "node:fs"
import os from "node:os"
import path from "node:path"
import parquet from "parquetjs"

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)

  // Rate limit: 5 requests per hour per user
  await enforceRateLimit(event, `analytics:delete:${user.id}`, 5, 60 * 60 * 1000)

  const query = getQuery(event)
  if (query.type && !["pageView", "linkClick", "iconClick"].includes(query.type as string)) {
    throw createError({ status: 400, statusText: "Invalid analytics type" })
  }

  const dateFilter: any = {}
  if (query.dateFrom) {
    dateFilter.gte = new Date(query.dateFrom as string)
  }
  if (query.dateTo) {
    dateFilter.lte = new Date(query.dateTo as string)
  }

  const hasDateFilter = Object.keys(dateFilter).length > 0

  let pageViews: any[] = []
  let linkClicks: any[] = []
  let iconClicks: any[] = []
  if (!query.type || query.type === "pageView") {
    pageViews = await db.pageView.findMany({
      where: { userId: user.id, ...(hasDateFilter && { createdAt: dateFilter }) },
      take: 50000,
      orderBy: { createdAt: "asc" },
    })
  }

  if (!query.type || query.type === "linkClick") {
    const userLinks = await db.userLink.findMany({ where: { userId: user.id }, select: { id: true } })
    if (userLinks.length > 0) {
      linkClicks = await db.linkClick.findMany({
        where: { userLinkId: { in: userLinks.map(link => link.id) }, ...(hasDateFilter && { createdAt: dateFilter }) },
        take: 50000,
        orderBy: { createdAt: "asc" },
        include: { userLink: { select: { url: true, title: true } } },
      })
    }
  }

  if (!query.type || query.type === "iconClick") {
    const userIcons = await db.userIcon.findMany({ where: { userId: user.id }, select: { id: true } })
    if (userIcons.length > 0) {
      iconClicks = await db.iconClick.findMany({
        where: { userIconId: { in: userIcons.map(icon => icon.id) }, ...(hasDateFilter && { createdAt: dateFilter }) },
        take: 50000,
        orderBy: { createdAt: "asc" },
        include: { userIcon: { select: { url: true, platform: true, logo: true } } },
      })
    }
  }

  const totalRecords = pageViews.length + linkClicks.length + iconClicks.length
  if (totalRecords === 0) {
    return { success: true, message: "No analytics data found to delete" }
  }

  const timestamp = Date.now()
  const archiveFiles: File[] = []
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
      } as any)
    }

    await writer.close()
    const buffer = await fs.readFile(tempPath)
    archiveFiles.push(new File([Buffer.from(buffer)], `pageviews_archive_${timestamp}.parquet`, { type: "application/vnd.apache.parquet" }))
    await fs.unlink(tempPath)
  }

  if (linkClicks.length > 0) {
    const schema = new parquet.ParquetSchema({
      userLinkId: { type: "UTF8" },
      linkUrl: { type: "UTF8", optional: true },
      linkTitle: { type: "UTF8", optional: true },
      createdAt: { type: "TIMESTAMP_MILLIS" },
    })

    const tempPath = path.join(os.tmpdir(), `linkclicks_archive_${timestamp}.parquet`)
    const writer = await parquet.ParquetWriter.openFile(schema, tempPath)
    for (const lc of linkClicks) {
      await writer.appendRow({
        userLinkId: lc.userLinkId,
        linkUrl: lc.userLink?.url ?? null,
        linkTitle: lc.userLink?.title ?? null,
        createdAt: lc.createdAt,
      } as any)
    }

    await writer.close()
    const buffer = await fs.readFile(tempPath)
    archiveFiles.push(new File([Buffer.from(buffer)], `linkclicks_archive_${timestamp}.parquet`, { type: "application/vnd.apache.parquet" }))
    await fs.unlink(tempPath)
  }

  if (iconClicks.length > 0) {
    const schema = new parquet.ParquetSchema({
      userIconId: { type: "UTF8" },
      iconUrl: { type: "UTF8", optional: true },
      iconPlatform: { type: "UTF8", optional: true },
      iconLogo: { type: "UTF8", optional: true },
      createdAt: { type: "TIMESTAMP_MILLIS" },
    })

    const tempPath = path.join(os.tmpdir(), `iconclicks_archive_${timestamp}.parquet`)
    const writer = await parquet.ParquetWriter.openFile(schema, tempPath)
    for (const ic of iconClicks) {
      await writer.appendRow({
        userIconId: ic.userIconId,
        iconUrl: ic.userIcon?.url ?? null,
        iconPlatform: ic.userIcon?.platform ?? null,
        iconLogo: ic.userIcon?.logo ?? null,
        createdAt: ic.createdAt,
      } as any)
    }

    await writer.close()
    const buffer = await fs.readFile(tempPath)
    archiveFiles.push(new File([Buffer.from(buffer)], `iconclicks_archive_${timestamp}.parquet`, { type: "application/vnd.apache.parquet" }))
    await fs.unlink(tempPath)
  }

  // Upload all records to cold storage
  for (const file of archiveFiles) {
    await uploadFile({
      path: `archive/user_${user.id}`,
      file,
      maxSize: 50 * 1024 * 1024, // 50 MB
      allowedMimeTypes: ["application/vnd.apache.parquet", "application/octet-stream"],
    })
  }

  // Delete records from database in a transaction
  let deleteResult = 0
  await db.$transaction(async (tx) => {
    if (pageViews.length > 0) {
      const result = await tx.pageView.deleteMany({ where: { id: { in: pageViews.map(pv => pv.id) } } })
      deleteResult += result.count
    }

    if (linkClicks.length > 0) {
      const result = await tx.linkClick.deleteMany({ where: { userLinkId: { in: linkClicks.map(lc => lc.userLinkId) }, createdAt: { in: linkClicks.map(lc => lc.createdAt) } } })
      deleteResult += result.count

      // Update clickCounts
      const userLinks = await tx.userLink.findMany({ where: { userId: user.id }, select: { id: true } })
      if (hasDateFilter) {
        for (const link of userLinks) {
          const remainingClicks = await tx.linkClick.count({ where: { userLinkId: link.id } })
          await tx.userLink.update({ where: { id: link.id }, data: { clickCount: remainingClicks } })
        }
      }
      else {
        await tx.userLink.updateMany({
          where: { userId: user.id, id: { in: userLinks.map(link => link.id) } },
          data: { clickCount: 0 },
        })
      }
    }

    if (iconClicks.length > 0) {
      const result = await tx.iconClick.deleteMany({ where: { userIconId: { in: iconClicks.map(ic => ic.userIconId) }, createdAt: { in: iconClicks.map(ic => ic.createdAt) } } })
      deleteResult += result.count

      // Update clickCounts
      const userIcons = await tx.userIcon.findMany({ where: { userId: user.id }, select: { id: true } })
      if (hasDateFilter) {
        for (const icon of userIcons) {
          const remainingClicks = await tx.iconClick.count({ where: { userIconId: icon.id } })
          await tx.userIcon.update({ where: { id: icon.id }, data: { clickCount: remainingClicks } })
        }
      }
      else {
        await tx.userIcon.updateMany({
          where: { userId: user.id, id: { in: userIcons.map(icon => icon.id) } },
          data: { clickCount: 0 },
        })
      }
    }
  })

  // Invalidate cache
  const userData = await db.user.findUnique({ where: { id: user.id }, select: { slug: true } })
  await deleteCached(CacheKeys.analytics(user.id), CacheKeys.userLinks(user.id), CacheKeys.userIcons(user.id), CacheKeys.userProfile(userData?.slug || ""))

  return { success: true, message: `Successfully deleted ${deleteResult} analytics ${deleteResult === 1 ? "record" : "records"}` }
})
