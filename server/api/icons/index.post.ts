import db from "#server/lib/db"
import { getUserFromSession } from "#server/lib/utils"
import { createUserIconSchema } from "#shared/lib/schemas/icons"

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)

  const body = await readBody(event)
  const { url, platform, logo } = createUserIconSchema.parse(body)

  const existingIcon = await db.userIcon.findFirst({
    where: {
      userId: user.id,
      platform,
    },
  })
  if (existingIcon) {
    throw createError({ statusCode: 409, message: "Social icon for this platform already exists" })
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
      url: true,
      platform: true,
      logo: true,
      clicks: true,
      createdAt: true,
    },
  })

  return { icon: newIcon }
})
