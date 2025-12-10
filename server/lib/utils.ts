import type { EventHandlerRequest, H3Event } from "h3"
import db from "#server/lib/db"
import { del, put } from "@vercel/blob"

/**
 * Retrieves the authenticated user from the current session.
 * Throws 401 if no valid session exists.
 */
export async function getUserFromSession(event: H3Event<EventHandlerRequest>) {
  const session = await getUserSession(event)
  if (!session?.user?.id) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" })
  }

  return session.user
}

/**
 * Generates a unique slug based on the provided base string.
 */
export async function generateSlug(base: string = ""): Promise<string> {
  const cleanedBase = base
    .normalize("NFKD")
    .replaceAll(/[\u0300-\u036F]/g, "") // Remove diacritics
    .toLowerCase()
    .replaceAll(/\s+/g, "-") // Replace one or more whitespace with hyphen
    .replaceAll(/[^a-z0-9-]/g, "") // Remove invalid characters
    .replaceAll(/-+/g, "-") // Collapse multiple hyphens
    .replaceAll(/^(-+)|(-+)$/g, "") // Trim leading/trailing hyphens

  let slug: string
  let exists = true
  let attempt = 0

  while (exists && attempt < 5) {
    const randomString = Math.random().toString(36).slice(2, 8)
    slug = `${cleanedBase}-${randomString}`
    const existingUser = await db.user.findUnique({ where: { slug } })
    exists = !!existingUser
    attempt++
  }

  return slug!
}

/**
 * Uploads a file to Blob storage and removes the previous file if provided.
 * Validates file size and MIME type before upload.
 */
export async function uploadFile({ path, file, maxSize, allowedMimeTypes, oldFileUrl }: {
  path: string
  file: File
  maxSize: number
  allowedMimeTypes: string[]
  oldFileUrl?: string
}) {
  if (!file || !(file instanceof File)) {
    throw createError({ statusCode: 400, statusMessage: "No file uploaded" })
  }
  if (allowedMimeTypes.length && !allowedMimeTypes.includes(file.type)) {
    throw createError({ statusCode: 415, statusMessage: `Unsupported file type: ${file.type}` })
  }
  if (file.size > maxSize) {
    throw createError({ statusCode: 413, statusMessage: "File too large" })
  }

  const ext = file.name.split(".").pop()?.toLowerCase()
  const blob = await put(`${path}/${Date.now()}.${ext}`, file, { access: "public" })
  if (oldFileUrl?.includes("blob.vercel-storage.com")) {
    await del(oldFileUrl).catch(err => console.error("Failed to delete old file:", err))
  }

  return blob.url
}
