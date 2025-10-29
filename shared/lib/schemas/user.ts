import { z } from "zod"

const backgroundTypeEnum = z.enum(["FLAT", "GRADIENT"])
const supportBannerEnum = z.enum(["NONE", "LGBTQ_RIGHTS", "ANTI_RACISM", "MENTAL_HEALTH", "CLIMATE_ACTION"])

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.email().optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Invalid slug").optional(),
  description: z.string().max(300).optional(),
  image: z.url().trim().optional(),
})

export const updateUserPreferencesSchema = z.object({
  backgroundType: backgroundTypeEnum.optional(),
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
  supportBanner: supportBannerEnum.optional(),
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type BackgroundType = z.infer<typeof backgroundTypeEnum>
export type SupportBanner = z.infer<typeof supportBannerEnum>
export type UpdateUserPreferencesInput = z.infer<typeof updateUserPreferencesSchema>
