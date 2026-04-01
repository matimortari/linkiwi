import { analyticsRecordSchema } from "#shared/schemas/analytics-schema"

export default defineEventHandler(async (event) => {
  // Rate limit: 100 requests per hour per IP
  const ip = getRequestIP(event, { xForwardedFor: true }) || "unknown"
  await enforceRateLimit(event, `analytics:${ip}`, 100)

  const body = await readBody(event)
  const result = analyticsRecordSchema.safeParse(body)
  if (!result.success) {
    throw createError({ status: 400, statusText: result.error.issues[0]?.message })
  }

  const targetUser = await db.user.findUnique({ where: { slug: result.data.slug }, select: { id: true, slug: true } })
  if (!targetUser) {
    throw createError({ status: 404, statusText: "User not found" })
  }

  // Do not record analytics for own profile views/clicks
  const session = await getUserSession(event)
  if (session?.user?.id === targetUser.id) {
    return
  }

  switch (result.data.type) {
    case "pageView": {
      const referrer = result.data.referrer || getHeader(event, "referer") || null // The referrer header uses 'referer' due to a misspelling from the original HTTP spec that has been preserved for compatibility
      const source = categorizeReferrer(referrer)
      await db.pageView.create({ data: { userId: targetUser.id, referrer, source } })

      // Invalidate analytics cache
      await deleteCached(CacheKeys.analytics(targetUser.id))

      return { message: "Page view recorded" }
    }

    case "link": {
      if (!result.data.id) {
        throw createError({ status: 400, statusText: "Link ID is required" })
      }

      const link = await db.userLink.findFirst({ where: { id: result.data.id, userId: targetUser.id }, select: { id: true } })
      if (!link) {
        throw createError({ status: 404, statusText: "Link not found" })
      }

      const [linkClick] = await db.$transaction([
        db.linkClick.create({ data: { userLinkId: result.data.id } }),
        db.userLink.update({ where: { id: result.data.id }, data: { clickCount: { increment: 1 } } }),
      ])

      // Invalidate analytics and links cache (clickCount changed)
      await deleteCached(CacheKeys.analytics(targetUser.id), CacheKeys.userLinks(targetUser.id), CacheKeys.userProfile(targetUser.slug))

      return { message: "Link click recorded", linkClick: { userLinkId: linkClick.userLinkId, createdAt: linkClick.createdAt } }
    }

    case "icon": {
      if (!result.data.id) {
        throw createError({ status: 400, statusText: "Icon ID is required" })
      }

      const icon = await db.userIcon.findFirst({ where: { id: result.data.id, userId: targetUser.id }, select: { id: true } })
      if (!icon) {
        throw createError({ status: 404, statusText: "Icon not found" })
      }

      const [iconClick] = await db.$transaction([
        db.iconClick.create({ data: { userIconId: result.data.id } }),
        db.userIcon.update({ where: { id: result.data.id }, data: { clickCount: { increment: 1 } } }),
      ])

      // Invalidate analytics and icons cache (clickCount changed)
      await deleteCached(CacheKeys.analytics(targetUser.id), CacheKeys.userIcons(targetUser.id), CacheKeys.userProfile(targetUser.slug))

      return { message: "Social icon click recorded", iconClick: { userIconId: iconClick.userIconId, createdAt: iconClick.createdAt } }
    }

    default:
      throw createError({ status: 400, statusText: "Invalid analytics type" })
  }
})
