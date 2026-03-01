import type { RedisClientType } from "redis"
import { createClient } from "redis"

let redisClient: RedisClientType | null = null
let connecting = false

export const CACHE_TTL = {
  SHORT: 60,
  LONG: 300,
} as const

/**
 * Gets or creates the Redis client instance.
 */
async function getRedisClient() {
  if (redisClient?.isOpen) {
    return redisClient
  }
  if (connecting) {
    return null
  }

  connecting = true

  try {
    const client = createClient({
      url: process.env.REDIS_URL,
      socket: {
        connectTimeout: 5000, // 5 seconds
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            return false
          }
          return retries * 500
        },
      },
    }) as RedisClientType

    client.on("error", () => {})

    await client.connect()
    redisClient = client
    return redisClient
  }
  catch {
    redisClient = null
    return null
  }
  finally {
    connecting = false
  }
}

/**
 * Helper to generate cache keys for user-related data.
 */
export const CacheKeys = {
  userData: (userId: string) => `user:data:${userId}`,
  userProfile: (slug: string) => `user:profile:${slug}`,
  userLinks: (userId: string) => `user:links:${userId}`,
  userIcons: (userId: string) => `user:icons:${userId}`,
  analytics: (userId: string) => `user:analytics:${userId}`,
  rateLimit: (identifier: string) => `ratelimit:${identifier}`,
} as const

/**
 * Gets a value from cache and parses it as JSON.
 */
export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const client = await getRedisClient()
    if (!client) {
      console.warn("[Cache] Redis unavailable, skipping cache for key:", key)
      return null
    }

    const data = await client.get(key)
    if (data) {
      console.info(`[Cache HIT] ${key}`)
      return JSON.parse(data)
    }

    console.info(`[Cache MISS] ${key}`)
    return null
  }
  catch (err: any) {
    console.error(`[Cache ERROR] ${key}`, err)
    return null
  }
}

/**
 * Sets a value in cache with optional TTL.
 */
export async function setCached(key: string, value: any, ttl?: number): Promise<void> {
  try {
    const client = await getRedisClient()
    if (!client) {
      return
    }

    if (ttl) {
      await client.setEx(key, ttl, JSON.stringify(value))
    }
    else {
      await client.set(key, JSON.stringify(value))
    }
  }
  catch {
    // Silently fail
  }
}

/**
 * Deletes one or more keys from cache.
 */
export async function deleteCached(...keys: string[]): Promise<void> {
  if (keys.length === 0) {
    return
  }

  try {
    const client = await getRedisClient()
    if (!client) {
      return
    }

    await client.del(keys)
  }
  catch {
    // Silently fail
  }
}

/**
 * Sliding window rate limiter. Uses sorted sets to track request timestamps.
 * Returns whether the request is allowed, along with rate limit info for headers.
 */
export async function checkRateLimit(identifier: string, limit: number = 100, windowMs: number = 60 * 60 * 1000): Promise<{ allowed: boolean, limit: number, remaining: number, reset: number }> {
  try {
    const client = await getRedisClient()
    if (!client) {
      console.warn("[Rate Limit] Redis unavailable, allowing all requests for identifier:", identifier)
      return { allowed: true, limit, remaining: limit, reset: Date.now() + windowMs }
    }

    // Remove old entries outside the window
    const key = CacheKeys.rateLimit(identifier)
    const now = Date.now()
    await client.zRemRangeByScore(key, 0, now - windowMs)
    const count = await client.zCard(key)
    const allowed = count < limit
    const remaining = Math.max(0, limit - count - (allowed ? 1 : 0))
    if (allowed) {
      await client.zAdd(key, { score: now, value: `${now}-${Math.random()}` })
      await client.expire(key, Math.ceil(windowMs / 1000) + 10)
    }
    else {
      console.warn(`[Rate Limit EXCEEDED] ${identifier} - ${count}/${limit} requests in window`)
    }

    // Get oldest timestamp for reset calculation
    const oldestEntries = await client.zRange(key, 0, 0, { REV: false })
    let oldestTimestamp = now
    if (oldestEntries.length > 0 && oldestEntries[0]) {
      const timestampPart = oldestEntries[0].split("-")[0]
      if (timestampPart) {
        oldestTimestamp = Number.parseFloat(timestampPart)
      }
    }
    const reset = oldestTimestamp + windowMs

    return { allowed, limit, remaining, reset }
  }
  catch (err: any) {
    console.error("[Rate Limit ERROR]", err)
    return { allowed: true, limit, remaining: limit, reset: Date.now() + windowMs }
  }
}

/**
 * Enforces rate limiting with automatic header injection (X-RateLimit-*, Retry-After).
 * Throws 429 error when request limit is exceeded.
 */
export async function enforceRateLimit(event: any, identifier: string, limit: number = 100, windowMs: number = 60 * 60 * 1000): Promise<void> {
  const result = await checkRateLimit(identifier, limit, windowMs)

  setHeader(event, "X-RateLimit-Limit", result.limit.toString())
  setHeader(event, "X-RateLimit-Remaining", result.remaining.toString())
  setHeader(event, "X-RateLimit-Reset", result.reset.toString())

  if (!result.allowed) {
    setHeader(event, "Retry-After", Math.ceil((result.reset - Date.now()) / 1000))
    throw createError({ statusCode: 429, statusText: "Too many requests. Please try again later." })
  }
}
