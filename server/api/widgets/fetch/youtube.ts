export default defineEventHandler(async (event) => {
  const { handle } = getQuery(event)
  if (!handle || typeof handle !== "string") {
    throw createError({ status: 400, statusText: "YouTube handle is required" })
  }

  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) {
    throw createError({ status: 500, statusText: "YouTube API key is not configured" })
  }

  const cacheKey = `widget:youtube:${handle}`
  const cached = await getCached<any>(cacheKey)
  if (cached) {
    return cached
  }

  const channelQuery = handle.startsWith("UC") ? { id: handle } : { forHandle: handle }
  const channelRes = await $fetch<any>("https://www.googleapis.com/youtube/v3/channels", { query: { part: "snippet,statistics", ...channelQuery, key: apiKey } }).catch(() => null)
  const channel = channelRes?.items?.[0]
  if (!channel) {
    throw createError({ status: 404, statusText: `YouTube channel '${handle}' not found` })
  }

  const channelId = channel.id
  const searchRes = await $fetch<any>("https://www.googleapis.com/youtube/v3/search", { query: { part: "snippet", channelId, order: "date", type: "video", maxResults: 1, key: apiKey } }).catch(() => null)
  const latestVideo = searchRes?.items?.[0] ?? null

  const data = {
    handle,
    channelId,
    name: channel.snippet.title,
    description: channel.snippet.description || null,
    avatar: channel.snippet.thumbnails?.default?.url || null,
    subscribers: Number(channel.statistics.subscriberCount ?? 0),
    videoCount: Number(channel.statistics.videoCount ?? 0),
    profileUrl: `https://www.youtube.com/channel/${channelId}`,
    latestVideo: latestVideo
      ? {
          id: latestVideo.id.videoId,
          title: latestVideo.snippet.title,
          thumbnail: latestVideo.snippet.thumbnails?.medium?.url || null,
          publishedAt: latestVideo.snippet.publishedAt,
          url: `https://www.youtube.com/watch?v=${latestVideo.id.videoId}`,
        }
      : null,
  }

  await setCached(cacheKey, data, 30 * 60)

  return data
})
