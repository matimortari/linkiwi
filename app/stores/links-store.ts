import type { CreateUserLinkInput, UpdateUserLinkInput } from "#shared/schemas/link-schema"

export const useLinksStore = defineStore("links", () => {
  const links = ref<Link[]>([])
  const loading = ref<boolean>(false)
  const errors = ref<Record<string, string | null>>({ getLinks: null, createLink: null, updateLink: null, deleteLink: null })

  async function getLinks() {
    loading.value = true
    errors.value.getLinks = null

    try {
      const res = await $fetch<{ links: Link[] }>(`${API_URL}/links`, { method: "GET", credentials: "include" })
      links.value = res.links.map(i => Object.freeze(i))
    }
    catch (err: any) {
      errors.value.getLinks = err.data.message || "Failed to get links"
      console.error("getLinks error:", err)
    }
    finally {
      loading.value = false
    }
  }

  async function createLink(data: CreateUserLinkInput) {
    loading.value = true
    errors.value.createLink = null

    try {
      const res = await $fetch<{ link: Link }>(`${API_URL}/links`, { method: "POST", body: data, credentials: "include" })
      links.value.push(Object.freeze(res.link))
    }
    catch (err: any) {
      errors.value.createLink = err.data.message || "Failed to create link"
      console.error("createLink error:", err)
    }
    finally {
      loading.value = false
    }
  }

  async function updateLink(id: string, data: UpdateUserLinkInput) {
    loading.value = true
    errors.value.updateLink = null

    try {
      const res = await $fetch<{ link: Link }>(`${API_URL}/links/${id}`, { method: "PUT", body: data, credentials: "include" })
      const index = links.value.findIndex(link => link.id === id)
      if (index !== -1) {
        links.value[index] = res.link
      }
    }
    catch (err: any) {
      errors.value.updateLink = err.data.message || "Failed to update link"
      console.error("updateLink error:", err)
    }
    finally {
      loading.value = false
    }
  }

  async function deleteLink(id: string) {
    loading.value = true
    errors.value.deleteLink = null

    try {
      await $fetch(`${API_URL}/links/${id}`, { method: "DELETE", credentials: "include" })
      links.value = links.value.filter(link => link.id !== id)
    }
    catch (err: any) {
      errors.value.deleteLink = err.data.message || "Failed to delete link"
      console.error("deleteLink error:", err)
    }
    finally {
      loading.value = false
    }
  }

  return {
    loading,
    errors,
    links,
    getLinks,
    createLink,
    updateLink,
    deleteLink,
  }
})
