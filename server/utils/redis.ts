import type { RedisClientType } from "redis"
import { createClient } from "redis"

let redisClient: RedisClientType | null = null

export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  LONG: 300, // 5 minutes
} as const

/**
 * Gets or creates the Redis client instance.
 */
async function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL,
      socket: {
        connectTimeout: 5000, // 5 seconds
        reconnectStrategy: () => false,
      },
    }) as RedisClientType

    redisClient.on("error", () => {})

    try {
      await redisClient.connect()
    }
    catch {
      redisClient = null
      return null
    }
  }

  return redisClient
}

/**
 * Gets a value from cache and parses it as JSON.
 */
export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const client = await getRedisClient()
    if (!client) {
      console.warn("[Cache] Redis unavailable")
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
 * Helper to generate cache keys for user-related data.
 */
export const CacheKeys = {
  userData: (userId: string) => `user:data:${userId}`,
  userProfile: (slug: string) => `user:profile:${slug}`,
  userLinks: (userId: string) => `user:links:${userId}`,
  userIcons: (userId: string) => `user:icons:${userId}`,
  analytics: (userId: string) => `user:analytics:${userId}`,
} as const
