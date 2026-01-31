export function useSessionMonitor() {
  const { loggedIn } = useUserSession()
  const sessionCheckInterval = ref<NodeJS.Timeout | null>(null)

  const clearSessionCheck = () => {
    if (sessionCheckInterval.value) {
      clearInterval(sessionCheckInterval.value)
      sessionCheckInterval.value = null
    }
  }

  watch(loggedIn, (isLoggedIn) => {
    clearSessionCheck()

    if (isLoggedIn && import.meta.client) {
      sessionCheckInterval.value = setInterval(async () => {
        try {
          await $fetch("/api/auth/validate", { method: "POST", credentials: "include" })
        }
        catch (err: any) {
          if (err.statusCode === 401 || err.status === 401) {
            await signOut()
          }
        }
      }, 5 * 60 * 1000) // 5 minutes
    }
  }, { immediate: true })

  const handleStorageChange = async (e: StorageEvent) => {
    if (e.key === "nuxt-session" && !e.newValue && loggedIn.value) {
      await navigateTo("/")
    }
  }

  onMounted(() => globalThis.addEventListener("storage", handleStorageChange))
  onBeforeUnmount(() => {
    clearSessionCheck()
    globalThis.removeEventListener("storage", handleStorageChange)
  })
}
