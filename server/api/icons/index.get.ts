import db from "#server/utils/db"
import { getUserFromSession } from "#server/utils/helpers"

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)

  const icons = await db.userIcon.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      userId: true,
      url: true,
      platform: true,
      logo: true,
      clickCount: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "asc" },
  })

  return { icons }
})
