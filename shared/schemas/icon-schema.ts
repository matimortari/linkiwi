import { z } from "zod"
import { SOCIAL_ICONS } from "~/utils/preferences"

const urlSchema = z.url("Invalid URL").refine(url => url.startsWith("http://") || url.startsWith("https://"), { message: "URL must start with http:// or https://" })

export const createUserIconSchema = z.object({
  url: urlSchema,
  platform: z.enum(Object.keys(SOCIAL_ICONS) as [string, ...string[]]),
}).transform(data => ({ ...data, logo: SOCIAL_ICONS[data.platform as keyof typeof SOCIAL_ICONS] }))

export type CreateUserIconInput = z.infer<typeof createUserIconSchema>
