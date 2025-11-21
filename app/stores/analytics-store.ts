import type { AnalyticsRecordSchema } from "~~/shared/schemas/analytics-schema"

export const useAnalyticsStore = defineStore("analytics", () => {
  const analytics = ref<any>(null)
  const loading = ref<boolean>(false)
  const errors = ref<Record<"getAnalytics" | "recordPageView" | "recordLinkClick" | "recordIconClick" | "deleteAnalytics", string | null>>({
    getAnalytics: null,
    recordPageView: null,
    recordLinkClick: null,
    recordIconClick: null,
    deleteAnalytics: null,
  })

  async function getAnalytics() {
    loading.value = true
    errors.value.getAnalytics = null
    try {
      const res = await $fetch(`${API_URL}/analytics`, {
        method: "GET",
        credentials: "include",
      })
      analytics.value = res
      return res
    }
    catch (err: any) {
      errors.value.getAnalytics = err?.message || "Failed to fetch analytics"
      console.error("getAnalytics error:", err)
    }
    finally {
      loading.value = false
    }
  }

  async function recordPageView(userId: string) {
    loading.value = true
    errors.value.recordPageView = null
    try {
      const res = await $fetch(`${API_URL}/analytics`, {
        method: "POST",
        body: {
          type: "pageView",
          userId,
        } satisfies AnalyticsRecordSchema,
        credentials: "include",
      })
      return res
    }
    catch (err: any) {
      errors.value.recordPageView = err?.message || "Failed to record page view"
      console.error("recordPageView error:", err)
    }
    finally {
      loading.value = false
    }
  }

  async function recordLinkClick(userId: string, linkId: string) {
    loading.value = true
    errors.value.recordLinkClick = null
    try {
      const res = await $fetch(`${API_URL}/analytics`, {
        method: "POST",
        body: {
          type: "link",
          userId,
          id: linkId,
        } satisfies AnalyticsRecordSchema,
        credentials: "include",
      })
      return res
    }
    catch (err: any) {
      errors.value.recordLinkClick = err?.message || "Failed to record link click"
      console.error("recordLinkClick error:", err)
    }
    finally {
      loading.value = false
    }
  }

  async function recordIconClick(userId: string, iconId: string) {
    loading.value = true
    errors.value.recordIconClick = null
    try {
      const res = await $fetch(`${API_URL}/analytics`, {
        method: "POST",
        body: {
          type: "icon",
          userId,
          id: iconId,
        } satisfies AnalyticsRecordSchema,
        credentials: "include",
      })
      return res
    }
    catch (err: any) {
      errors.value.recordIconClick = err?.message || "Failed to record icon click"
      console.error("recordIconClick error:", err)
    }
    finally {
      loading.value = false
    }
  }

  async function deleteAnalytics(options?: { type?: "pageView" | "linkClick" | "iconClick", dateFrom?: string, dateTo?: string }) {
    loading.value = true
    errors.value.deleteAnalytics = null
    try {
      const params = new URLSearchParams()
      if (options?.type)
        params.append("type", options.type)
      if (options?.dateFrom)
        params.append("dateFrom", options.dateFrom)
      if (options?.dateTo)
        params.append("dateTo", options.dateTo)
      const res = await $fetch<{ success: boolean, message: string, deletedCount: number }>(params.toString() ? `${API_URL}/analytics?${params.toString()}` : `${API_URL}/analytics`, {
        method: "DELETE",
        credentials: "include",
      })
      return res
    }
    catch (err: any) {
      errors.value.deleteAnalytics = err?.message || "Failed to delete analytics"
      console.error("deleteAnalytics error:", err)
    }
    finally {
      loading.value = false
    }
  }

  return {
    analytics,
    loading,
    errors,
    getAnalytics,
    recordPageView,
    recordLinkClick,
    recordIconClick,
    deleteAnalytics,
  }
})
