import { z } from "zod"
import { SOCIAL_ICONS } from "~/utils/preferences"

const urlSchema = z.url("Invalid URL").refine(url => url.startsWith("http://") || url.startsWith("https://"), { message: "URL must start with http:// or https://" })

export const createUserIconSchema = z.object({
  url: urlSchema,
  platform: z.enum(Object.keys(SOCIAL_ICONS) as [string, ...string[]]),
}).transform(data => ({ ...data, logo: SOCIAL_ICONS[data.platform as keyof typeof SOCIAL_ICONS] }))

export const updateUserIconSchema = z.object({
  order: z.number().int("Order must be an integer").min(0, "Order must be non-negative").optional(),
  isVisible: z.boolean().optional(),
})

export type CreateUserIconInput = z.infer<typeof createUserIconSchema>
export type UpdateUserIconInput = z.infer<typeof updateUserIconSchema>
