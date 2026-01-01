import { z } from "zod"

export const analyticsRecordSchema = z.object({
  type: z.enum(["pageView", "link", "icon"]),
  userId: z.cuid(),
  id: z.cuid().optional(),
  createdAt: z.string().optional(),
}).refine((data) => {
  if ((data.type === "link" || data.type === "icon") && !data.id) {
    return false
  }
  return true
}, { message: "ID is required for link and social icon analytics", path: ["id"] })

export const createCommentSchema = z.object({
  userId: z.cuid("Invalid user ID"),
  name: z.string().min(1, "Name is required").max(100).trim(),
  email: z.email("Invalid email address").max(100).optional().or(z.literal("")).transform(val => val || undefined),
  message: z.string().min(1, "Message is required").max(500).trim(),
})

export type AnalyticsRecordSchema = z.infer<typeof analyticsRecordSchema>
export type CreateCommentInput = z.infer<typeof createCommentSchema>
