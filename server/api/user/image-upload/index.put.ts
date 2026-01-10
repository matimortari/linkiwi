import db from "#server/lib/db"
import { getUserFromSession, uploadFile } from "#server/lib/utils"

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)
  const form = await readFormData(event)
  const file = form.get("file")
  if (!file || !(file instanceof File)) {
    throw createError({ statusCode: 400, statusMessage: "No file uploaded" })
  }

  const imageUrl = await uploadFile({
    path: `alllinks-user-uploads/avatar/${user.id}`,
    file,
    maxSize: 2 * 1024 * 1024, // 2 MB
    allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"],
    oldFileUrl: user.image ?? undefined,
  })

  await db.user.update({
    where: { id: user.id },
    data: { image: imageUrl },
  })

  return { imageUrl }
})
