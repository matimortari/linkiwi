export default defineEventHandler(async (event) => {
  const platform = getRouterParam(event, "platform")?.toLowerCase()
  const { handle } = getQuery(event)
  if (!handle || typeof handle !== "string") {
    throw createError({ status: 400, statusText: "Handle query parameter is required" })
  }

  const handlers: Record<string, () => Promise<{ data: any }>> = {
    youtube: async () => {
      const youTubeApiKey = requireEnv("YOUTUBE_API_KEY")
      const cacheKey = `widget:youtube:${handle}`
      const cached = await getCached<any>(cacheKey)
      if (cached) {
        return { data: cached }
      }

      const channelQuery = handle.startsWith("UC") ? { id: handle } : { forHandle: handle }
      const channelRes = await $fetch<any>("https://www.googleapis.com/youtube/v3/channels", { query: { part: "snippet,statistics", ...channelQuery, key: youTubeApiKey } }).catch(() => null)
      const channel = channelRes?.items?.[0]
      if (!channel) {
        throw createError({ status: 404, statusText: `YouTube channel '${handle}' not found` })
      }

      const searchRes = await $fetch<any>("https://www.googleapis.com/youtube/v3/search", { query: { part: "snippet", channelId: channel.id, order: "date", type: "video", maxResults: 5, key: youTubeApiKey } }).catch(() => null)
      const videos = searchRes?.items?.map((video: any) => ({
        id: video.id.videoId,
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails?.medium?.url || null,
        publishedAt: video.snippet.publishedAt,
        url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
      })) ?? []

      const data = {
        handle,
        channelId: channel.id,
        name: channel.snippet.title,
        description: channel.snippet.description || null,
        avatar: channel.snippet.thumbnails?.default?.url || null,
        subscribers: Number(channel.statistics.subscriberCount ?? 0),
        videoCount: Number(channel.statistics.videoCount ?? 0),
        profileUrl: `https://www.youtube.com/channel/${channel.id}`,
        videos,
      }

      await setCached(cacheKey, data, 30 * 60)

      return { data }
    },

    github: async () => {
      const cacheKey = `widget:github:${handle}`
      const cached = await getCached<any>(cacheKey)
      if (cached) {
        return { data: cached }
      }

      const [userRes, reposRes] = await Promise.allSettled([
        $fetch<any>(`https://api.github.com/users/${handle}`, { headers: { Accept: "application/vnd.github+json" } }),
        $fetch<any[]>(`https://api.github.com/users/${handle}/repos`, { headers: { Accept: "application/vnd.github+json" }, query: { sort: "updated", per_page: 6, type: "owner" } }),
      ])
      if (userRes.status === "rejected") {
        throw createError({ status: 404, statusText: `GitHub user '${handle}' not found` })
      }

      const user = userRes.value
      const repos = (reposRes.status === "fulfilled" ? reposRes.value : []).filter((r: any) => !r.fork).map((r: any) => ({
        name: r.name,
        description: r.description || null,
        stars: r.stargazers_count,
        language: r.language || null,
        url: r.html_url,
      }))

      const data = {
        handle,
        name: user.name || user.login,
        avatar: user.avatar_url,
        bio: user.bio || null,
        followers: user.followers,
        publicRepos: user.public_repos,
        profileUrl: user.html_url,
        repos,
      }

      await setCached(cacheKey, data, 60 * 60)

      return { data }
    },
  }
  if (!platform || !(platform in handlers)) {
    throw createError({ status: 400, statusText: `Unsupported platform widget type: '${platform}'` })
  }

  return await (handlers[platform] as () => Promise<{ data: any }>)()
})

defineRouteMeta({
  openAPI: {
    summary: "Get widget data",
    description: "Fetches live data for a platform widget. Supported platforms: `github`, `youtube`. Responses are cached (GitHub: 1h, YouTube: 30min).",
    tags: ["Widgets"],
    parameters: [
      { in: "path", name: "platform", required: true, schema: { type: "string", enum: ["github", "youtube"] }, description: "Platform identifier" },
      { in: "query", name: "handle", required: true, schema: { type: "string" }, description: "Platform username or channel handle" },
    ],
    responses: {
      200: { description: "Platform data (profile info and recent content)" },
      400: { description: "Missing handle or unsupported platform" },
      404: { description: "Platform user or channel not found" },
      429: { description: "Rate limit exceeded" },
    },
  },
})
