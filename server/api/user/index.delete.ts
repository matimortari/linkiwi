import db from "#server/utils/db"
import { getUserFromSession } from "#server/utils/helpers"
import { del } from "@vercel/blob"

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)

  // Delete user's avatar from blob storage if it exists
  if (user.image && user.image.includes("blob.vercel-storage.com")) {
    await del(user.image)
  }

  // Delete the user (cascade will handle related records)
  await db.user.delete({ where: { id: user.id } })
  await clearUserSession(event)

  return { success: true, message: "User deleted successfully" }
})
