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
    description: "Updates the user's profile appearance preferences (colors, fonts, layout, etc.).",
    tags: ["User"],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            description: "Any subset of user preference fields",
            properties: {
              backgroundType: { type: "string", enum: ["FLAT", "GRADIENT"] },
              backgroundColor: { type: "string", description: "Hex color (#RGB or #RRGGBB)" },
              backgroundGradientStart: { type: "string", description: "Hex color (#RGB or #RRGGBB)" },
              backgroundGradientEnd: { type: "string", description: "Hex color (#RGB or #RRGGBB)" },
              profilePictureRadius: { type: "string" },
              profilePictureBorderColor: { type: "string", description: "Hex color (#RGB or #RRGGBB)" },
              profilePictureBorderWidth: { type: "string" },
              slugTextColor: { type: "string", description: "Hex color (#RGB or #RRGGBB)" },
              slugTextWeight: { type: "string" },
              slugTextSize: { type: "string" },
              slugFontFamily: { type: "string" },
              headerTextColor: { type: "string", description: "Hex color (#RGB or #RRGGBB)" },
              headerTextWeight: { type: "string" },
              headerTextSize: { type: "string" },
              headerFontFamily: { type: "string" },
              linkBackgroundColor: { type: "string", description: "Hex color (#RGB or #RRGGBB)" },
              linkTextColor: { type: "string", description: "Hex color (#RGB or #RRGGBB)" },
              linkTextWeight: { type: "string" },
              linkTextSize: { type: "string" },
              linkFontFamily: { type: "string" },
              isLinkShadow: { type: "boolean" },
              linkShadowColor: { type: "string", description: "Hex color (#RGB or #RRGGBB)" },
              linkShadowWeight: { type: "string" },
              linkHoverBackgroundColor: { type: "string", description: "Hex color (#RGB or #RRGGBB)" },
              linkBorderRadius: { type: "string" },
              linkPadding: { type: "string" },
              showLinkCopyButton: { type: "boolean" },
              iconBackgroundColor: { type: "string", description: "Hex color (#RGB or #RRGGBB)" },
              isIconShadow: { type: "boolean" },
              iconShadowColor: { type: "string", description: "Hex color (#RGB or #RRGGBB)" },
              iconShadowWeight: { type: "string" },
              iconLogoColor: { type: "string", description: "Hex color (#RGB or #RRGGBB)" },
              iconHoverBackgroundColor: { type: "string", description: "Hex color (#RGB or #RRGGBB)" },
              dividerColor: { type: "string", description: "Hex color (#RGB or #RRGGBB)" },
              dividerThickness: { type: "string" },
              dividerStyle: { type: "string" },
              supportBanner: { type: "string", enum: ["NONE", "LGBTQ_RIGHTS", "ANTI_RACISM", "MENTAL_HEALTH", "CLIMATE_ACTION"] },
              enableGuestbook: { type: "boolean" },
            },
          },
        },
      },
    },
    responses: {
      200: { description: "Updated preferences" },
      400: { description: "Validation error" },
      401: { description: "Unauthenticated" },
      429: { description: "Rate limit exceeded" },
    },
  },
})
