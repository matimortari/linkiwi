/**
 * Returns a formatted date string or a placeholder if the date is null/undefined.
 */
export function formatDate(date?: string | Date | null): string {
  if (!date) {
    return "-"
  }

  const dt = typeof date === "string" ? new Date(date) : date
  const formatted = dt.toLocaleDateString("en-US", { year: "2-digit", month: "short", day: "numeric" })
  return formatted.charAt(0).toLowerCase() + formatted.slice(1)
}

/**
 * Extracts the error message from various error formats (Nuxt/H3/Zod).
 */
export function getErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === "object") {
    const e = err as { data?: { statusMessage?: string, message?: string }, statusMessage?: string, message?: string }
    return (e.data?.statusMessage || e.data?.message || e.statusMessage || e.message || fallback)
  }

  return fallback
}

/**
 * Signs in the user by redirecting to the provider's authentication endpoint.
 */
export function signIn(provider: string) {
  navigateTo(`/api/auth/${provider}`, { external: true })
}

/**
  Signs out the current user by calling the logout endpoint and clearing the session.
 */
export async function signOut() {
  const { clear } = useUserSession()

  await $fetch("/api/auth/logout", { method: "POST", credentials: "include" })
  await clear()
  await navigateTo("/")
}
