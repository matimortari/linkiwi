export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)

  // Rate limit: 5 requests per hour per user
  await enforceRateLimit(event, `user:delete:${user.id}`, 5, 60 * 60 * 1000)

  // Delete user's avatar from blob storage if it exists
  if (user.image) {
    await deleteFile(user.image).catch(() => {})
  }

  // Delete the user (cascade will handle related records)
  await db.user.delete({ where: { id: user.id } })
  await clearUserSession(event)

  return { success: true, message: "User deleted successfully" }
})
