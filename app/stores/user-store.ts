import type { UpdateUserInput, UpdateUserPreferencesInput, UserBannerInput } from "#shared/schemas/user-schema"

export const useUserStore = defineStore("user", () => {
  const toast = useToast()
  const user = ref<User | null>(null)
  const userProfile = ref<User | null>(null)
  const preferences = computed(() => user.value?.preferences ?? DEFAULT_PREFERENCES)
  const assets = ref<UserAsset[]>([])
  const loading = ref(false)

  async function getUser() {
    loading.value = true

    try {
      const res = await $fetch<{ user: User }>("/api/user", { method: "GET", credentials: "include" })
      user.value = res.user
      return res
    }
    catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to get user")
      toast.error(message)
      console.error("getUser error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function getUserProfile(slug: string) {
    loading.value = true

    try {
      const res = await $fetch<{ profile: User }>(`/api/profiles/${slug}`, { method: "GET" })
      userProfile.value = res.profile
      return res
    }
    catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to get user profile")
      toast.error(message)
      console.error("getUserProfile error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function updateUser(data: UpdateUserInput) {
    loading.value = true

    try {
      const res = await $fetch<{ updatedUser: User }>("/api/user", { method: "PUT", body: data, credentials: "include" })
      user.value = res.updatedUser
      return res
    }
    catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to update user")
      toast.error(message)
      console.error("updateUser error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function updateUserImage(file: File) {
    loading.value = true

    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await $fetch<{ imageUrl: string }>("/api/user/image", { method: "PUT", body: formData, credentials: "include" })
      if (user.value && res.imageUrl) {
        user.value.image = res.imageUrl
      }
      return res
    }
    catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to update user image")
      toast.error(message)
      console.error("updateUserImage error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function updateUserBanner(data: UserBannerInput) {
    loading.value = true

    try {
      const res = await $fetch<{ banner: UserBanner }>("/api/user/banner", { method: "PUT", body: data, credentials: "include" })
      if (user.value && res.banner) {
        user.value.banner = res.banner
      }
      return res
    }
    catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to update banner")
      toast.error(message)
      console.error("updateUserBanner error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function updatePreferences(data: UpdateUserPreferencesInput) {
    loading.value = true

    try {
      const res = await $fetch<{ updatedPreferences: UpdateUserPreferencesInput }>("/api/user/preferences", { method: "PUT", body: data, credentials: "include" })
      if (user.value && res.updatedPreferences) {
        user.value.preferences = res.updatedPreferences as typeof user.value.preferences
      }
      return res
    }
    catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to update preferences")
      toast.error(message)
      console.error("updatePreferences error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function getAssets() {
    loading.value = true

    try {
      const res = await $fetch<{ assets: UserAsset[] }>("/api/user/uploads", { method: "GET", credentials: "include" })
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
      const res = await $fetch<{ success: boolean, newAsset: UserAsset }>("/api/user/uploads", { method: "POST", body: formData, credentials: "include" })
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
      await $fetch(`/api/user/uploads/${id}`, { method: "DELETE", credentials: "include" })
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

  async function deleteUser() {
    loading.value = true

    try {
      await $fetch("/api/user", { method: "DELETE", credentials: "include" })
      user.value = null
    }
    catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to delete user")
      toast.error(message)
      console.error("deleteUser error:", err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  return {
    loading,
    user,
    userProfile,
    preferences,
    assets,
    getUser,
    getUserProfile,
    updateUser,
    updateUserImage,
    updateUserBanner,
    updatePreferences,
    getAssets,
    uploadAsset,
    deleteAsset,
    deleteUser,
  }
})
