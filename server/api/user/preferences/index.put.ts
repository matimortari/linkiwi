import db from "#server/lib/db"
import { getUserFromSession } from "#server/lib/utils"
import { updateUserPreferencesSchema } from "#shared/schemas/user-schema"

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)
  const body = await readBody(event)
  const result = updateUserPreferencesSchema.safeParse(body)
  if (!result.success) {
    throw createError({ status: 400, statusText: result.error.issues[0]?.message || "Invalid input" })
  }

  const updatedPreferences = await db.userPreferences.update({
    where: { userId: user.id },
    data: result.data,
  })

  return { updatedPreferences }
})
