import type { CreateWidgetInput, UpdateWidgetInput, WidgetType } from "#shared/schemas/widget-schema"

export const useWidgetsStore = defineStore("widgets", () => {
  const toast = useToast()
  const widgets = ref<Widget[]>([])
  const loading = ref(false)
  const widgetLoading = ref<Record<WidgetType, boolean>>({ GITHUB: false, YOUTUBE: false, SPOTIFY: false })
  const widgetError = ref<Record<WidgetType, boolean>>({ GITHUB: false, YOUTUBE: false, SPOTIFY: false })

  async function getWidgets() {
    loading.value = true

    try {
      const res = await $fetch<{ widgets: Widget[] }>("/api/widgets", { method: "GET", credentials: "include" })
      widgets.value = res.widgets
      return res
    }
    catch (err: unknown) {
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
      widgets.value.push(res.widget)
      return res
    }
    catch (err: unknown) {
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
        widgets.value[index] = res.widget
      }
      return res
    }
    catch (err: unknown) {
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
    catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to delete widget")
      toast.error(message)
      console.error("deleteWidget error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function getWidgetData(type: WidgetType, handle: string) {
    widgetLoading.value[type] = true
    widgetError.value[type] = false

    try {
      const endpoint = `/api/widgets/fetch/${type.toLowerCase()}`
      const res = await $fetch<{ data: any }>(endpoint, { method: "GET", query: { handle } })
      return res
    }
    catch (err: unknown) {
      const message = getErrorMessage(err, `Failed to fetch ${type.toLowerCase()} data`)
      toast.error(message)
      console.error(`getWidgetData(${type}) error:`, err)
      widgetError.value[type] = true
      throw err
    }
    finally {
      widgetLoading.value[type] = false
    }
  }

  return {
    loading,
    widgetLoading,
    widgetError,
    widgets,
    getWidgets,
    createWidget,
    updateWidget,
    deleteWidget,
    getWidgetData,
  }
})
