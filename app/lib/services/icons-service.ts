import type { CreateUserIconInput } from "#shared/lib/schemas/icon-schema"

export const iconsService = {
  /**
   * Fetch all user icons
   */
  getIcons: async () => {
    const res = await $fetch(`${API_URL}/icons`, {
      method: "GET",
      credentials: "include",
    })

    return res
  },

  /**
   * Create a new icon
   * @param data Icon data with url, platform, and logo
   */
  createIcon: async (data: CreateUserIconInput) => {
    const res = await $fetch(`${API_URL}/icons`, {
      method: "POST",
      body: data,
      credentials: "include",
    })

    return res
  },

  /**
   * Delete an icon
   * @param id Icon ID
   */
  deleteIcon: async (id: string) => {
    const res = await $fetch(`${API_URL}/icons/${id}`, {
      method: "DELETE",
      credentials: "include",
    })

    return res
  },
}
