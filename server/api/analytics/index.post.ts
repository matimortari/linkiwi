import db from "#server/lib/db"
import { categorizeReferrer } from "#server/lib/utils"
import { analyticsRecordSchema } from "#shared/schemas/analytics-schema"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const analyticsData = analyticsRecordSchema.safeParse(body)
  if (!analyticsData.success) {
    throw createError({ statusCode: 400, statusMessage: analyticsData.error.issues[0]?.message })
  }

  const { type, userId, id } = analyticsData.data

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true },
  })
  if (!user) {
    throw createError({ statusCode: 404, statusMessage: "User not found" })
  }

  // Do not record analytics for own profile views/clicks
  const session = await getUserSession(event)
  if (session?.user?.id === userId) {
    return { message: "Analytics not recorded for own profile" }
  }

  switch (type) {
    case "pageView": {
      const referrer = body.referrer || getHeader(event, "referer") || getHeader(event, "referrer") || null
      const source = categorizeReferrer(referrer)

      await db.pageView.create({
        data: { userId, referrer, source },
      })
      return { message: "Page view recorded successfully" }
    }

    case "link": {
      if (!id) {
        throw createError({ statusCode: 400, statusMessage: "Link ID is required" })
      }

      const link = await db.userLink.findFirst({
        where: { id, userId },
        select: { id: true, clicks: true },
      })
      if (!link) {
        throw createError({ statusCode: 404, statusMessage: "Link not found" })
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

      return {
        message: "Link click recorded successfully",
        linkClick: {
          userLinkId: linkClick.userLinkId,
          createdAt: linkClick.createdAt,
        },
      }
    }

    case "icon": {
      if (!id) {
        throw createError({ statusCode: 400, statusMessage: "Icon ID is required" })
      }

      const icon = await db.userIcon.findFirst({
        where: { id, userId },
        select: { id: true, clicks: true },
      })
      if (!icon) {
        throw createError({ statusCode: 404, statusMessage: "Icon not found" })
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

      return {
        message: "Social icon click recorded successfully",
        iconClick: {
          userIconId: iconClick.userIconId,
          createdAt: iconClick.createdAt,
        },
      }
    }

    default:
      throw createError({ statusCode: 400, statusMessage: "Invalid analytics type" })
  }
})
