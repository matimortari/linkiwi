import db from "#server/lib/db"
import { getUserFromSession } from "#server/lib/utils"
import { updateUserPreferencesSchema } from "#shared/schemas/user"

export default defineEventHandler(async (event) => {
  const sessionUser = await getUserFromSession(event)

  const body = await readBody(event)
  const { userId, ...preferencesBody } = body

  const preferencesData = updateUserPreferencesSchema.parse(preferencesBody)

  const existingPreferences = await db.userPreferences.findUnique({
    where: { userId: sessionUser.id },
  })

  let updatedPreferences
  if (!existingPreferences) {
    updatedPreferences = await db.userPreferences.create({
      data: {
        userId: sessionUser.id,
        ...preferencesData,
      },
    })
  }
  else {
    updatedPreferences = await db.userPreferences.update({
      where: { userId: sessionUser.id },
      data: preferencesData,
    })
  }

  return { preferences: updatedPreferences }
})
