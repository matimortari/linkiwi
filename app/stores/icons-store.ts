import type { CreateUserIconInput, UpdateUserIconInput } from "#shared/schemas/icon-schema"

export const useIconsStore = defineStore("icons", () => {
  const toast = useToast()
  const icons = ref<Icon[]>([])
  const loading = ref(false)

  async function getIcons() {
    loading.value = true

    try {
      const res = await $fetch<{ icons: Icon[] }>("/api/social-icons", { method: "GET", credentials: "include" })
      icons.value = res.icons.map(i => Object.freeze(i))
      return res
    }
    catch (err: any) {
      const message = getErrorMessage(err, "Failed to get icons")
      toast.error(message)
      console.error("getIcons error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function createIcon(data: CreateUserIconInput) {
    loading.value = true

    try {
      const res = await $fetch<{ icon: Icon }>("/api/social-icons", { method: "POST", body: data, credentials: "include" })
      icons.value.push(Object.freeze(res.icon))
      return res
    }
    catch (err: any) {
      const message = getErrorMessage(err, "Failed to create icon")
      toast.error(message)
      console.error("createIcon error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function updateIcon(id: string, data: UpdateUserIconInput) {
    loading.value = true

    try {
      const res = await $fetch<{ icon: Icon }>(`/api/social-icons/${id}`, { method: "PUT", body: data, credentials: "include" })
      const index = icons.value.findIndex(icon => icon.id === id)
      if (index !== -1) {
        icons.value[index] = Object.freeze(res.icon)
      }
      return res
    }
    catch (err: any) {
      const message = getErrorMessage(err, "Failed to update icon")
      toast.error(message)
      console.error("updateIcon error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function deleteIcon(id: string) {
    loading.value = true

    try {
      await $fetch(`/api/social-icons/${id}`, { method: "DELETE", credentials: "include" })
      icons.value = icons.value.filter(icon => icon.id !== id)
    }
    catch (err: any) {
      const message = getErrorMessage(err, "Failed to delete icon")
      toast.error(message)
      console.error("deleteIcon error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  return {
    loading,
    icons,
    getIcons,
    createIcon,
    updateIcon,
    deleteIcon,
  }
})
