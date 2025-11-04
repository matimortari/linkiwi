import type { CreateUserLinkInput, UpdateUserLinkInput } from "#shared/lib/schemas/link-schema"

export const linksService = {
  /**
   * Fetch all user links
   */
  getLinks: async () => {
    const res = await $fetch(`${API_URL}/links`, {
      method: "GET",
      credentials: "include",
    })

    return res
  },

  /**
   * Create a new link
   * @param data Link data with url and title
   */
  createLink: async (data: CreateUserLinkInput) => {
    const res = await $fetch(`${API_URL}/links`, {
      method: "POST",
      body: data,
      credentials: "include",
    })

    return res
  },

  /**
   * Update an existing link
   * @param id Link ID
   * @param data Partial link data to update
   */
  updateLink: async (id: string, data: UpdateUserLinkInput) => {
    const res = await $fetch(`${API_URL}/links/${id}`, {
      method: "PUT",
      body: data,
      credentials: "include",
    })

    return res
  },

  /**
   * Delete a link
   * @param id Link ID
   */
  deleteLink: async (id: string) => {
    const res = await $fetch(`${API_URL}/links/${id}`, {
      method: "DELETE",
      credentials: "include",
    })

    return res
  },
}
