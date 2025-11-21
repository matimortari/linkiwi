import type { UpdateUserInput, UpdateUserPreferencesInput } from "~~/shared/schemas/user-schema"

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null)
  const loading = ref<boolean>(false)
  const errors = ref<Record<"getUser" | "getUserBySlug" | "updateUser" | "updateUserImage" | "updatePreferences" | "deleteUser", string | null>>({
    getUser: null,
    getUserBySlug: null,
    updateUser: null,
    updateUserImage: null,
    updatePreferences: null,
    deleteUser: null,
  })

  async function getUser() {
    loading.value = true
    errors.value.getUser = null
    try {
      const res = await $fetch<User>(`${API_URL}/user`, {
        method: "GET",
        credentials: "include",
      })
      user.value = res
    }
    catch (err: any) {
      errors.value.getUser = err?.message || "Failed to get user"
      console.error("getUser error:", err)
    }
    finally {
      loading.value = false
    }
  }

  async function getUserBySlug(slug: string) {
    loading.value = true
    errors.value.getUserBySlug = null
    try {
      const res = await $fetch<User>(`${API_URL}/user/${slug}`, {
        method: "GET",
      })
      user.value = res
      return res
    }
    catch (err: any) {
      errors.value.getUserBySlug = err?.message || "Failed to get user by slug"
      console.error("getUserBySlug error:", err)
      user.value = null
    }
    finally {
      loading.value = false
    }
  }

  async function updateUser(data: UpdateUserInput) {
    loading.value = true
    errors.value.updateUser = null
    try {
      const res = await $fetch<User>(`${API_URL}/user`, {
        method: "PUT",
        body: data,
        credentials: "include",
      })
      user.value = res
    }
    catch (err: any) {
      errors.value.updateUser = err?.message || "Failed to update user"
      console.error("updateUser error:", err)
    }
    finally {
      loading.value = false
    }
  }

  async function updateUserImage(file: File) {
    loading.value = true
    errors.value.updateUserImage = null
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await $fetch<{ imageUrl: string }>(`${API_URL}/user/image-upload`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      })
      if (user.value && res.imageUrl) {
        user.value.image = res.imageUrl
      }
      return res
    }
    catch (err: any) {
      errors.value.updateUserImage = err?.message || "Failed to update user image"
      console.error("updateUserImage error:", err)
    }
    finally {
      loading.value = false
    }
  }

  async function updatePreferences(data: UpdateUserPreferencesInput) {
    loading.value = true
    errors.value.updatePreferences = null
    try {
      const res = await $fetch<UpdateUserPreferencesInput>(`${API_URL}/user/preferences`, {
        method: "PUT",
        body: data,
        credentials: "include",
      })
      if (user.value && res) {
        user.value.preferences = res as typeof user.value.preferences
      }
    }
    catch (err: any) {
      errors.value.updatePreferences = err?.message || "Failed to update preferences"
      console.error("updatePreferences error:", err)
    }
    finally {
      loading.value = false
    }
  }

  async function deleteUser() {
    loading.value = true
    errors.value.deleteUser = null
    try {
      await $fetch(`${API_URL}/user`, {
        method: "DELETE",
        credentials: "include",
      })
      user.value = null
    }
    catch (err: any) {
      errors.value.deleteUser = err?.message || "Failed to delete user"
      console.error("deleteUser error:", err)
    }
    finally {
      loading.value = false
    }
  }

  return {
    loading,
    errors,
    user,
    getUser,
    getUserBySlug,
    updateUser,
    updateUserImage,
    updatePreferences,
    deleteUser,
  }
})
