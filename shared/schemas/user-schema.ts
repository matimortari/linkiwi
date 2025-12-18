import { z } from "zod"

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be at most 50 characters")
    .transform(val => val.trim())
    .refine(val => val.length > 0, { message: "Name cannot be empty" })
    .optional(),
  image: z
    .union([z.url(), z.literal(""), z.null()])
    .transform(val => (val === "" ? null : val))
    .optional(),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Invalid slug")
    .optional(),
  description: z
    .string()
    .max(300)
    .optional(),
})

export const updateUserPreferencesSchema = z.object({
  backgroundType: z.enum(["FLAT", "GRADIENT"]).optional(),
  backgroundColor: z.string().optional(),
  backgroundGradientStart: z.string().optional(),
  backgroundGradientEnd: z.string().optional(),
  profilePictureRadius: z.string().optional(),
  profilePictureBorderColor: z.string().optional(),
  profilePictureBorderWidth: z.string().optional(),
  slugTextColor: z.string().optional(),
  slugTextWeight: z.string().optional(),
  slugTextSize: z.string().optional(),
  slugFontFamily: z.string().optional(),
  headerTextColor: z.string().optional(),
  headerTextWeight: z.string().optional(),
  headerTextSize: z.string().optional(),
  headerFontFamily: z.string().optional(),
  linkBackgroundColor: z.string().optional(),
  linkTextColor: z.string().optional(),
  linkTextWeight: z.string().optional(),
  linkTextSize: z.string().optional(),
  linkFontFamily: z.string().optional(),
  isLinkShadow: z.boolean().optional(),
  linkShadowColor: z.string().optional(),
  linkShadowWeight: z.string().optional(),
  linkHoverBackgroundColor: z.string().optional(),
  linkBorderRadius: z.string().optional(),
  linkPadding: z.string().optional(),
  showLinkCopyButton: z.boolean().optional(),
  iconBackgroundColor: z.string().optional(),
  isIconShadow: z.boolean().optional(),
  iconShadowColor: z.string().optional(),
  iconShadowWeight: z.string().optional(),
  iconLogoColor: z.string().optional(),
  iconHoverBackgroundColor: z.string().optional(),
  supportBanner: z.enum(["NONE", "LGBTQ_RIGHTS", "ANTI_RACISM", "MENTAL_HEALTH", "CLIMATE_ACTION"]).optional(),
  enableGuestbook: z.boolean().optional(),
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type BackgroundType = z.infer<typeof updateUserPreferencesSchema.shape.backgroundType>
export type UpdateUserPreferencesInput = z.infer<typeof updateUserPreferencesSchema>
