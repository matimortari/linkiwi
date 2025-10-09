import db from "#server/lib/db"
import { getUserFromSession } from "#server/lib/utils"

export default defineEventHandler(async (event) => {
  const sessionUser = await getUserFromSession(event)

  const links = await db.userLink.findMany({
    where: { userId: sessionUser.id },
    select: {
      id: true,
      url: true,
      title: true,
      clicks: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  })

  return { links }
})
