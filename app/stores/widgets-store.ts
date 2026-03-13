import type { CreateWidgetInput, UpdateWidgetInput } from "#shared/schemas/widget-schema"

export const useWidgetsStore = defineStore("widgets", () => {
  const toast = useToast()
  const widgets = ref<Widget[]>([])
  const loading = ref(false)

  async function getWidgets() {
    loading.value = true

    try {
      const res = await $fetch<{ widgets: Widget[] }>("/api/widgets", { method: "GET", credentials: "include" })
      widgets.value = res.widgets.map(w => Object.freeze(w))
      return res
    }
    catch (err: any) {
      const message = getErrorMessage(err, "Failed to get widgets")
      toast.error(message)
      console.error("getWidgets error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function createWidget(data: CreateWidgetInput) {
    loading.value = true

    try {
      const res = await $fetch<{ widget: Widget }>("/api/widgets", { method: "POST", body: data, credentials: "include" })
      widgets.value.push(Object.freeze(res.widget))
      return res
    }
    catch (err: any) {
      const message = getErrorMessage(err, "Failed to create widget")
      toast.error(message)
      console.error("createWidget error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function updateWidget(id: string, data: UpdateWidgetInput) {
    loading.value = true

    try {
      const res = await $fetch<{ widget: Widget }>(`/api/widgets/${id}`, { method: "PUT", body: data, credentials: "include" })
      const index = widgets.value.findIndex(w => w.id === id)
      if (index !== -1) {
        widgets.value[index] = Object.freeze(res.widget)
      }
      return res
    }
    catch (err: any) {
      const message = getErrorMessage(err, "Failed to update widget")
      toast.error(message)
      console.error("updateWidget error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function deleteWidget(id: string) {
    loading.value = true

    try {
      await $fetch(`/api/widgets/${id}`, { method: "DELETE", credentials: "include" })
      widgets.value = widgets.value.filter(w => w.id !== id)
    }
    catch (err: any) {
      const message = getErrorMessage(err, "Failed to delete widget")
      toast.error(message)
      console.error("deleteWidget error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function getGitHubData(handle: string) {
    loading.value = true

    try {
      const res = await $fetch<{ data: any }>("/api/widgets/fetch/github", { method: "GET", query: { handle } })
      return res
    }
    catch (err: any) {
      const message = getErrorMessage(err, "Failed to fetch GitHub data")
      toast.error(message)
      console.error("getGitHubData error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function getYouTubeData(handle: string) {
    loading.value = true

    try {
      const res = await $fetch<{ data: any }>("/api/widgets/fetch/youtube", { method: "GET", query: { handle } })
      return res
    }
    catch (err: any) {
      const message = getErrorMessage(err, "Failed to fetch YouTube data")
      toast.error(message)
      console.error("getYouTubeData error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  return {
    loading,
    widgets,
    getWidgets,
    createWidget,
    updateWidget,
    deleteWidget,
    getGitHubData,
    getYouTubeData,
  }
})
