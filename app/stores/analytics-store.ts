import type { CreateCommentInput } from "#shared/schemas/analytics-schema"

export const useAnalyticsStore = defineStore("analytics", () => {
  const toast = useToast()
  const analytics = ref<any>(null)
  const referrerStats = ref<any>(null)
  const loading = ref(false)

  async function getAnalytics() {
    loading.value = true

    try {
      const res = await $fetch("/api/analytics", { method: "GET", credentials: "include" })
      analytics.value = res
      return res
    }
    catch (err: any) {
      const message = getErrorMessage(err, "Failed to fetch analytics")
      toast.error(message)
      console.error("getAnalytics error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function getReferrerStats() {
    loading.value = true

    try {
      const res = await $fetch("/api/analytics/referrers", { method: "GET", credentials: "include" })
      referrerStats.value = res
      return res
    }
    catch (err: any) {
      const message = getErrorMessage(err, "Failed to get referrer stats")
      toast.error(message)
      console.error("getReferrerStats error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function recordPageView(userId: string, referrer?: string) {
    loading.value = true

    try {
      await $fetch("/api/analytics", { method: "POST", body: { type: "pageView", userId, referrer }, credentials: "include" })
    }
    catch (err: any) {
      const message = getErrorMessage(err, "Failed to record page view")
      toast.error(message)
      console.error("recordPageView error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function recordLinkClick(userId: string, linkId: string) {
    loading.value = true

    try {
      await $fetch("/api/analytics", { method: "POST", body: { type: "link", userId, id: linkId }, credentials: "include" })
    }
    catch (err: any) {
      const message = getErrorMessage(err, "Failed to record link click")
      toast.error(message)
      console.error("recordLinkClick error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function recordIconClick(userId: string, iconId: string) {
    loading.value = true

    try {
      await $fetch("/api/analytics", { method: "POST", body: { type: "icon", userId, id: iconId }, credentials: "include" })
    }
    catch (err: any) {
      const message = getErrorMessage(err, "Failed to record social icon click")
      toast.error(message)
      console.error("recordIconClick error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function submitComment(data: CreateCommentInput) {
    loading.value = true

    try {
      await $fetch("/api/analytics/comments", { method: "POST", body: data, credentials: "include" })
    }
    catch (err: any) {
      const message = getErrorMessage(err, "Failed to submit comment")
      toast.error(message)
      console.error("submitComment error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function deleteAnalytics(options?: { type?: "pageView" | "linkClick" | "iconClick", dateFrom?: string, dateTo?: string }) {
    loading.value = true

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

      await $fetch<{ success: boolean, message: string }>(params.toString() ? `/api/analytics?${params.toString()}` : "/api/analytics", { method: "DELETE", credentials: "include" })
    }
    catch (err: any) {
      const message = getErrorMessage(err, "Failed to delete analytics")
      toast.error(message)
      console.error("deleteAnalytics error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  return {
    loading,
    analytics,
    referrerStats,
    getAnalytics,
    getReferrerStats,
    recordPageView,
    recordLinkClick,
    recordIconClick,
    submitComment,
    deleteAnalytics,
  }
})
