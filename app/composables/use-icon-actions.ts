import type { CreateUserIconInput } from "#shared/schemas/icon-schema"

export function useIconActions() {
  const iconsStore = useIconsStore()

  const icons = computed(() => iconsStore.icons)
  const loading = computed(() => iconsStore.loading)
  const errors = computed(() => iconsStore.errors)

  /**
   * Fetch all user icons
   */
  const fetchIcons = async () => {
    await iconsStore.getIcons()
  }

  /**
   * Create a new user icon
   * @param data Icon data to create (url, platform, and logo)
   */
  const createIcon = async (data: CreateUserIconInput) => {
    await iconsStore.createIcon(data)
  }

  /**
   * Delete a user icon
   * @param id Icon ID to delete
   */
  const deleteIcon = async (id: string) => {
    await iconsStore.deleteIcon(id)
  }

  return {
    icons,
    loading,
    errors,
    fetchIcons,
    createIcon,
    deleteIcon,
  }
}
