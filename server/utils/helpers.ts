import type { EventHandlerRequest, H3Event } from "h3"
import crypto from "node:crypto"

/**
 * Ensure required environment variables are set, throwing an error if missing.
 */
export function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

/**
 * Retrieves the authenticated user from the current session.
 * Throws 401 if no valid session exists.
 */
export async function getUserFromSession(event: H3Event<EventHandlerRequest>): Promise<User> {
  const session = await getUserSession(event)
  if (session?.user?.id) {
    const { id, email, name, image, slug } = session.user
    return { id, email, name, image: image ?? "", slug }
  }

  throw createError({ statusCode: 401, statusMessage: "Unauthorized" })
}

/**
 * Generates a unique slug based on the provided base string.
 */
export async function generateSlug(base: string = ""): Promise<string> {
  const cleaned = base.normalize("NFKD").replace(/[\u0300-\u036F]/g, "").toLowerCase().replace(/[^\w-]/g, "").replace(/[-\s]+/g, "-").replace(/^-+|-+$/g, "")
  for (let attempt = 0; attempt < 10; attempt++) {
    const suffix = crypto.randomUUID().slice(0, 6)
    const slug = cleaned ? `${cleaned}-${suffix}` : suffix
    const exists = await db.user.findUnique({ where: { slug }, select: { id: true } })
    if (!exists) {
      return slug
    }
  }

  return crypto.randomUUID().replace(/-/g, "").slice(0, 12)
}

/**
 * Categorizes a referrer URL or simple ref tag into a known source type.
 * Returns 'direct' if no referrer, or a specific platform/source name.
 */
export function categorizeReferrer(referrer: string | null | undefined): string {
  if (!referrer || typeof referrer !== "string" || referrer.trim() === "") {
    return "direct"
  }

  const normalized = referrer.toLowerCase().trim()
  if (!normalized.includes(".") && !normalized.includes("://") && !normalized.includes("/")) {
    return normalized
  }
  const baseUrl = process.env.NUXT_PUBLIC_BASE_URL?.toLowerCase()
  if (baseUrl && normalized.includes(baseUrl)) {
    return "direct"
  }

  const sources: [string[], string][] = [
    [["facebook.com", "fb.com", "fb.me", "fbcdn.net"], "facebook"],
    [["twitter.com", "x.com", "t.co"], "twitter"],
    [["instagram.com", "ig.me"], "instagram"],
    [["linkedin.com", "lnkd.in"], "linkedin"],
    [["reddit.com", "redd.it"], "reddit"],
    [["tiktok.com"], "tiktok"],
    [["pinterest.com", "pin.it"], "pinterest"],
    [["youtube.com", "youtu.be"], "youtube"],
    [["whatsapp.com", "wa.me"], "whatsapp"],
    [["telegram.org", "t.me"], "telegram"],
    [["discord.com", "discord.gg"], "discord"],
    [["mastodon"], "mastodon"],
    [["bluesky.social", "bsky.app"], "bluesky"],
    [["google."], "google"],
    [["bing.com", "bing."], "bing"],
    [["yahoo.com", "yahoo."], "yahoo"],
    [["duckduckgo.com"], "duckduckgo"],
    [["yandex.com", "yandex.ru", "yandex."], "yandex"],
    [["slack.com"], "slack"],
    [["teams.microsoft.com"], "teams"],
    [["github.com"], "github"],
    [["gitlab.com"], "gitlab"],
    [["medium.com"], "medium"],
    [["substack.com"], "substack"],
  ]
  for (const [patterns, name] of sources) {
    if (patterns.some(pattern => normalized.includes(pattern))) {
      return name
    }
  }

  return "unknown"
}
