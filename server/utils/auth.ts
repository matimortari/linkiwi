import type { H3Event } from "h3"
import db from "#server/utils/db"
import { generateSlug } from "#server/utils/helpers"

export async function handleOAuthUser(event: H3Event, userData: OAuthUserData) {
  const { id: providerAccountId, name, email, image, provider } = userData

  // Find existing account by provider
  let account = await db.account.findUnique({
    where: { provider_providerAccountId: { provider, providerAccountId } },
    include: { user: true },
  })

  let user: any = account?.user ?? null
  if (!user) {
    user = await db.user.findUnique({
      where: { email },
      include: {
        preferences: true,
        links: true,
        icons: true,
        views: true,
        comments: true,
      },
    })
  }

  // If still no user, create one
  if (!user) {
    user = await db.user.create({
      data: {
        email,
        name: name?.trim() ?? email.split("@")[0],
        image: image || undefined,
        slug: await generateSlug(name ?? email.split("@")[0]),
        preferences: {
          create: {},
        },
      },
      include: {
        preferences: true,
        links: true,
        icons: true,
        views: true,
        comments: true,
      },
    })
  }

  // Upsert account
  account = await db.account.upsert({
    where: { provider_providerAccountId: { provider, providerAccountId } },
    update: {},
    create: { userId: user.id, provider, providerAccountId },
    include: { user: true },
  })

  user = account.user

  // Build session object
  const sessionUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image ?? null,
    slug: user.slug,
    preferences: user.preferences ?? {},
    links: user.links ?? [],
    icons: user.icons ?? [],
    views: user.views ?? [],
    comments: user.comments ?? [],
  }

  const now = new Date()
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days

  await setUserSession(event, {
    user: sessionUser,
    loggedInAt: now,
    expiresAt,
    lastActivityAt: now,
  })

  return sendRedirect(event, "/admin/profile")
}
