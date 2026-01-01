import db from "#server/lib/db"
import { getUserFromSession } from "#server/lib/utils"
import { createUserLinkSchema } from "#shared/schemas/link-schema"

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)
  const body = await readBody(event)
  const result = createUserLinkSchema.safeParse(body)
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: result.error.issues[0]?.message || "Invalid input" })
  }

  const { url, title } = result.data

  const newLink = await db.userLink.create({
    data: {
      userId: user.id,
      url,
      title,
    },
    select: {
      id: true,
      userId: true,
      url: true,
      title: true,
      clickCount: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return { link: newLink }
})
