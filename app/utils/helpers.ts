/**
 * Returns a formatted date string or a placeholder if the date is null/undefined.
 */
export function formatDate(date?: string | Date | null): string {
  if (!date) {
    return "-"
  }

  const dt = typeof date === "string" ? new Date(date) : date
  const formatted = dt.toLocaleDateString("en-US", { year: "2-digit", month: "short", day: "numeric" })
  return `${formatted.charAt(0).toLowerCase() + formatted.slice(1)}, ${dt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`
}

/**
 * Formats a Date/ISO string for `<input type="datetime-local">` using local time.
 */
export function toDatetimeLocalValue(value: string | Date | null | undefined): string {
  if (!value) {
    return ""
  }

  const date = typeof value === "string" ? new Date(value) : value
  if (Number.isNaN(date.getTime())) {
    return ""
  }

  const pad = (part: number) => String(part).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/**
 * Parses a `datetime-local` value as local time and returns an ISO UTC string.
 */
export function fromDatetimeLocalValue(value: string): string | null {
  if (!value) {
    return null
  }

  const [datePart, timePart] = value.split("T")
  if (!datePart || !timePart) {
    return null
  }

  const [year, month, day] = datePart.split("-").map(Number)
  const [hours, minutes] = timePart.split(":").map(Number)
  if ([year, month, day, hours, minutes].some(Number.isNaN)) {
    return null
  }

  const date = new Date(year!, month! - 1, day!, hours!, minutes!)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date.toISOString()
}

/**
 * Formats a source string into a human-readable label.
 */
export function formatSourceLabel(source: string | null | undefined): string {
  if (!source || typeof source !== "string" || source.trim() === "") {
    return "Unknown"
  }

  const labels: Record<string, string> = {
    direct: "Direct",
    facebook: "Facebook",
    twitter: "Twitter/X",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    reddit: "Reddit",
    tiktok: "TikTok",
    youtube: "YouTube",
    pinterest: "Pinterest",
    whatsapp: "WhatsApp",
    telegram: "Telegram",
    discord: "Discord",
    mastodon: "Mastodon",
    bluesky: "Bluesky",
    google: "Google",
    bing: "Bing",
    yahoo: "Yahoo",
    duckduckgo: "DuckDuckGo",
    yandex: "Yandex",
    slack: "Slack",
    teams: "Microsoft Teams",
    github: "GitHub",
    gitlab: "GitLab",
    medium: "Medium",
    substack: "Substack",
    email: "Email",
    newsletter: "Newsletter",
    unknown: "Unknown",
  }

  return labels[source] || source.charAt(0).toUpperCase() + source.slice(1)
}

/**
 * Extracts the error message from various error formats (Nuxt/H3/Zod).
 */
export function getErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === "object") {
    const e = err as {
      data?: { statusMessage?: string, message?: string, issues?: Array<{ message: string }> }
      statusMessage?: string
      message?: string
    }
    if (e.data?.issues?.length) {
      return e.data.issues.map(i => i.message).join(", ")
    }

    return e.data?.statusMessage || e.data?.message || e.statusMessage || e.message || fallback
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
