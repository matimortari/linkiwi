import type { UpdateUserInput, UpdateUserPreferencesInput } from "#shared/lib/schemas/user-schema"

export const userService = {
  /**
   * Fetch current authenticated user
   */
  getUser: async () => {
    const res = await $fetch(`${API_URL}/user`, {
      method: "GET",
      credentials: "include",
    })

    return res
  },

  /**
   * Get user by slug
   * @param slug User slug to fetch
   */
  getUserBySlug: async (slug: string) => {
    const res = await $fetch(`${API_URL}/user/${slug}`, {
      method: "GET",
    })

    return res
  },

  /**
   * Update current user
   * @param data Partial object with name/email
   */
  updateUser: async (data: UpdateUserInput) => {
    const res = await $fetch(`${API_URL}/user`, {
      method: "PUT",
      body: data,
      credentials: "include",
    })

    return res
  },

  /**
   * Update user preferences
   * @param data Partial object with preference settings
   */
  updatePreferences: async (data: UpdateUserPreferencesInput) => {
    const res = await $fetch(`${API_URL}/user/preferences`, {
      method: "PUT",
      body: data,
      credentials: "include",
    })

    return res
  },

  /**
   * Update user profile image
   * @param file Image file to upload (png, jpeg, or webp, max 5MB)
   */
  updateUserImage: async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)

    const res = await $fetch<{ imageUrl: string }>(`${API_URL}/user/image-upload`, {
      method: "PUT",
      body: formData,
      credentials: "include",
    })

    return res
  },

  /**
   * Delete current user
   */
  deleteUser: async () => {
    const res = await $fetch(`${API_URL}/user`, {
      method: "DELETE",
      credentials: "include",
    })

    return res
  },
}
