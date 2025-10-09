import db from "#server/lib/db"
import { getUserFromSession } from "#server/lib/utils"
import { del, put } from "@vercel/blob"

export default defineEventHandler(async (event) => {
  const sessionUser = await getUserFromSession(event)
  const form = await readFormData(event)
  const file = form.get("file")
  if (!file || !(file instanceof File)) {
    throw createError({ statusCode: 400, statusMessage: "No file uploaded" })
  }

  const user = await db.user.findUnique({
    where: { id: sessionUser.id },
  })
  if (!user) {
    throw createError({ statusCode: 404, statusMessage: "User not found" })
  }

  // Validate file type
  const allowedMimeTypes = ["image/png", "image/jpeg", "image/webp"]
  if (!allowedMimeTypes.includes(file.type)) {
    throw createError({
      statusCode: 415,
      statusMessage: `Unsupported file type: ${file.type}`,
    })
  }

  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw createError({ statusCode: 413, statusMessage: "File too large" })
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
  const timestamp = Date.now()
  const blob = await put(`linknest-user-uploads/avatar/${user.id}/${timestamp}.${ext}`, file, { access: "public" })
  if (user.image && user.image.includes("blob.vercel-storage.com")) {
    try {
      await del(user.image)
    }
    catch (error) {
      console.error("Failed to delete old avatar:", error)
    }
  }

  await db.user.update({
    where: { id: user.id },
    data: { image: blob.url },
  })

  return {
    imageUrl: blob.url,
  }
})
