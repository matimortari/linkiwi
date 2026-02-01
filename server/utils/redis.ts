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
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            return new Error("Redis reconnection failed")
          }
          return Math.min(retries * 100, 3000)
        },
      },
    }) as RedisClientType

    await redisClient.connect()
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
      return null
    }

    const data = await client.get(key)
    return data ? JSON.parse(data) : null
  }
  catch (err: any) {
    throw createError({ statusCode: 500, message: `Redis GET error for key ${key}`, data: { key, error: err instanceof Error ? err.message : String(err) } })
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
  catch (err: any) {
    throw createError({ statusCode: 500, message: `Redis SET error for key ${key}`, data: { key, error: err instanceof Error ? err.message : String(err) } })
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
  catch (err: any) {
    throw createError({ statusCode: 500, message: `Redis DEL error for keys ${keys.join(", ")}`, data: { keys, error: err instanceof Error ? err.message : String(err) } })
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
