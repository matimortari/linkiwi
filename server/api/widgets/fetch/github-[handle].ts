export default defineEventHandler(async (event) => {
  const handle = getRouterParam(event, "handle")
  if (!handle) {
    throw createError({ status: 400, statusText: "GitHub handle is required" })
  }

  const cacheKey = `widget:github:${handle}`
  const cached = await getCached<any>(cacheKey)
  if (cached) {
    return cached
  }

  const [userRes, reposRes] = await Promise.allSettled([
    $fetch<any>(`https://api.github.com/users/${handle}`, {
      headers: { Accept: "application/vnd.github+json" },
    }),
    $fetch<any[]>(`https://api.github.com/users/${handle}/repos`, {
      headers: { Accept: "application/vnd.github+json" },
      query: { sort: "updated", per_page: 4, type: "owner" },
    }),
  ])

  if (userRes.status === "rejected") {
    throw createError({ status: 404, statusText: `GitHub user '${handle}' not found` })
  }

  const user = userRes.value
  const repos = reposRes.status === "fulfilled" ? reposRes.value : []

  const data = {
    handle,
    name: user.name || user.login,
    avatar: user.avatar_url,
    bio: user.bio || null,
    followers: user.followers,
    publicRepos: user.public_repos,
    profileUrl: user.html_url,
    repos: repos.filter((r: any) => !r.fork).map((r: any) => ({
      name: r.name,
      description: r.description || null,
      stars: r.stargazers_count,
      language: r.language || null,
      url: r.html_url,
    })),
  }

  await setCached(cacheKey, data, 60 * 60)

  return data
})
