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
 * Converts a string to a slug. Used for headings in content pages.
 */
export function slugify(text: string): string {
  return text.toString().toLowerCase().trim().replace(/\W+/g, "-")
}

/**
 * Extracts the error message from various error formats (Nuxt/H3/Zod).
 */
export function getErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === "object") {
    const e = err as {
      data?: { statusText?: string, message?: string, issues?: Array<{ message: string }> }
      statusText?: string
      message?: string
    }
    if (e.data?.issues?.length) {
      return e.data.issues.map(i => i.message).join(", ")
    }

    return e.data?.statusText || e.data?.message || e.statusText || e.message || fallback
  }

  return fallback
}
