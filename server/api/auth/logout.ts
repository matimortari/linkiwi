export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.user || !session.expiresAt || !session.lastActivityAt) {
    throw createError({ status: 401, message: "Not authenticated" })
  }

  await clearUserSession(event)

  return { success: true }
})
