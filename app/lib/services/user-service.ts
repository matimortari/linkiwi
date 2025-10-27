import type { UpdateUserInput, UpdateUserPreferencesInput } from "#shared/schemas/user"

export const userService = {
  /**
   * Fetch current authenticated user
   */
  getUser: async () => {
    const response = await $fetch(`${API_URL}/user`, {
      method: "GET",
      credentials: "include",
    })

    return response
  },

  /**
   * Get user by slug
   * @param slug User slug to fetch
   */
  getUserBySlug: async (slug: string) => {
    const response = await $fetch(`${API_URL}/user/${slug}`, {
      method: "GET",
    })

    return response
  },

  /**
   * Update current user
   * @param data Partial object with name/email
   */
  updateUser: async (data: UpdateUserInput) => {
    const response = await $fetch(`${API_URL}/user`, {
      method: "PUT",
      body: data,
      credentials: "include",
    })

    return response
  },

  /**
   * Update user preferences
   * @param data Partial object with preference settings
   */
  updatePreferences: async (data: UpdateUserPreferencesInput) => {
    const response = await $fetch(`${API_URL}/user/preferences`, {
      method: "PUT",
      body: data,
      credentials: "include",
    })

    return response
  },

  /**
   * Update user profile image
   * @param file Image file to upload (png, jpeg, or webp, max 5MB)
   */
  updateUserImage: async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await $fetch<{ imageUrl: string }>(`${API_URL}/user/image-upload`, {
      method: "PUT",
      body: formData,
      credentials: "include",
    })

    return response
  },

  /**
   * Delete current user
   */
  deleteUser: async () => {
    const response = await $fetch(`${API_URL}/user`, {
      method: "DELETE",
      credentials: "include",
    })

    return response
  },
}
