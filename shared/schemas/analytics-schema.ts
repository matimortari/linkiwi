import { z } from "zod"

const referrerSchema = z.string().nullable().optional().transform((val) => {
  if (!val || val.trim() === "") {
    return null
  }

  const normalized = val.trim()
  if (!normalized.includes("://") && !normalized.includes(".")) {
    return normalized
  }

  return URL.canParse(normalized) ? normalized : null
})

export const analyticsRecordSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("pageView"),
    slug: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/),
    referrer: referrerSchema,
    createdAt: z.iso.datetime().optional(),
  }),
  z.object({
    type: z.literal("itemClick"),
    itemId: z.cuid2("Invalid item ID"),
    createdAt: z.iso.datetime().optional(),
  }),
])

export const createCommentSchema = z.object({
  userId: z.cuid2("Invalid user ID"),
  name: z.string().min(1, "Name is required").max(100).trim(),
  email: z.email("Invalid email address").max(100).or(z.literal("")).transform(val => val || undefined),
  message: z.string().min(1, "Message is required").max(500).trim(),
})

export type AnalyticsRecordSchema = z.infer<typeof analyticsRecordSchema>
export type CreateCommentInput = z.infer<typeof createCommentSchema>
