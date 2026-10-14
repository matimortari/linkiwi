export default defineEventHandler(async (event) => {
  const sessionUser = await getUserFromSession(event)
  await enforceRateLimit(event, `geocode:${sessionUser.id}`, 30)

  const query = getQuery(event)
  const q = typeof query.q === "string" ? query.q.trim() : ""
  if (!q || q.length < 2) {
    throw createError({ statusCode: 400, statusMessage: "Search query must be at least 2 characters" })
  }
  if (q.length > 200) {
    throw createError({ statusCode: 400, statusMessage: "Search query is too long" })
  }

  const cacheKey = CacheKeys.geocode(q.toLowerCase())
  const cached = await getCached<{ results: { label: string, lat: number, lng: number }[] }>(cacheKey)
  if (cached) {
    return cached
  }

  const results = await $fetch<any[]>("https://nominatim.openstreetmap.org/search", {
    query: { q, format: "json", limit: 5 },
    headers: { "User-Agent": "LinKiwi/1.0 (https://github.com/matimortari/linkiwi)", "Accept-Language": "en" },
  }).catch(() => {
    throw createError({ statusCode: 502, statusMessage: "Failed to look up location" })
  })

  const payload = { results: (results || []).map(result => ({ label: result.display_name, lat: Number(result.lat), lng: Number(result.lon) })) }
  await setCached(cacheKey, payload, 24 * 60 * 60)

  return payload
})

defineRouteMeta({
  openAPI: {
    summary: "Geocode a place name",
    description: "Looks up places via OpenStreetMap Nominatim and returns coordinates.",
    tags: ["Items"],
    parameters: [
      { in: "query", name: "q", required: true, schema: { type: "string" }, description: "Place name or address to search" },
    ],
    responses: {
      200: { description: "Matching places with coordinates" },
      400: { description: "Invalid query" },
      401: { description: "Unauthorized" },
      429: { description: "Rate limit exceeded" },
      502: { description: "Upstream geocoding failed" },
    },
  },
})
