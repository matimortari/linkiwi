import type { CreateUserLinkInput, UpdateUserLinkInput } from "#shared/schemas/links"

export const useLinksStore = defineStore("links", () => {
  const links = ref<Link[]>([])
  const loading = ref<boolean>(false)
  const errors = ref<Record<"getLinks" | "createLink" | "updateLink" | "deleteLink", string | null>>({
    getLinks: null,
    createLink: null,
    updateLink: null,
    deleteLink: null,
  })

  async function getLinks() {
    loading.value = true
    errors.value.getLinks = null

    try {
      const res = await linksService.getLinks()
      links.value = res.links
    }
    catch (err: any) {
      errors.value.getLinks = err?.message || "Failed to get links"
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
      const res = await linksService.createLink(data) as unknown as {
        link: Link
      }
      links.value.push(res.link)
    }
    catch (err: any) {
      errors.value.createLink = err?.message || "Failed to create link"
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
      const res = await linksService.updateLink(id, data) as unknown as {
        link: Link
      }
      const index = links.value.findIndex(link => link.id === id)
      if (index !== -1) {
        links.value[index] = res.link
      }
    }
    catch (err: any) {
      errors.value.updateLink = err?.message || "Failed to update link"
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
      await linksService.deleteLink(id)
      links.value = links.value.filter(link => link.id !== id)
    }
    catch (err: any) {
      errors.value.deleteLink = err?.message || "Failed to delete link"
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
