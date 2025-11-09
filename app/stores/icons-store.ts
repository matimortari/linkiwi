import type { CreateUserIconInput } from "~~/shared/schemas/icon-schema"

export const useIconsStore = defineStore("icons", () => {
  const icons = ref<Icon[]>([])
  const loading = ref<boolean>(false)
  const errors = ref<Record<"getIcons" | "createIcon" | "deleteIcon", string | null>>({
    getIcons: null,
    createIcon: null,
    deleteIcon: null,
  })

  async function getIcons() {
    loading.value = true
    errors.value.getIcons = null

    try {
      const res = await iconsService.getIcons()
      icons.value = res.icons
    }
    catch (err: any) {
      errors.value.getIcons = err?.message || "Failed to get icons"
      console.error("getIcons error:", err)
    }
    finally {
      loading.value = false
    }
  }

  async function createIcon(data: CreateUserIconInput) {
    loading.value = true
    errors.value.createIcon = null

    try {
      const res = await iconsService.createIcon(data)
      icons.value.push(res.icon)
    }
    catch (err: any) {
      errors.value.createIcon = err?.message || "Failed to create icon"
      console.error("createIcon error:", err)
    }
    finally {
      loading.value = false
    }
  }

  async function deleteIcon(id: string) {
    loading.value = true
    errors.value.deleteIcon = null

    try {
      await iconsService.deleteIcon(id)
      icons.value = icons.value.filter(icon => icon.id !== id)
    }
    catch (err: any) {
      errors.value.deleteIcon = err?.message || "Failed to delete icon"
      console.error("deleteIcon error:", err)
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
