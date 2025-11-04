import db from "#server/lib/db"
import { getUserFromSession } from "#server/lib/utils"
import { updateUserSchema } from "#shared/lib/schemas/user-schema"

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)

  const body = await readBody(event)
  const { email, name, slug, description } = updateUserSchema.parse(body)
  if (email && email !== user.email) {
    const existingUser = await db.user.findUnique({
      where: { email },
    })
    if (existingUser) {
      throw createError({ statusCode: 409, message: "Email already in use" })
    }
  }
  if (slug && slug !== user.slug) {
    const existingUser = await db.user.findUnique({
      where: { slug },
    })
    if (existingUser) {
      throw createError({ statusCode: 409, message: "Slug already taken" })
    }
  }

  const updatedUser = await db.user.update({
    where: { id: user.id },
    data: {
      email,
      name,
      slug,
      description,
    },
    select: { id: true, name: true, email: true, slug: true, description: true },
  })

  return { user: updatedUser }
})
