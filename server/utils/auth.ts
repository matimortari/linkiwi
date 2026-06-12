import type { H3Event } from "h3"

export async function handleOAuthUser(event: H3Event, userData: OAuthUserData) {
  const { id: providerAccountId, name, email, image, provider } = userData
  const r2PublicUrl = requireEnv("R2_PUBLIC_URL")
  const defaultAvatar = `${r2PublicUrl}/defaults/avatar.png`

  const account = await db.account.findUnique({
    where: { provider_providerAccountId: { provider, providerAccountId } },
    select: { user: { select: { id: true, email: true, name: true, image: true, slug: true } } },
  })

  let sessionUser: User | null = account?.user ? { ...account.user, image: account.user.image ?? defaultAvatar } : null
  if (!sessionUser) {
    const existingUser = await db.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, image: true, slug: true },
    })
    if (existingUser) {
      await db.account.create({ data: { userId: existingUser.id, provider, providerAccountId } })
      sessionUser = { ...existingUser, image: existingUser.image ?? defaultAvatar }
    }
    else {
      const slug = await generateSlug(name ?? email.split("@")[0]!)
      const newUser = await db.user.create({
        data: {
          email,
          name: name?.trim() ?? email.split("@")[0]!,
          image: image ?? defaultAvatar,
          slug,
          preferences: { create: {} },
          accounts: { create: { provider, providerAccountId } },
        },
        select: { id: true, email: true, name: true, image: true, slug: true },
      })
      sessionUser = { ...newUser, image: newUser.image ?? defaultAvatar }
    }
  }

  const now = new Date()
  await setUserSession(event, {
    user: sessionUser,
    loggedInAt: now,
    expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
    lastActivityAt: now,
  })

  return sendRedirect(event, "/admin/profile")
}
