import type { EventHandlerRequest, H3Event } from "h3"
import { handleOAuthUser } from "#server/utils/auth"

const configs: Record<string, any> = {
  google: {
    clientId: process.env.NUXT_OAUTH_GOOGLE_CLIENT_ID,
    clientSecret: process.env.NUXT_OAUTH_GOOGLE_CLIENT_SECRET,
    redirectURL: `${process.env.NUXT_PUBLIC_BASE_URL}/api/auth/google`,
  },
  github: {
    emailRequired: true,
    clientId: process.env.NUXT_OAUTH_GITHUB_CLIENT_ID,
    clientSecret: process.env.NUXT_OAUTH_GITHUB_CLIENT_SECRET,
    redirectURL: `${process.env.NUXT_PUBLIC_BASE_URL}/api/auth/github`,
  },
}

const extractUserData: Record<string, (user: any) => any> = {
  google: user => ({
    id: user.id?.toString() || user.sub?.toString(),
    name: user.name || user.given_name,
    email: user.email,
    image: user.picture,
  }),
  github: user => ({
    id: user.id?.toString(),
    name: user.name,
    email: user.email,
    image: user.avatar_url,
  }),
}

export default defineEventHandler(async (event: H3Event) => {
  const provider = event.context.params?.provider
  if (!provider || !configs[provider]) {
    throw createError({ status: 400, message: "Unknown OAuth provider" })
  }

  try {
    const oauthHandler = { google: defineOAuthGoogleEventHandler, github: defineOAuthGitHubEventHandler }[provider]
    if (!oauthHandler) {
      throw createError({ status: 400, message: `OAuth handler not found for provider: ${provider}` })
    }

    return await oauthHandler({ config: configs[provider], async onSuccess(event: H3Event<EventHandlerRequest>, { user }: any) {
      if (!user || typeof user !== "object") {
        throw createError({ status: 400, message: `Invalid user data from ${provider}` })
      }

      const extractor = extractUserData[provider]
      if (!extractor) {
        throw createError({ status: 400, message: `User data extractor not found for provider: ${provider}` })
      }

      const userData = extractor(user)
      if (!userData.id || !userData.email) {
        throw createError({ status: 400, message: `Missing required user data from ${provider}` })
      }

      return handleOAuthUser(event, { ...userData, provider })
    }, async onError(event: H3Event<EventHandlerRequest>) {
      return sendRedirect(event, `/sign-in?error=${provider}_oauth_failed`)
    } })(event)
  }
  catch (err: any) {
    throw createError({ status: 500, message: "OAuth processing failed", data: { provider, error: err instanceof Error ? err.message : String(err) } })
  }
})
