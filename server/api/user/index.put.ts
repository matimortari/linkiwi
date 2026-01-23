import db from "#server/lib/db"
import { getUserFromSession } from "#server/lib/utils"
import { updateUserSchema } from "#shared/schemas/user-schema"

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)
  const body = await readBody(event)
  const result = updateUserSchema.safeParse(body)
  if (!result.success) {
    throw createError({ status: 400, statusText: result.error.issues[0]?.message || "Invalid input" })
  }

  const updatedUser = await db.user.update({
    where: { id: user.id },
    data: {
      name: result.data.name,
      image: result.data.image,
      slug: result.data.slug,
      description: result.data.description,
    },
    select: {
      id: true,
      email: true,
      name: true,
      slug: true,
      description: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return { updatedUser }
})
