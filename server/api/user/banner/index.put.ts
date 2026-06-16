import { userBannerSchema } from "#shared/schemas/user-schema"

export default defineEventHandler(async (event) => {
  const sessionUser = await getUserFromSession(event)

  await enforceRateLimit(event, `user:banner:${sessionUser.id}`, 10)

  const body = await readBody(event)
  const result = userBannerSchema.safeParse(body)
  if (!result.success) {
    throw createError({ status: 400, statusText: result.error.issues[0]?.message || "Invalid input" })
  }

  if (result.data.assetId) {
    const asset = await db.userAsset.findUnique({ where: { id: result.data.assetId }, select: { userId: true } })
    if (!asset || asset.userId !== sessionUser.id) {
      throw createError({ status: 403, statusText: "Asset does not belong to this user" })
    }
  }

  const banner = await db.userBanner.upsert({
    where: { userId: sessionUser.id },
    create: { userId: sessionUser.id, url: result.data.url, assetId: result.data.assetId },
    update: { url: result.data.url, assetId: result.data.assetId },
  })

  await deleteCached(CacheKeys.userProfile(sessionUser.slug))

  return { banner }
})
