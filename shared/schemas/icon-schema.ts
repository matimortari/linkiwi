import { SOCIAL_ICONS } from "#shared/lib/constants"
import { z } from "zod"

export const createUserIconSchema = z.object({
  url: z.url().trim(),
  platform: z.enum(Object.keys(SOCIAL_ICONS) as [keyof typeof SOCIAL_ICONS, ...Array<keyof typeof SOCIAL_ICONS>]),
  logo: z.enum(Object.values(SOCIAL_ICONS) as [typeof SOCIAL_ICONS[keyof typeof SOCIAL_ICONS], ...Array<typeof SOCIAL_ICONS[keyof typeof SOCIAL_ICONS]>]),
}).refine((data) => {
  return SOCIAL_ICONS[data.platform as keyof typeof SOCIAL_ICONS] === data.logo
}, { message: "Platform and logo must match", path: ["logo"] })

export type CreateUserIconInput = z.infer<typeof createUserIconSchema>
