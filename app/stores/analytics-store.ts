import type { CreateCommentInput } from "#shared/schemas/analytics-schema"

export const useAnalyticsStore = defineStore("analytics", () => {
  const toast = useToast()
  const pageViews = ref<PageView[]>([])
  const itemClicks = ref<ItemClick[]>([])
  const comments = ref<Comment[]>([])
  const loading = ref(false)

  async function getAnalytics(dateFrom?: string, dateTo?: string) {
    loading.value = true

    try {
      const query: Record<string, string> = {}
      if (dateFrom) {
        query.dateFrom = dateFrom
      }
      if (dateTo) {
        query.dateTo = dateTo
      }

      const res = await $fetch<{ data: { pageViews: PageView[], itemClicks: ItemClick[] } }>("/api/analytics", { method: "GET", query, credentials: "include" })
      pageViews.value = res.data.pageViews
      itemClicks.value = res.data.itemClicks
      return res
    }
    catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to fetch analytics data")
      toast.error(message)
      console.error("getAnalytics error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function recordPageView(slug: string, referrer?: string) {
    try {
      await $fetch("/api/analytics", { method: "POST", body: { type: "pageView", slug, referrer }, credentials: "include" })
    }
    catch (err: unknown) {
      console.error("recordPageView error:", err)
    }
  }

  async function recordItemClick(itemId: string) {
    try {
      await $fetch("/api/items/clicks", { method: "POST", body: { type: "itemClick", itemId }, credentials: "include" })
    }
    catch (err: unknown) {
      console.error("recordItemClick error:", err)
    }
  }

  async function deleteAnalytics(options?: { type?: "pageView" | "itemClick", dateFrom?: string, dateTo?: string }) {
    loading.value = true
    
    try {
      const query: Record<string, string> = {}
      if (options?.type) {
        query.type = options.type
      }
      if (options?.dateFrom) {
        query.dateFrom = options.dateFrom
      }
      if (options?.dateTo) {
        query.dateTo = options.dateTo
      }

      const res = await $fetch<{ success: boolean, message: string }>("/api/analytics", { method: "DELETE", query, credentials: "include" })
      toast.success(res.message || "Analytics records deleted successfully")
      return res
    }
    catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to delete analytics records")
      toast.error(message)
      console.error("deleteAnalytics error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function getComments() {
    loading.value = true

    try {
      const res = await $fetch<{ comments: Comment[] }>("/api/analytics/comments", { method: "GET", credentials: "include" })
      comments.value = res.comments
      return res
    }
    catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to read comments")
      toast.error(message)
      console.error("getComments error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function submitComment(data: CreateCommentInput) {
    loading.value = true

    try {
      const res = await $fetch<{ newComment: Comment }>("/api/analytics/comments", { method: "POST", body: data, credentials: "include" })
      comments.value.unshift(res.newComment)
      toast.success("Comment recorded successfully")
      return res
    }
    catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to record comment")
      toast.error(message)
      console.error("submitComment error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function deleteComment(id: string) {
    loading.value = true

    try {
      await $fetch(`/api/analytics/comments/${id}`, { method: "DELETE", credentials: "include" })
      comments.value = comments.value.filter(comment => comment.id !== id)
      toast.success("Comment deleted successfully")
    }
    catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to delete comment")
      toast.error(message)
      console.error("deleteComment error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  return {
    pageViews,
    itemClicks,
    comments,
    loading,
    getAnalytics,
    recordPageView,
    recordItemClick,
    deleteAnalytics,
    getComments,
    submitComment,
    deleteComment,
  }
})
