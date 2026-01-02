export default defineNuxtRouteMiddleware(async () => {
  const { loggedIn } = useUserSession()
  if (!loggedIn.value) {
    return navigateTo("/", { replace: true })
  }

  // Validate session and update activity
  try {
    await $fetch("/api/auth/validate", { method: "POST", credentials: "include" })
  }
  catch (err: any) {
    if (err.statusCode === 401) {
      await signOut()
    }
  }
})
