import db from "#server/lib/db"
import { getUserFromSession } from "#server/lib/utils"
import { updateUserPreferencesSchema } from "#shared/lib/schemas/user"

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)

  const body = await readBody(event)
  const preferencesData = updateUserPreferencesSchema.parse({ userId: user.id, ...body })

  await db.userPreferences.findUnique({
    where: { userId: user.id },
  })

  const updatedPreferences = await db.userPreferences.update({
    where: { userId: user.id },
    data: preferencesData,
  })

  return { preferences: updatedPreferences }
})
