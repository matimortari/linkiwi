import type { EventHandlerRequest, H3Event } from "h3"
import type { RequestEvent } from "nuxt/server"
import { sendRedirect as redirectOAuthError } from "nuxt/server"

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

const extractUserData: Record<string, (user: any) => Omit<OAuthUserData, "provider">> = {
  google: user => ({
    id: user.id?.toString() || user.sub?.toString(),
    name: user.name || user.given_name,
    email: user.email,
    emailVerified: user.email_verified === true,
    image: user.picture ?? null,
  }),
  github: user => ({
    id: user.id?.toString(),
    name: user.name,
    email: user.email,
    emailVerified: user.email_verified !== false,
    image: user.avatar_url ?? null,
  }),
}

export default defineEventHandler(async (event: H3Event) => {
  // Rate limit: 5 requests per minute per IP
  const ip = getRequestIP(event, { xForwardedFor: true }) || "unknown"
  await enforceRateLimit(event, `auth:${ip}`, 5, 60 * 1000)

  const provider = event.context.params?.provider
  const config = provider ? getOAuthConfig(provider) : null
  if (!provider || !config) {
    throw createError({ statusCode: 400, statusMessage: "Unknown OAuth provider" })
  }

  try {
    const oauthHandler = { google: defineOAuthGoogleEventHandler, github: defineOAuthGitHubEventHandler }[provider]
    if (!oauthHandler) {
      throw createError({ statusCode: 400, statusMessage: `OAuth handler not found for provider: ${provider}` })
    }

    return await oauthHandler({ config, async onSuccess(event: H3Event<EventHandlerRequest>, { user }: any) {
      if (!user || typeof user !== "object") {
        throw createError({ statusCode: 400, statusMessage: `Invalid user data from ${provider}` })
      }

      const extractor = extractUserData[provider]
      if (!extractor) {
        throw createError({ statusCode: 400, statusMessage: `User data extractor not found for provider: ${provider}` })
      }

      const userData = extractor(user)
      if (!userData.id || !userData.email) {
        throw createError({ statusCode: 400, statusMessage: `Missing required user data from ${provider}` })
      }

      return handleOAuthUser(event, { ...userData, provider: provider as OAuthUserData["provider"] })
    }, onError(event: RequestEvent) {
      return redirectOAuthError(event, `/sign-in?error=${provider}_oauth_failed`)
    } })(event as unknown as RequestEvent)
  }
  catch (err: unknown) {
    throw createError({ statusCode: 500, statusMessage: "OAuth processing failed", data: { provider, error: err instanceof Error ? err.message : String(err) } })
  }
})
