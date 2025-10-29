import db from "#server/lib/db"
import { getUserFromSession } from "#server/lib/utils"
import { updateUserLinkSchema } from "#shared/lib/schemas/links"

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)

  const linkId = getRouterParam(event, "id")
  if (!linkId) {
    throw createError({ statusCode: 400, message: "Link ID is required" })
  }

  const link = await db.userLink.findUnique({
    where: { id: linkId },
    select: { id: true, userId: true, url: true, title: true },
  })
  if (!link) {
    throw createError({ statusCode: 404, message: "Link not found" })
  }
  if (link.userId !== user.id) {
    throw createError({ statusCode: 403, message: "You don't have permission to update this link" })
  }

  const body = await readBody(event)

  const { url, title } = updateUserLinkSchema.parse({
    url: body.url?.trim(),
    title: body.title?.trim(),
  })

  const updatedLink = await db.userLink.update({
    where: { id: linkId },
    data: { url, title },
    select: {
      id: true,
      url: true,
      title: true,
      clicks: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return { link: updatedLink }
})
