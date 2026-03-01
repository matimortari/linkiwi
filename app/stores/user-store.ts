import type { UpdateUserInput, UpdateUserPreferencesInput } from "#shared/schemas/user-schema"

export const useUserStore = defineStore("user", () => {
  const toast = useToast()
  const user = ref<User | null>(null)
  const userProfile = ref<User | null>(null)
  const preferences = computed(() => user.value?.preferences ?? DEFAULT_PREFERENCES)
  const loading = ref(false)

  async function getUser() {
    loading.value = true

    try {
      const res = await $fetch<{ userData: User }>("/api/user", { method: "GET", credentials: "include" })
      user.value = res.userData
      return res
    }
    catch (err: any) {
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
      const res = await $fetch<{ userProfile: User }>(`/api/user/${slug}`, { method: "GET" })
      userProfile.value = res.userProfile
      return res
    }
    catch (err: any) {
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
    catch (err: any) {
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

      const res = await $fetch<{ imageUrl: string }>("/api/user/image-upload", { method: "PUT", body: formData, credentials: "include" })
      if (user.value && res.imageUrl) {
        user.value.image = res.imageUrl
      }
      return res
    }
    catch (err: any) {
      const message = getErrorMessage(err, "Failed to update user image")
      toast.error(message)
      console.error("updateUserImage error:", err)
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
    catch (err: any) {
      const message = getErrorMessage(err, "Failed to update preferences")
      toast.error(message)
      console.error("updatePreferences error:", err)
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
    catch (err: any) {
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
    getUser,
    getUserProfile,
    updateUser,
    updateUserImage,
    updatePreferences,
    deleteUser,
  }
})
