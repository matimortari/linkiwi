import type { H3Event } from "h3"
import { handleOAuthUser } from "#server/lib/auth"

export default defineOAuthGoogleEventHandler({
  config: {
    emailRequired: true,
    clientId: process.env.NUXT_OAUTH_GOOGLE_CLIENT_ID,
    clientSecret: process.env.NUXT_OAUTH_GOOGLE_CLIENT_SECRET,
    redirectURL: `${process.env.NUXT_PUBLIC_BASE_URL}/api/auth/google`,
  },

  async onSuccess(event: any, { user }: any) {
    if (!user || typeof user !== "object") {
      throw createError({ statusCode: 400, message: "Invalid user data received from Google" })
    }

    const googleId = user.id?.toString() || user.sub?.toString()
    const email = user.email
    const name = user.name || user.given_name
    const picture = user.picture

    if (!googleId || !email) {
      throw createError({ statusCode: 400, message: "Missing required user data from Google" })
    }

    return handleOAuthUser(event, {
      id: googleId,
      name,
      email,
      image: picture,
      provider: "google",
    })
  },
  async onError(event: H3Event, err: any) {
    console.error("Google OAuth error:", err)
    if (!event || !event.node?.res) {
      throw createError({ statusCode: 500, message: "Internal server error" })
    }

    return sendRedirect(event, "/sign-in?error=google_oauth_failed")
  },
})
