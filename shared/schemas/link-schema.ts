import { z } from "zod"

const urlSchema = z.url("Invalid URL").refine(url => url.startsWith("http://") || url.startsWith("https://"), { message: "URL must start with http:// or https://" })

export const createUserLinkSchema = z.object({
  url: urlSchema.transform(val => val.trim()),
  title: z.string().min(1, "Title is required").max(100).transform(val => val.trim()),
})

export const updateUserLinkSchema = z.object({
  url: urlSchema.transform(val => val.trim()).optional(),
  title: z.string().min(1, "Title is required").max(100).transform(val => val.trim()).optional(),
  order: z.number().int("Order must be an integer").min(0, "Order must be non-negative").optional(),
})

export type CreateUserLinkInput = z.infer<typeof createUserLinkSchema>
export type UpdateUserLinkInput = z.infer<typeof updateUserLinkSchema>
