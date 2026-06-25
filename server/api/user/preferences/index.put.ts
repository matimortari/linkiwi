import { updateUserPreferencesSchema } from "#shared/schemas/user-schema"

export default defineEventHandler(async (event) => {
  const sessionUser = await getUserFromSession(event)

  // Rate limit: 30 requests per hour per user
  await enforceRateLimit(event, `user:preferences:${sessionUser.id}`, 30)

  const body = await readBody(event)
  const result = updateUserPreferencesSchema.safeParse(body)
  if (!result.success) {
    throw createError({ status: 400, statusText: result.error.issues[0]?.message || "Invalid input" })
  }

  const updatedPreferences = await db.userPreferences.update({ where: { userId: sessionUser.id }, data: result.data })

  const user = await db.user.findUnique({ where: { id: sessionUser.id }, select: { slug: true } })

  await Promise.all([deleteCached(CacheKeys.userData(sessionUser.id)), deleteCached(CacheKeys.userProfile(user?.slug || ""))])

  return { updatedPreferences }
})

defineRouteMeta({
  openAPI: {
    summary: "Update user preferences",
    description: "Updates the user's profile preferences.",
    tags: ["User"],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              backgroundType: { type: "string", enum: ["FLAT", "GRADIENT"] },
              backgroundColor: { type: "string", description: "Hex color (#RGB or #RRGGBB)" },
              backgroundGradientStart: { type: "string", description: "Hex color (#RGB or #RRGGBB)" },
              backgroundGradientEnd: { type: "string", description: "Hex color (#RGB or #RRGGBB)" },
              profilePictureRadius: { type: "string", description: "Radius size (e.g. '0.5rem')" },
              profilePictureBorderColor: { type: "string", description: "Hex color (#RGB or #RRGGBB)" },
              profilePictureBorderWidth: { type: "string", description: "Border width (e.g. '2px')" },
              slugTextColor: { type: "string", description: "Hex color (#RGB or #RRGGBB)" },
              slugTextWeight: { type: "string", description: "Font weight (e.g. '400')" },
              slugTextSize: { type: "string", description: "Font size (e.g. '1rem')" },
              slugFontFamily: { type: "string", description: "Font family (e.g. 'Roboto, sans-serif')" },
              headerTextColor: { type: "string", description: "Hex color (#RGB or #RRGGBB)" },
              headerTextWeight: { type: "string", description: "Font weight (e.g. '400')" },
              headerTextSize: { type: "string", description: "Font size (e.g. '1.1rem')" },
              headerFontFamily: { type: "string", description: "Font family (e.g. 'Roboto, sans-serif')" },
              linkBackgroundColor: { type: "string", description: "Hex color (#RGB or #RRGGBB)" },
              linkTextColor: { type: "string", description: "Hex color (#RGB or #RRGGBB)" },
              linkTextWeight: { type: "string", description: "Font weight (e.g. '400')" },
              linkTextSize: { type: "string", description: "Font size (e.g. '0.9rem')" },
              linkFontFamily: { type: "string", description: "Font family (e.g. 'Roboto, sans-serif')" },
              isLinkShadow: { type: "boolean", description: "Whether to show link shadows (true/false)" },
              linkShadowColor: { type: "string", description: "Hex color (#RGB or #RRGGBB)" },
              linkShadowWeight: { type: "string", description: "Shadow weight (e.g. 'medium')" },
              linkHoverBackgroundColor: { type: "string", description: "Hex color (#RGB or #RRGGBB)" },
              linkBorderRadius: { type: "string", description: "Border radius (e.g. '0.5rem')" },
              linkPadding: { type: "string", description: "Padding (e.g. '0.5rem')" },
              showLinkCopyButton: { type: "boolean", description: "Whether to show a copy button for links (true/false)" },
              iconBackgroundColor: { type: "string", description: "Hex color (#RGB or #RRGGBB)" },
              isIconShadow: { type: "boolean", description: "Whether to show social icon shadows (true/false)" },
              iconShadowColor: { type: "string", description: "Hex color (#RGB or #RRGGBB)" },
              iconShadowWeight: { type: "string", description: "Shadow weight (e.g. 'medium')" },
              iconLogoColor: { type: "string", description: "Hex color (#RGB or #RRGGBB)" },
              iconHoverBackgroundColor: { type: "string", description: "Hex color (#RGB or #RRGGBB)" },
              dividerColor: { type: "string", description: "Hex color (#RGB or #RRGGBB)" },
              dividerThickness: { type: "string", description: "Border width (e.g. '1px')" },
              dividerStyle: { type: "string", description: "Border style (e.g. 'solid')" },
              supportBanner: { type: "string", enum: ["NONE", "LGBTQ_RIGHTS", "ANTI_RACISM", "MENTAL_HEALTH", "CLIMATE_ACTION"], description: "Support banner type" },
              enableGuestbook: { type: "boolean", description: "Whether to enable the user's guestbook (true/false)" },
            },
          },
        },
      },
    },
    responses: {
      200: { description: "Updated user preferences" },
      400: { description: "Validation error" },
      401: { description: "Unauthenticated" },
      429: { description: "Rate limit exceeded" },
    },
  },
})
