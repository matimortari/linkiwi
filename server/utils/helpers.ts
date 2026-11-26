import type { EventHandlerRequest, H3Event } from "h3"
import { randomBytes, randomUUID } from "node:crypto"

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
    const validSession = await assertValidUserSession(event, session)
    const { id, email, name, image, slug } = validSession.user
    return { id, email, name, image: image ?? "", slug }
  }

  throw createError({ statusCode: 401, statusMessage: "Unauthorized" })
}

/**
 * Generates a secure random token as a hexadecimal string.
 * Default length is 12 bytes (24 hex characters).
 */
export function generateToken(byteLength: number = 12): string {
  return randomBytes(byteLength).toString("hex")
}

/**
 * Generates a unique slug based on the provided base string.
 * Falls back to a random slug when the base has no Latin alphanumeric characters.
 */
export async function generateSlug(base: string = ""): Promise<string> {
  let cleaned = base.normalize("NFKD").replace(/[\u0300-\u036F]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-")
  let start = 0
  let end = cleaned.length
  while (start < end && cleaned[start] === "-") {
    start++
  }
  while (end > start && cleaned[end - 1] === "-") {
    end--
  }

  cleaned = cleaned.slice(start, end).substring(0, 50)
  if (!cleaned) {
    return randomUUID().replaceAll("-", "").slice(0, 12)
  }

  for (let attempt = 0; attempt < 10; attempt++) {
    const RESERVED_SLUGS = new Set(["admin", "api", "brand", "legal", "sign-in"])
    const canUseBare = attempt === 0 && cleaned.length >= 3 && !RESERVED_SLUGS.has(cleaned)
    const slug = canUseBare ? cleaned : `${cleaned.slice(0, 43)}-${randomUUID().slice(0, 6)}`
    if (slug.length < 3 || RESERVED_SLUGS.has(slug)) {
      continue
    }

    const exists = await db.user.findUnique({ where: { slug }, select: { id: true } })
    if (!exists) {
      return slug
    }
  }

  return randomUUID().replaceAll("-", "").slice(0, 12)
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

  const url = normalized.includes("://") ? normalized : `https://${normalized}`
  if (!URL.canParse(url)) {
    return "unknown"
  }

  const host = new URL(url).hostname.replace(/^www\./, "")
  if (host === new URL(requireEnv("NUXT_PUBLIC_BASE_URL")).hostname.replace(/^www\./, "")) {
    return "direct"
  }

  const sources: { name: string, domains?: string[], hostLabels?: string[] }[] = [
    { name: "facebook", domains: ["facebook.com", "fb.com", "fb.me", "fbcdn.net"] },
    { name: "twitter", domains: ["twitter.com", "x.com", "t.co"] },
    { name: "instagram", domains: ["instagram.com", "ig.me"] },
    { name: "linkedin", domains: ["linkedin.com", "lnkd.in"] },
    { name: "reddit", domains: ["reddit.com", "redd.it"] },
    { name: "tiktok", domains: ["tiktok.com"] },
    { name: "pinterest", domains: ["pinterest.com", "pin.it"] },
    { name: "youtube", domains: ["youtube.com", "youtu.be"] },
    { name: "whatsapp", domains: ["whatsapp.com", "wa.me"] },
    { name: "telegram", domains: ["telegram.org", "t.me"] },
    { name: "discord", domains: ["discord.com", "discord.gg"] },
    { name: "mastodon", hostLabels: ["mastodon"] },
    { name: "bluesky", domains: ["bluesky.social", "bsky.app"] },
    { name: "google", hostLabels: ["google"] },
    { name: "bing", hostLabels: ["bing"] },
    { name: "yahoo", hostLabels: ["yahoo"] },
    { name: "duckduckgo", domains: ["duckduckgo.com"] },
    { name: "yandex", hostLabels: ["yandex"] },
    { name: "slack", domains: ["slack.com"] },
    { name: "teams", domains: ["teams.microsoft.com", "teams.live.com"] },
    { name: "github", domains: ["github.com"] },
    { name: "gitlab", domains: ["gitlab.com"] },
    { name: "medium", domains: ["medium.com"] },
    { name: "substack", domains: ["substack.com"] },
  ]

  const source = sources.find(({ domains = [], hostLabels = [] }) => domains.some(domain => host === domain || host.endsWith(`.${domain}`)) || hostLabels.some(label => host.split(".").includes(label)))
  return source?.name ?? "unknown"
}

/**
 * Resolves photo grid entries to owned user assets, rewriting urls/order from the DB.
 * Throws 400 if any selected asset is missing or not owned by the user.
 */
export async function resolvePhotoGrid(photos: { assetId?: string | null, url: string, order: number, alt?: string | null }[], userId: string) {
  const assetIds = [...new Set(photos.map(photo => photo.assetId).filter((id): id is string => !!id))]
  if (!assetIds.length) {
    throw createError({ statusCode: 400, statusMessage: "Each photo must reference a valid uploaded asset" })
  }

  const assets = await db.userAsset.findMany({ where: { id: { in: assetIds }, userId }, select: { id: true, url: true } })
  const assetMap = new Map(assets.map(asset => [asset.id, asset]))

  const resolved = photos.filter(photo => photo.assetId && assetMap.has(photo.assetId)).map((photo, order) => {
    const asset = assetMap.get(photo.assetId!)!
    return { assetId: asset.id, url: asset.url, order, alt: photo.alt ?? null }
  })
  if (!resolved.length) {
    throw createError({ statusCode: 400, statusMessage: "None of the selected photos are available. Re-select from your library." })
  }
  if (resolved.length !== photos.length) {
    throw createError({ statusCode: 400, statusMessage: "One or more selected photos no longer exist. Re-select from your library." })
  }

  return resolved
}
