/**
 * Returns a formatted date string or a placeholder if the date is null/undefined.
 */
export function formatDate(date?: string | Date | null): string {
  if (!date) {
    return "-"
  }

  const dt = typeof date === "string" ? new Date(date) : date
  const formatted = dt.toLocaleDateString("en-US", {
    year: "2-digit",
    month: "short",
    day: "numeric",
  })

  return formatted.charAt(0).toLowerCase() + formatted.slice(1)
}

/**
 * Copies the provided string value to the clipboard.
 */
export function copyToClipboard(val: string) {
  if (val) {
    navigator.clipboard.writeText(val)
  }
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
