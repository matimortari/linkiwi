import { z } from "zod"

export const analyticsRecordSchema = z.object({
  type: z.enum(["pageView", "link", "icon"]),
  userId: z.cuid(),
  id: z.cuid().optional(),
}).refine((data) => {
  if ((data.type === "link" || data.type === "icon") && !data.id) {
    return false
  }
  return true
}, {
  message: "ID is required for link and social icon analytics",
  path: ["id"],
})

export type AnalyticsRecordSchema = z.infer<typeof analyticsRecordSchema>
