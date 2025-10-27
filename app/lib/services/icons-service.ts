import type { CreateUserIconInput } from "#shared/schemas/icons"

export const iconsService = {
  /**
   * Fetch all user icons
   */
  getIcons: async () => {
    const response = await $fetch(`${API_URL}/icons`, {
      method: "GET",
      credentials: "include",
    })

    return response
  },

  /**
   * Create a new icon
   * @param data Icon data with url, platform, and logo
   */
  createIcon: async (data: CreateUserIconInput) => {
    const response = await $fetch(`${API_URL}/icons`, {
      method: "POST",
      body: data,
      credentials: "include",
    })

    return response
  },

  /**
   * Delete an icon
   * @param id Icon ID
   */
  deleteIcon: async (id: string) => {
    const response = await $fetch(`${API_URL}/icons/${id}`, {
      method: "DELETE",
      credentials: "include",
    })

    return response
  },
}
