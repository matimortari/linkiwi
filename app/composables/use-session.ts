let initialized = false
let sessionCheckInterval: NodeJS.Timeout | null = null
let signOutInProgress = false

async function signOut() {
  if (signOutInProgress) {
    return
  }

  signOutInProgress = true
  const { clear } = useUserSession()

  try {
    try {
      await $fetch("/api/auth/logout", { method: "POST", credentials: "include" })
    }
    catch {
      // Silently ignore errors
    }
    await clear()
    await navigateTo("/")
  }
  finally {
    signOutInProgress = false
  }
}

function signIn(provider: string) {
  navigateTo(`/api/auth/${provider}`, { external: true })
}

export function useSession() {
  if (import.meta.client && !initialized) {
    initialized = true
    const { loggedIn } = useUserSession()

    const handleStorageChange = async (e: StorageEvent) => {
      if (e.key === "nuxt-session" && !e.newValue && loggedIn.value) {
        await navigateTo("/")
      }
    }

    watch(loggedIn, (isLoggedIn) => {
      if (sessionCheckInterval) {
        clearInterval(sessionCheckInterval)
        sessionCheckInterval = null
      }
      if (isLoggedIn) {
        sessionCheckInterval = setInterval(async () => {
          try {
            await $fetch("/api/auth/validate", { method: "POST", credentials: "include" })
          }
          catch (err: unknown) {
            if (err && typeof err === "object" && "statusCode" in err && err.statusCode === 401) {
              await signOut()
            }
          }
        }, 5 * 60 * 1000) // 5 minutes
      }
    }, { immediate: true })

    globalThis.addEventListener("storage", handleStorageChange)
  }

  return { signIn, signOut }
}
