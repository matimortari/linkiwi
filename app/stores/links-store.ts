import type { CreateUserLinkInput, UpdateUserLinkInput } from "#shared/schemas/link-schema"

export const useLinksStore = defineStore("links", () => {
  const toast = useToast()
  const links = ref<Link[]>([])
  const loading = ref(false)

  async function getLinks() {
    loading.value = true

    try {
      const res = await $fetch<{ links: Link[] }>("/api/links", { method: "GET", credentials: "include" })
      links.value = res.links.map(i => Object.freeze(i))
      return res
    }
    catch (err: any) {
      const message = getErrorMessage(err, "Failed to get links")
      toast.error(message)
      console.error("getLinks error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function createLink(data: CreateUserLinkInput) {
    loading.value = true

    try {
      const res = await $fetch<{ link: Link }>("/api/links", { method: "POST", body: data, credentials: "include" })
      links.value.push(Object.freeze(res.link))
      return res
    }
    catch (err: any) {
      const message = getErrorMessage(err, "Failed to create link")
      toast.error(message)
      console.error("createLink error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function updateLink(id: string, data: UpdateUserLinkInput) {
    loading.value = true

    try {
      const res = await $fetch<{ link: Link }>(`/api/links/${id}`, { method: "PUT", body: data, credentials: "include" })
      const index = links.value.findIndex(link => link.id === id)
      if (index !== -1) {
        links.value[index] = Object.freeze(res.link)
      }
      return res
    }
    catch (err: any) {
      const message = getErrorMessage(err, "Failed to update link")
      toast.error(message)
      console.error("updateLink error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function deleteLink(id: string) {
    loading.value = true

    try {
      await $fetch(`/api/links/${id}`, { method: "DELETE", credentials: "include" })
      links.value = links.value.filter(link => link.id !== id)
    }
    catch (err: any) {
      const message = getErrorMessage(err, "Failed to delete link")
      toast.error(message)
      console.error("deleteLink error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  return {
    loading,
    links,
    getLinks,
    createLink,
    updateLink,
    deleteLink,
  }
})
