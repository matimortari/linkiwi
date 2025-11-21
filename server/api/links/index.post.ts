import db from "#server/lib/db"
import { getUserFromSession } from "#server/lib/utils"
import { createUserLinkSchema } from "#shared/schemas/link-schema"

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)

  const body = await readBody(event)
  const { url, title } = createUserLinkSchema.parse(body)

  const newLink = await db.userLink.create({
    data: {
      userId: user.id,
      url,
      title,
    },
    select: {
      id: true,
      url: true,
      title: true,
      clicks: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return { link: newLink }
})
