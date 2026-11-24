export default defineNuxtRouteMiddleware(async () => {
  const { loggedIn, clear } = useUserSession()
  if (!loggedIn.value) {
    return
  }

  try {
    await useRequestFetch()("/api/auth/validate", { method: "POST" })
  }
  catch {
    await clear().catch(() => {})
    return
  }

  return navigateTo("/admin/profile", { replace: true })
})
