export const useAnalyticsStore = defineStore("analytics", () => {
  const analytics = ref<any>(null)
  const loading = ref<boolean>(false)
  const errors = ref<Record<string, string | null>>({ getAnalytics: null, recordPageView: null, recordLinkClick: null, recordIconClick: null, deleteAnalytics: null })

  async function getAnalytics() {
    loading.value = true
    errors.value.getAnalytics = null

    try {
      analytics.value = await $fetch(`${API_URL}/analytics`, { method: "GET", credentials: "include" })
    }
    catch (err: any) {
      errors.value.getAnalytics = err.data.message || "Failed to fetch analytics"
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
      await $fetch(`${API_URL}/analytics`, { method: "POST", body: { type: "pageView", userId }, credentials: "include" })
    }
    catch (err: any) {
      errors.value.recordPageView = err.data.message || "Failed to record page view"
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
      await $fetch(`${API_URL}/analytics`, { method: "POST", body: { type: "link", userId, id: linkId }, credentials: "include" })
    }
    catch (err: any) {
      errors.value.recordLinkClick = err.data.message || "Failed to record link click"
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
      await $fetch(`${API_URL}/analytics`, { method: "POST", body: { type: "icon", userId, id: iconId }, credentials: "include" })
    }
    catch (err: any) {
      errors.value.recordIconClick = err.data.message || "Failed to record icon click"
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
      if (options?.type) {
        params.append("type", options.type)
      }
      if (options?.dateFrom) {
        params.append("dateFrom", options.dateFrom)
      }
      if (options?.dateTo) {
        params.append("dateTo", options.dateTo)
      }

      await $fetch<{ success: boolean, message: string, deletedCount: number }>(params.toString() ? `${API_URL}/analytics?${params.toString()}` : `${API_URL}/analytics`, { method: "DELETE", credentials: "include" })
    }
    catch (err: any) {
      errors.value.deleteAnalytics = err.data.message || "Failed to delete analytics"
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
