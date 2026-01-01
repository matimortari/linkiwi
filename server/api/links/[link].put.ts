import db from "#server/lib/db"
import { getUserFromSession } from "#server/lib/utils"
import { updateUserLinkSchema } from "#shared/schemas/link-schema"

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)
  const linkId = getRouterParam(event, "link")
  if (!linkId) {
    throw createError({ statusCode: 400, statusMessage: "Link ID is required" })
  }
  const body = await readBody(event)
  const result = updateUserLinkSchema.safeParse(body)
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: result.error.issues[0]?.message || "Invalid input" })
  }

  const { url, title } = result.data

  const linkData = await db.userLink.findUnique({
    where: { id: linkId },
    select: { id: true, userId: true },
  })
  if (!linkData) {
    throw createError({ statusCode: 404, statusMessage: "Link not found" })
  }
  if (linkData.userId !== user.id) {
    throw createError({ statusCode: 403, statusMessage: "You don't have permission to update this link" })
  }

  const updatedLink = await db.userLink.update({
    where: { id: linkId },
    data: { url, title },
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

  return { link: updatedLink }
})
