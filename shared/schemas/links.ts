import { z } from "zod"

export const createUserLinkSchema = z.object({
  url: z.url().trim(),
  title: z.string().min(1).max(100),
})

export const updateUserLinkSchema = z.object({
  url: z.url().trim().optional(),
  title: z.string().min(1).max(100).optional(),
})

export type CreateUserLinkInput = z.infer<typeof createUserLinkSchema>
export type UpdateUserLinkInput = z.infer<typeof updateUserLinkSchema>
