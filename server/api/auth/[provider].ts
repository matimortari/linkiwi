import type { EventHandlerRequest, H3Event } from "h3"

function getOAuthConfig(provider: string) {
  const baseUrl = requireEnv("NUXT_PUBLIC_BASE_URL")
  if (provider === "google") {
    return {
      clientId: requireEnv("NUXT_OAUTH_GOOGLE_CLIENT_ID"),
      clientSecret: requireEnv("NUXT_OAUTH_GOOGLE_CLIENT_SECRET"),
      redirectURL: `${baseUrl}/api/auth/google`,
    }
  }
  if (provider === "github") {
    return {
      emailRequired: true,
      clientId: requireEnv("NUXT_OAUTH_GITHUB_CLIENT_ID"),
      clientSecret: requireEnv("NUXT_OAUTH_GITHUB_CLIENT_SECRET"),
      redirectURL: `${baseUrl}/api/auth/github`,
    }
  }

  return null
}

const extractUserData: Record<string, (user: any) => any> = {
  google: user => ({ id: user.id?.toString() || user.sub?.toString(), name: user.name || user.given_name, email: user.email, image: user.picture }),
  github: user => ({ id: user.id?.toString(), name: user.name, email: user.email, image: user.avatar_url }),
}

export default defineEventHandler(async (event: H3Event) => {
  // Rate limit: 5 requests per minute per IP
  const ip = getRequestIP(event, { xForwardedFor: true }) || "unknown"
  await enforceRateLimit(event, `auth:${ip}`, 5, 60 * 1000)

  const provider = event.context.params?.provider
  if (!provider) {
    throw createError({ status: 400, message: "Unknown OAuth provider" })
  }

  const config = getOAuthConfig(provider)
  if (!config) {
    throw createError({ status: 400, message: "Unknown OAuth provider" })
  }

  try {
    const oauthHandler = { google: defineOAuthGoogleEventHandler, github: defineOAuthGitHubEventHandler }[provider]
    if (!oauthHandler) {
      throw createError({ status: 400, message: `OAuth handler not found for provider: ${provider}` })
    }

    return await oauthHandler({ config, async onSuccess(event: H3Event<EventHandlerRequest>, { user }: any) {
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
  catch (err: unknown) {
    throw createError({ status: 500, message: "OAuth processing failed", data: { provider, error: err instanceof Error ? err.message : String(err) } })
  }
})
