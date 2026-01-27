import db from "#server/utils/db"
import { getUserFromSession } from "#server/utils/helpers"
import { createUserLinkSchema } from "#shared/schemas/link-schema"

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)
  const body = await readBody(event)
  const result = createUserLinkSchema.safeParse(body)
  if (!result.success) {
    throw createError({ status: 400, statusText: result.error.issues[0]?.message || "Invalid input" })
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
