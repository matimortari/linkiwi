export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)

  // Delete user's avatar from blob storage if it exists
  if (user.image) {
    await deleteFile(user.image).catch(() => {})
  }

  // Delete the user (cascade will handle related records)
  await db.user.delete({ where: { id: user.id } })
  await clearUserSession(event)

  return { success: true, message: "User deleted successfully" }
})
