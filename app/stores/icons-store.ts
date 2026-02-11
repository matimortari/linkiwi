import type { CreateUserIconInput } from "#shared/schemas/icon-schema"

export const useIconsStore = defineStore("icons", () => {
  const icons = ref<Icon[]>([])
  const loading = ref(false)
  const errors = ref<Record<string, string | null>>({
    getIcons: null,
    createIcon: null,
    deleteIcon: null,
  })

  async function getIcons() {
    loading.value = true
    errors.value.getIcons = null

    try {
      const res = await $fetch<{ icons: Icon[] }>("/api/social-icons", { method: "GET", credentials: "include" })
      icons.value = res.icons.map(i => Object.freeze(i))
      return res
    }
    catch (err: any) {
      errors.value.getIcons = getErrorMessage(err, "Failed to get icons")
      console.error("getIcons error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function createIcon(data: CreateUserIconInput) {
    loading.value = true
    errors.value.createIcon = null

    try {
      const res = await $fetch<{ icon: Icon }>("/api/social-icons", { method: "POST", body: data, credentials: "include" })
      icons.value.push(Object.freeze(res.icon))
      return res
    }
    catch (err: any) {
      errors.value.createIcon = getErrorMessage(err, "Failed to create icon")
      console.error("createIcon error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function deleteIcon(id: string) {
    loading.value = true
    errors.value.deleteIcon = null

    try {
      await $fetch(`/api/social-icons/${id}`, { method: "DELETE", credentials: "include" })
      icons.value = icons.value.filter(icon => icon.id !== id)
    }
    catch (err: any) {
      errors.value.deleteIcon = getErrorMessage(err, "Failed to delete icon")
      console.error("deleteIcon error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  return {
    loading,
    errors,
    icons,
    getIcons,
    createIcon,
    deleteIcon,
  }
})
