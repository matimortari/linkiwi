import { z } from "zod"

const urlSchema = z.url("Invalid URL").refine(url => url.startsWith("http://") || url.startsWith("https://"), { message: "URL must start with http:// or https://" })

const schedulingSchema = z.object({
  isPinned: z.boolean().optional(),
  isVisible: z.boolean().optional(),
  scheduledStart: z.iso.datetime({ message: "Invalid ISO datetime string" }).nullable().optional(),
  scheduledEnd: z.iso.datetime({ message: "Invalid ISO datetime string" }).nullable().optional(),
  scheduleAction: z.enum(["HIDE", "DELETE"]).nullable().optional(),
}).refine(
  data => !data.scheduledEnd || !data.scheduledStart || new Date(data.scheduledEnd) > new Date(data.scheduledStart),
  { message: "End schedule must occur after start schedule", path: ["scheduledEnd"] },
)

const linkPayload = z.object({ url: urlSchema.transform(val => val.trim()), label: z.string().min(1, "Label is required").max(100).transform(val => val.trim()) })
const iconPayload = z.object({ url: urlSchema, platform: z.string().min(1).max(50) })
const widgetPayload = z.object({ type: z.enum(["GITHUB", "YOUTUBE", "SPOTIFY"]), handle: z.string().min(1, "Handle is required").max(300).transform(val => val.trim()) })

const photoGridItemSchema = z.object({
  assetId: z.cuid2().nullable().optional(),
  url: urlSchema,
  order: z.number().int().min(0),
  alt: z.string().max(200).nullable().optional(),
})

const photoGridPayload = z.object({ photos: z.array(photoGridItemSchema).min(1, "Provide at least one photo").max(12) })

export const createProfileItemSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("LINK"), link: linkPayload }),
  z.object({ type: z.literal("WIDGET"), widget: widgetPayload }),
  z.object({ type: z.literal("ICON"), icon: iconPayload }),
  z.object({ type: z.literal("DIVIDER") }),
  z.object({ type: z.literal("PHOTO_GRID"), photoGrid: photoGridPayload }),
]).and(z.object({ order: z.number().int().min(0).default(0) })).and(schedulingSchema.partial())

export const updateProfileItemSchema = z.object({
  order: z.number().int().min(0).optional(),
  link: linkPayload.partial().optional(),
  widget: widgetPayload.partial().optional(),
  icon: iconPayload.partial().optional(),
  photoGrid: photoGridPayload.partial().optional(),
}).and(schedulingSchema.partial())

export const reorderItemsSchema = z.object({ ids: z.array(z.cuid2()).min(1) })

export type CreateProfileItemInput = z.infer<typeof createProfileItemSchema>
export type UpdateProfileItemInput = z.infer<typeof updateProfileItemSchema>
