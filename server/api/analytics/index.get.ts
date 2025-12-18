import db from "#server/lib/db"
import { getUserFromSession } from "#server/lib/utils"

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)

  const [pageViews, linkClicks, iconClicks] = await Promise.all([
    db.pageView.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      select: {
        id: true,
        userId: true,
        date: true,
        referrer: true,
        source: true,
      },
    }),
    db.linkClick.findMany({
      where: { userLink: { userId: user.id } },
      orderBy: { date: "desc" },
      include: { userLink: true },
    }),
    db.iconClick.findMany({
      where: { userIcon: { userId: user.id } },
      orderBy: { date: "desc" },
      include: { userIcon: true },
    }),
  ])

  return {
    pageViews,
    linkClicks,
    iconClicks,
  }
})
