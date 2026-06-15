import { userBannerSchema } from "#shared/schemas/user-schema"

export default defineEventHandler(async (event) => {
  const sessionUser = await getUserFromSession(event)

  await enforceRateLimit(event, `user:banner:${sessionUser.id}`, 10)

  const body = await readBody(event)
  const result = userBannerSchema.safeParse(body)
  if (!result.success) {
    throw createError({ status: 400, statusText: result.error.issues[0]?.message || "Invalid input" })
  }

  const { url, assetId } = result.data
  if (assetId) {
    const asset = await db.userAsset.findUnique({ where: { id: assetId }, select: { userId: true } })
    if (!asset || asset.userId !== sessionUser.id) {
      throw createError({ status: 403, statusText: "Asset does not belong to this user" })
    }
  }

  const banner = await db.userBanner.upsert({
    where: { userId: sessionUser.id },
    create: { userId: sessionUser.id, url, assetId },
    update: { url, assetId },
  })

  await deleteCached(CacheKeys.userProfile(sessionUser.slug))

  return { banner }
})
