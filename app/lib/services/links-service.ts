import type { CreateUserLinkInput, UpdateUserLinkInput } from "#shared/schemas/links"

export const linksService = {
  /**
   * Fetch all user links
   */
  getLinks: async () => {
    const response = await $fetch(`${API_URL}/links`, {
      method: "GET",
      credentials: "include",
    })

    return response
  },

  /**
   * Create a new link
   * @param data Link data with url and title
   */
  createLink: async (data: CreateUserLinkInput) => {
    const response = await $fetch(`${API_URL}/links`, {
      method: "POST",
      body: data,
      credentials: "include",
    })

    return response
  },

  /**
   * Update an existing link
   * @param id Link ID
   * @param data Partial link data to update
   */
  updateLink: async (id: string, data: UpdateUserLinkInput) => {
    const response = await $fetch(`${API_URL}/links/${id}`, {
      method: "PUT",
      body: data,
      credentials: "include",
    })

    return response
  },

  /**
   * Delete a link
   * @param id Link ID
   */
  deleteLink: async (id: string) => {
    const response = await $fetch(`${API_URL}/links/${id}`, {
      method: "DELETE",
      credentials: "include",
    })

    return response
  },
}
