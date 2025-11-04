import type { CreateUserLinkInput, UpdateUserLinkInput } from "#shared/lib/schemas/link-schema"

export function useLinkActions() {
  const linksStore = useLinksStore()

  const links = computed(() => linksStore.links)
  const loading = computed(() => linksStore.loading)
  const errors = computed(() => linksStore.errors)

  /**
   * Fetch all user links
   */
  const fetchLinks = async () => {
    await linksStore.getLinks()
  }

  /**
   * Create a new user link
   * @param data Link data to create (url and title)
   */
  const createLink = async (data: CreateUserLinkInput) => {
    await linksStore.createLink(data)
  }

  /**
   * Update an existing user link
   * @param id Link ID to update
   * @param data Link data to update (url and/or title)
   */
  const updateLink = async (id: string, data: UpdateUserLinkInput) => {
    await linksStore.updateLink(id, data)
  }

  /**
   * Delete a user link
   * @param id Link ID to delete
   */
  const deleteLink = async (id: string) => {
    await linksStore.deleteLink(id)
  }

  return {
    links,
    loading,
    errors,
    fetchLinks,
    createLink,
    updateLink,
    deleteLink,
  }
}
