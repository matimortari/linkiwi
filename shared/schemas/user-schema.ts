import { z } from "zod"

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be at most 50 characters")
    .transform(val => val.trim())
    .refine(val => val.length > 0, { message: "Name cannot be empty" })
    .optional(),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(50, "Slug must be at most 50 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens")
    .optional(),
  description: z.string().max(300).optional(),
})

const hexColorSchema = z.string().regex(/^#([A-F0-9]{6}|[A-F0-9]{3})$/i, "Invalid hex color")

export const updateUserPreferencesSchema = z.object({
  backgroundType: z.enum(["FLAT", "GRADIENT"]).optional(),
  backgroundColor: hexColorSchema.optional(),
  backgroundGradientStart: hexColorSchema.optional(),
  backgroundGradientEnd: hexColorSchema.optional(),
  profilePictureRadius: z.string().optional(),
  profilePictureBorderColor: hexColorSchema.optional(),
  profilePictureBorderWidth: z.string().optional(),
  slugTextColor: hexColorSchema.optional(),
  slugTextWeight: z.string().optional(),
  slugTextSize: z.string().optional(),
  slugFontFamily: z.string().optional(),
  headerTextColor: hexColorSchema.optional(),
  headerTextWeight: z.string().optional(),
  headerTextSize: z.string().optional(),
  headerFontFamily: z.string().optional(),
  linkBackgroundColor: hexColorSchema.optional(),
  linkTextColor: hexColorSchema.optional(),
  linkTextWeight: z.string().optional(),
  linkTextSize: z.string().optional(),
  linkFontFamily: z.string().optional(),
  isLinkShadow: z.boolean().optional(),
  linkShadowColor: hexColorSchema.optional(),
  linkShadowWeight: z.string().optional(),
  linkHoverBackgroundColor: hexColorSchema.optional(),
  linkBorderRadius: z.string().optional(),
  linkPadding: z.string().optional(),
  showLinkCopyButton: z.boolean().optional(),
  iconBackgroundColor: hexColorSchema.optional(),
  isIconShadow: z.boolean().optional(),
  iconShadowColor: hexColorSchema.optional(),
  iconShadowWeight: z.string().optional(),
  iconLogoColor: hexColorSchema.optional(),
  iconHoverBackgroundColor: hexColorSchema.optional(),
  supportBanner: z.enum(["NONE", "LGBTQ_RIGHTS", "ANTI_RACISM", "MENTAL_HEALTH", "CLIMATE_ACTION"]).optional(),
  enableGuestbook: z.boolean().optional(),
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type BackgroundType = z.infer<typeof updateUserPreferencesSchema.shape.backgroundType>
export type UpdateUserPreferencesInput = z.infer<typeof updateUserPreferencesSchema>
