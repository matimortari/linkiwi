import db from "#server/lib/db"
import { getUserFromSession } from "#server/lib/utils"

export default defineEventHandler(async (event) => {
  const sessionUser = await getUserFromSession(event)

  const icons = await db.userIcon.findMany({
    where: { userId: sessionUser.id },
    select: {
      id: true,
      url: true,
      platform: true,
      logo: true,
      clicks: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  })

  return { icons }
})
