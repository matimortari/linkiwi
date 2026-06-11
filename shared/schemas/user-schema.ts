import { z } from "zod"

const hexColorSchema = z.string().regex(/^#([A-F0-9]{6}|[A-F0-9]{3})$/i, "Invalid hex color")

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
  location: z.string().max(100).optional(),
})

export const updateUserPreferencesSchema = z.object({
  backgroundType: z.enum(["FLAT", "GRADIENT"]),
  backgroundColor: hexColorSchema,
  backgroundGradientStart: hexColorSchema,
  backgroundGradientEnd: hexColorSchema,
  profilePictureRadius: z.string(),
  profilePictureBorderColor: hexColorSchema,
  profilePictureBorderWidth: z.string(),
  slugTextColor: hexColorSchema,
  slugTextWeight: z.string(),
  slugTextSize: z.string(),
  slugFontFamily: z.string(),
  headerTextColor: hexColorSchema,
  headerTextWeight: z.string(),
  headerTextSize: z.string(),
  headerFontFamily: z.string(),
  linkBackgroundColor: hexColorSchema,
  linkTextColor: hexColorSchema,
  linkTextWeight: z.string(),
  linkTextSize: z.string(),
  linkFontFamily: z.string(),
  isLinkShadow: z.boolean(),
  linkShadowColor: hexColorSchema,
  linkShadowWeight: z.string(),
  linkHoverBackgroundColor: hexColorSchema,
  linkBorderRadius: z.string(),
  linkPadding: z.string(),
  showLinkCopyButton: z.boolean(),
  iconBackgroundColor: hexColorSchema,
  isIconShadow: z.boolean(),
  iconShadowColor: hexColorSchema,
  iconShadowWeight: z.string(),
  iconLogoColor: hexColorSchema,
  iconHoverBackgroundColor: hexColorSchema,
  dividerColor: hexColorSchema,
  dividerThickness: z.string(),
  dividerStyle: z.string(),
  supportBanner: z.enum(["NONE", "LGBTQ_RIGHTS", "ANTI_RACISM", "MENTAL_HEALTH", "CLIMATE_ACTION"]),
  enableGuestbook: z.boolean(),
  showLocation: z.boolean(),
}).partial()

export const userSupportButtonSchema = z.object({
  isEnabled: z.boolean().default(false),
  platform: z.enum(["KO_FI", "BUY_ME_A_COFFEE", "PIX", "CUSTOM"]).default("CUSTOM"),
  url: z.url("Invalid URL"),
  thankYouMessage: z.string().max(500).nullable().optional(),
  suggestedAmounts: z.array(z.number().int().positive()).max(5, "Maximum of 5 choices allowed"),
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type UpdateUserPreferencesInput = z.infer<typeof updateUserPreferencesSchema>
export type UserSupportButtonInput = z.infer<typeof userSupportButtonSchema>
