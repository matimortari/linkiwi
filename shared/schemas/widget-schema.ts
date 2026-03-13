import { z } from "zod"

export const WIDGET_TYPES = ["GITHUB", "YOUTUBE"] as const
export type WidgetType = typeof WIDGET_TYPES[number]

// Handle validation per platform — kept intentionally loose since usernames/channel IDs vary widely per platform. Trimmed and non-empty.
const handleSchema = z.string().min(1, "Handle is required").max(100, "Handle is too long").transform(val => val.trim())

export const createWidgetSchema = z.object({
  type: z.enum(WIDGET_TYPES, { error: "Invalid widget type" }),
  handle: handleSchema,
})

export const updateWidgetSchema = z.object({
  handle: handleSchema.optional(),
  order: z.number().int("Order must be an integer").min(0, "Order must be non-negative").optional(),
  isVisible: z.boolean().optional(),
})

export type CreateWidgetInput = z.infer<typeof createWidgetSchema>
export type UpdateWidgetInput = z.infer<typeof updateWidgetSchema>
