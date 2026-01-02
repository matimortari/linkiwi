export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.user) {
    throw createError({ statusCode: 401, message: "Not authenticated" })
  }

  // Clear the user session
  await clearUserSession(event)

  return { success: true }
})
