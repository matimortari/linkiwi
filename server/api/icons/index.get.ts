import db from "#server/lib/db"
import { getUserFromSession } from "#server/lib/utils"

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)

  const icons = await db.userIcon.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      url: true,
      platform: true,
      logo: true,
      clicks: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "asc" },
  })

  return { icons }
})
