import type { EventHandlerRequest, H3Event } from "h3"
import db from "#server/utils/db"
import { del, put } from "@vercel/blob"

/**
 * Retrieves the authenticated user from the current session.
 * Throws 401 if no valid session exists.
 */
export async function getUserFromSession(event: H3Event<EventHandlerRequest>) {
  const session = await getUserSession(event)
  if (!session?.user?.id) {
    throw createError({ status: 401, statusText: "Unauthorized" })
  }

  return session.user
}

/**
 * Generates a unique slug based on the provided base string.
 */
export async function generateSlug(base: string = ""): Promise<string> {
  const cleanedBase = base.normalize("NFKD").replace(/[\u0300-\u036F]/g, "").toLowerCase().replace(/[^\w-]/g, "").replace(/[-\s]+/g, "-").replace(/^-+|-+$/g, "")
  for (let attempt = 0; attempt < 5; attempt++) {
    const randomString = Math.random().toString(36).slice(2, 8)
    const slug = cleanedBase ? `${cleanedBase}-${randomString}` : randomString
    const existingUser = await db.user.findUnique({ where: { slug } })
    if (!existingUser) {
      return slug
    }
  }

  return Math.random().toString(36).slice(2, 8)
}

/**
 * Categorizes a referrer URL into a known source type.
 * Returns 'direct' if no referrer, or a specific platform/source name.
 */
export function categorizeReferrer(referrer: string | null | undefined): string {
  if (!referrer || typeof referrer !== "string" || referrer.trim() === "") {
    return "direct"
  }

  if (referrer.toLowerCase().trim().includes(process.env.NUXT_PUBLIC_BASE_URL?.toLowerCase() || "")) {
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
    if (patterns.some(pattern => referrer.toLowerCase().trim().includes(pattern))) {
      return name
    }
  }

  return "unknown"
}

/**
 * Formats a source string into a human-readable label.
 */
export function formatSourceLabel(source: string | null | undefined): string {
  if (!source || typeof source !== "string" || source.trim() === "") {
    return "Unknown"
  }

  const normalizedSource = source.toLowerCase().trim()
  const labels: Record<string, string> = {
    direct: "Direct",
    facebook: "Facebook",
    twitter: "X",
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
    unknown: "Unknown",
  }

  return labels[normalizedSource] || normalizedSource.charAt(0).toUpperCase() + normalizedSource.slice(1)
}

/**
 * Uploads a file to Blob storage and removes the previous file if provided.
 * Validates file size and MIME type before upload.
 */
export async function uploadFile({ path, file, maxSize, allowedMimeTypes, oldFile }: { path: string, file: File, maxSize: number, allowedMimeTypes: string[], oldFile?: string }) {
  if (!file || !(file instanceof File)) {
    throw createError({ status: 400, statusText: "No file uploaded" })
  }
  if (allowedMimeTypes.length && !allowedMimeTypes.includes(file.type)) {
    throw createError({ status: 415, statusText: `Unsupported file type: ${file.type}` })
  }
  if (file.size > maxSize) {
    throw createError({ status: 413, statusText: "File too large" })
  }

  const blob = await put(`${path}/${Date.now()}.${file.name.split(".").pop()?.toLowerCase()}`, file, { access: "public" })
  if (oldFile?.includes("blob.vercel-storage.com")) {
    await del(oldFile).catch(() => {})
  }

  return blob.url
}
