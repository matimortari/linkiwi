import type { AnalyticsRecordSchema } from "#shared/schemas/analytics"

export const analyticsService = {
  /**
   * Fetch analytics data for the current user
   */
  getAnalytics: async () => {
    const response = await $fetch(`${API_URL}/analytics`, {
      method: "GET",
      credentials: "include",
    })

    return response
  },

  /**
   * Record a page view
   * @param userId User ID to record the page view for
   */
  recordPageView: async (userId: string) => {
    const response = await $fetch(`${API_URL}/analytics`, {
      method: "POST",
      body: {
        type: "pageView",
        userId,
      } satisfies AnalyticsRecordSchema,
      credentials: "include",
    })

    return response
  },

  /**
   * Record a link click
   * @param userId User ID associated with the link
   * @param linkId Link ID that was clicked
   */
  recordLinkClick: async (userId: string, linkId: string) => {
    const response = await $fetch(`${API_URL}/analytics`, {
      method: "POST",
      body: {
        type: "link",
        userId,
        id: linkId,
      } satisfies AnalyticsRecordSchema,
      credentials: "include",
    })

    return response
  },

  /**
   * Record a social icon click
   * @param userId User ID associated with the icon
   * @param iconId Icon ID that was clicked
   */
  recordIconClick: async (userId: string, iconId: string) => {
    const response = await $fetch(`${API_URL}/analytics`, {
      method: "POST",
      body: {
        type: "icon",
        userId,
        id: iconId,
      } satisfies AnalyticsRecordSchema,
      credentials: "include",
    })

    return response
  },

  /**
   * Delete analytics data
   * @param options Optional filters for deletion
   * @param options.type Type of analytics to delete (pageView, linkClick, iconClick). If omitted, deletes all types.
   * @param options.dateFrom Start date for deletion range (ISO string)
   * @param options.dateTo End date for deletion range (ISO string)
   */
  deleteAnalytics: async (options?: { type?: "pageView" | "linkClick" | "iconClick", dateFrom?: string, dateTo?: string }) => {
    const params = new URLSearchParams()
    if (options?.type) {
      params.append("type", options.type)
    }
    if (options?.dateFrom) {
      params.append("dateFrom", options.dateFrom)
    }
    if (options?.dateTo) {
      params.append("dateTo", options.dateTo)
    }
    const response = await $fetch<{ success: boolean, message: string, deletedCount: number }>(params.toString() ? `${API_URL}/analytics?${params.toString()}` : `${API_URL}/analytics`, {
      method: "DELETE",
      credentials: "include",
    })

    return response
  },
}
