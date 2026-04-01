import { z } from "zod"

const referrerSchema = z.string().nullable().optional().transform((val) => {
  if (!val || val.trim() === "") {
    return null
  }

  const normalized = val.trim()
  if (!normalized.includes("://") && !normalized.includes(".")) {
    return normalized
  }

  if (URL.canParse(normalized)) {
    return normalized
  }
  else {
    return null
  }
})

const slugSchema = z.string().min(3, "Slug must be at least 3 characters").max(50, "Slug must be at most 50 characters").regex(/^[a-z0-9-]+$/, "Invalid slug")

export const analyticsRecordSchema = z.discriminatedUnion("type", [
  z.object({ slug: slugSchema, referrer: referrerSchema, createdAt: z.string().optional() }).extend({ type: z.literal("pageView"), id: z.cuid().optional() }),
  z.object({ slug: slugSchema, referrer: referrerSchema, createdAt: z.string().optional() }).extend({ type: z.literal("link"), id: z.cuid() }),
  z.object({ slug: slugSchema, referrer: referrerSchema, createdAt: z.string().optional() }).extend({ type: z.literal("icon"), id: z.cuid() }),
])

export const createCommentSchema = z.object({
  userId: z.cuid("Invalid user ID"),
  name: z.string().min(1, "Name is required").max(100).trim(),
  email: z.email("Invalid email address").max(100).or(z.literal("")).transform(val => val || undefined),
  message: z.string().min(1, "Message is required").max(500).trim(),
})

export type AnalyticsRecordSchema = z.infer<typeof analyticsRecordSchema>
export type CreateCommentInput = z.infer<typeof createCommentSchema>
