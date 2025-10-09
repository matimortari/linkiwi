import type { H3Event } from "h3"
import db from "#server/lib/db"
import { generateSlug } from "#server/lib/utils"

interface OAuthUserData {
  id: string
  name: string | null
  email: string
  image: string | null
  provider: "google" | "github"
}

export async function handleOAuthUser(event: H3Event, userData: OAuthUserData) {
  const { id: providerAccountId, name, email, image, provider } = userData

  // Find existing account by provider
  let account = await db.account.findUnique({
    where: { provider_providerAccountId: { provider, providerAccountId } },
    include: { user: true },
  })

  let user: {
    id: string
    email: string
    name: string
    image?: string | null
    slug: string
    description: string | null
    createdAt: Date
    updatedAt: Date
    preferences?: any
    links?: any[]
    icons?: any[]
    views?: any[]
  } | undefined = account?.user

  // If no account, try to find existing user by email
  user = await db.user.findUnique({ where: { email } }) ?? undefined

  // If still no user, create one
  if (!user) {
    user = await db.user.create({
      data: {
        email,
        name: name?.trim() || email.split("@")[0],
        image: image ?? undefined,
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
      },
    })
  }

  // Link provider account
  account = await db.account.upsert({
    where: { provider_providerAccountId: { provider, providerAccountId } },
    update: {},
    create: { userId: user.id, provider, providerAccountId },
    include: { user: true },
  })
  user = account.user

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
  }

  await setUserSession(event, { user: sessionUser, loggedInAt: new Date() })

  return sendRedirect(event, "/admin/profile")
}
