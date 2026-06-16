import type { CreateProfileItemInput, UpdateProfileItemInput } from "#shared/schemas/profile-item-schema"

export const useProfileItemsStore = defineStore("profile-items", () => {
  const toast = useToast()
  const items = ref<any[]>([])
  const loading = ref(false)
  const widgetLoading = ref<Record<WidgetType, boolean>>({ GITHUB: false, YOUTUBE: false, SPOTIFY: false })
  const widgetError = ref<Record<WidgetType, boolean>>({ GITHUB: false, YOUTUBE: false, SPOTIFY: false })

  async function getItems() {
    loading.value = true

    try {
      const res = await $fetch<{ items: ProfileItem[] }>("/api/items", { method: "GET", credentials: "include" })
      items.value = res.items
      return res
    }
    catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to get profile items")
      toast.error(message)
      console.error("getItems error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function createItem(data: CreateProfileItemInput) {
    loading.value = true

    try {
      const res = await $fetch<{ newItem: ProfileItem }>("/api/items", { method: "POST", body: data, credentials: "include" })
      items.value.push(res.newItem)
      return res
    }
    catch (err: unknown) {
      const message = getErrorMessage(err, `Failed to create ${data.type.toLowerCase()} item`)
      toast.error(message)
      console.error("createItem error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function updateItem(id: string, data: UpdateProfileItemInput) {
    loading.value = true
    try {
      const res = await $fetch<{ updatedItem: ProfileItem }>(`/api/items/${id}`, { method: "PUT", body: data, credentials: "include" })
      const index = items.value.findIndex(item => item.id === id)
      if (index !== -1) {
        items.value[index] = res.updatedItem
      }
      return res
    }
    catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to update profile item")
      toast.error(message)
      console.error("updateItem error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function deleteItem(id: string) {
    loading.value = true

    try {
      await $fetch(`/api/items/${id}`, { method: "DELETE", credentials: "include" })
      items.value = items.value.filter(item => item.id !== id)
    }
    catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to delete profile item")
      toast.error(message)
      console.error("deleteItem error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function getWidgetData(platform: WidgetType, handle: string) {
    widgetLoading.value[platform] = true
    widgetError.value[platform] = false

    try {
      const res = await $fetch<{ data: any }>(`/api/widgets/${platform.toLowerCase()}`, { method: "GET", query: { handle } })
      return res
    }
    catch (err: unknown) {
      const message = getErrorMessage(err, `Failed to fetch data for ${platform}"`)
      toast.error(message)
      console.error(`getWidgetData(${platform}) error:`, err)
      widgetError.value[platform] = true
      throw err
    }
    finally {
      widgetLoading.value[platform] = false
    }
  }

  return {
    items,
    loading,
    widgetLoading,
    widgetError,
    getItems,
    createItem,
    updateItem,
    deleteItem,
    getWidgetData,
  }
})
