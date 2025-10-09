import type { H3Event } from "h3"
import { handleOAuthUser } from "#server/lib/auth"

export default defineOAuthGitHubEventHandler({
  config: {
    emailRequired: true,
    clientId: process.env.NUXT_OAUTH_GITHUB_CLIENT_ID,
    clientSecret: process.env.NUXT_OAUTH_GITHUB_CLIENT_SECRET,
    redirectURL: `${process.env.NUXT_PUBLIC_BASE_URL}/api/auth/github`,
  },

  async onSuccess(event: any, { user }: any) {
    if (!user || typeof user !== "object") {
      throw createError({ statusCode: 400, message: "Invalid user data received from GitHub" })
    }

    const githubId = user.id?.toString()
    const email = user.email
    const name = user.name
    const picture = user.avatar_url

    if (!githubId || !email) {
      throw createError({ statusCode: 400, message: "Missing required user data from GitHub" })
    }

    return handleOAuthUser(event, {
      id: githubId,
      name,
      email,
      image: picture,
      provider: "github",
    })
  },
  async onError(event: H3Event, err: any) {
    console.error("GitHub OAuth error:", err)
    if (!event || !event.node?.res) {
      throw createError({ statusCode: 500, message: "Internal server error" })
    }

    return sendRedirect(event, "/sign-in?error=github_oauth_failed")
  },
})
