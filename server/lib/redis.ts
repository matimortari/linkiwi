import type { RedisClientType } from "redis"
import { createClient } from "redis"

let redisClient: RedisClientType | null = null

/**
 * TTL constants (in seconds).
 */
export const CacheTTL = {
  SHORT: 300, // 5 minutes
  LONG: 600, // 10 minutes
  HOUR: 3600, // 1 hour
  DAY: 86400, // 24 hours
} as const

/**
 * Gets or creates the Redis client instance.
 */
export async function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.error("Redis: Too many reconnection attempts, giving up")
            return new Error("Redis reconnection failed")
          }
          return Math.min(retries * 100, 3000)
        },
      },
    }) as RedisClientType

    redisClient.on("error", err => console.error("Redis Client Error:", err))
    redisClient.on("connect", () => console.log("Redis Client Connected"))

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
    const data = await client.get(key)
    return data ? JSON.parse(data) : null
  }
  catch (err: any) {
    console.error(`Redis GET error for key ${key}:`, err)
    return null
  }
}

/**
 * Sets a value in cache with optional TTL.
 */
export async function setCached(key: string, value: any, ttl?: number): Promise<void> {
  try {
    const client = await getRedisClient()
    if (ttl) {
      await client.setEx(key, ttl, JSON.stringify(value))
    }
    else {
      await client.set(key, JSON.stringify(value))
    }
  }
  catch (err: any) {
    console.error(`Redis SET error for key ${key}:`, err)
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
    await client.del(keys)
  }
  catch (err: any) {
    console.error(`Redis DEL error for keys ${keys.join(", ")}:`, err)
  }
}
