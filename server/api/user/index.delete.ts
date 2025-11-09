import db from "#server/lib/db"
import { getUserFromSession } from "#server/lib/utils"
import { del } from "@vercel/blob"

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)

  // Delete user's avatar from blob storage if it exists
  if (user.image && user.image.includes("blob.vercel-storage.com")) {
    try {
      await del(user.image)
    }
    catch (error) {
      console.error("Failed to delete user avatar:", error)
    }
  }

  // Delete the user (cascade will handle related records)
  await db.user.delete({
    where: { id: user.id },
  })

  // Clear the session
  await clearUserSession(event)

  return { success: true, message: "User account deleted successfully" }
})
