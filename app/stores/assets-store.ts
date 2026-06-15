export const useAssetsStore = defineStore("assets", () => {
  const toast = useToast()
  const assets = ref<UserAsset[]>([])
  const loading = ref(false)

  async function getAssets() {
    loading.value = true

    try {
      const res = await $fetch<{ assets: UserAsset[] }>("/api/photos", { method: "GET", credentials: "include" })
      assets.value = res.assets
      return res
    }
    catch (err) {
      const message = getErrorMessage(err, "Failed to list media manager repository assets")
      toast.error(message)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function uploadAsset(file: File) {
    loading.value = true

    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await $fetch<{ success: boolean, newAsset: UserAsset }>("/api/photos", { method: "POST", body: formData, credentials: "include" })
      assets.value.unshift(res.newAsset)
      toast.success("Image uploaded successfully")
      return res
    }
    catch (err) {
      const message = getErrorMessage(err, "Failed to upload image")
      toast.error(message)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function deleteAsset(id: string) {
    loading.value = true

    try {
      await $fetch(`/api/photos/${id}`, { method: "DELETE", credentials: "include" })
      assets.value = assets.value.filter(asset => asset.id !== id)
      toast.success("Image deleted successfully")
    }
    catch (err) {
      const message = getErrorMessage(err, "Failed to delete image")
      toast.error(message)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  return {
    assets,
    loading,
    getAssets,
    uploadAsset,
    deleteAsset,
  }
})
