async function getTwitchToken(): Promise<string> {
  const clientId = process.env.TWITCH_CLIENT_ID
  const clientSecret = process.env.TWITCH_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw createError({ status: 500, statusText: "Twitch credentials are not configured" })
  }

  const tokenCacheKey = "twitch:app:token"
  const cached = await getCached<string>(tokenCacheKey)
  if (cached) {
    return cached
  }

  const res = await $fetch<any>("https://id.twitch.tv/oauth2/token", { method: "POST", query: {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "client_credentials",
  } })

  await setCached(tokenCacheKey, res.access_token, res.expires_in - 60)

  return res.access_token
}

export default defineEventHandler(async (event) => {
  const handle = getRouterParam(event, "handle")
  if (!handle) {
    throw createError({ status: 400, statusText: "Twitch handle is required" })
  }

  const clientId = process.env.TWITCH_CLIENT_ID
  if (!clientId) {
    throw createError({ status: 500, statusText: "Twitch credentials are not configured" })
  }

  const cacheKey = `widget:twitch:${handle}`
  const cached = await getCached<any>(cacheKey)
  if (cached) {
    return cached
  }

  const token = await getTwitchToken()

  const [userRes, streamRes] = await Promise.allSettled([
    $fetch<any>("https://api.twitch.tv/helix/users", { headers: { "Authorization": `Bearer ${token}`, "Client-Id": clientId }, query: { login: handle } }),
    $fetch<any>("https://api.twitch.tv/helix/streams", { headers: { "Authorization": `Bearer ${token}`, "Client-Id": clientId }, query: { user_login: handle } }),
  ])
  if (userRes.status === "rejected" || !userRes.value.data?.[0]) {
    throw createError({ status: 404, statusText: `Twitch user '${handle}' not found` })
  }

  const user = userRes.value.data[0]
  const stream = streamRes.status === "fulfilled" ? streamRes.value.data?.[0] ?? null : null
  const isLive = !!stream

  const data = {
    handle,
    name: user.display_name,
    avatar: user.profile_image_url,
    description: user.description || null,
    profileUrl: `https://www.twitch.tv/${handle}`,
    isLive,
    stream: isLive
      ? {
          title: stream.title,
          game: stream.game_name,
          viewers: stream.viewer_count,
          thumbnail: stream.thumbnail_url.replace("{width}", "440").replace("{height}", "248"),
          startedAt: stream.started_at,
        }
      : null,
  }

  await setCached(cacheKey, data, 2 * 60)

  return data
})
