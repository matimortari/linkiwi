import db from "#server/utils/db"
import { getUserFromSession, uploadFile } from "#server/utils/helpers"

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)
  const form = await readFormData(event)
  const file = form.get("file")
  if (!file || !(file instanceof File)) {
    throw createError({ status: 400, statusText: "No file uploaded" })
  }

  const currentUser = await db.user.findUnique({ where: { id: user.id }, select: { image: true } })

  const imageUrl = await uploadFile({
    path: `alllinks/user-avatars/${user.id}`,
    file,
    maxSize: 2 * 1024 * 1024, // 2 MB
    allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"],
    oldFile: currentUser?.image ?? undefined,
  })

  await db.user.update({ where: { id: user.id }, data: { image: imageUrl } })

  return { imageUrl }
})
