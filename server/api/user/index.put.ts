import db from "#server/lib/db"
import { getUserFromSession } from "#server/lib/utils"
import { updateUserSchema } from "~~/shared/schemas/user-schema"
import z from "zod"

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)
  const body = await readBody(event)

  const result = updateUserSchema.safeParse(body)
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: "Invalid input", data: z.treeifyError(result.error) })
  }

  const updatedUserData = await db.user.update({
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

  return updatedUserData
})
