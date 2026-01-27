import db from "#server/utils/db"
import { getUserFromSession } from "#server/utils/helpers"
import { createUserIconSchema } from "#shared/schemas/icon-schema"

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)
  const body = await readBody(event)
  const result = createUserIconSchema.safeParse(body)
  if (!result.success) {
    throw createError({ status: 400, statusText: result.error.issues[0]?.message || "Invalid input" })
  }

  const { url, platform, logo } = result.data

  const existingIcon = await db.userIcon.findFirst({
    where: {
      userId: user.id,
      platform,
    },
  })
  if (existingIcon) {
    throw createError({ status: 409, statusText: "Social icon for this platform already exists" })
  }

  const newIcon = await db.userIcon.create({
    data: {
      userId: user.id,
      url,
      platform,
      logo,
    },
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
  })

  return { icon: newIcon }
})
