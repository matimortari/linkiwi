import db from "#server/lib/db"
import { getUserFromSession } from "#server/lib/utils"
import { updateUserLinkSchema } from "#shared/lib/schemas/link-schema"

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)
  const link = getRouterParam(event, "link")
  if (!link) {
    throw createError({ statusCode: 400, message: "Link ID is required" })
  }

  const body = await readBody(event)
  const { url, title } = updateUserLinkSchema.parse({
    url: body.url?.trim(),
    title: body.title?.trim(),
  })

  const linkData = await db.userLink.findUnique({
    where: { id: link },
    select: { id: true, userId: true, url: true, title: true },
  })
  if (!linkData || linkData.userId !== user.id) {
    throw createError({ statusCode: 404, message: "Link not found" })
  }

  const updatedLink = await db.userLink.update({
    where: { id: link },
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
