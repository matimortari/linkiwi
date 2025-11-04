import type { UpdateUserInput, UpdateUserPreferencesInput } from "#shared/lib/schemas/user-schema"

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
      const res = await userService.getUser() as {
        user: User
      }
      user.value = res.user
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
      const res = await userService.getUserBySlug(slug) as User
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
      const res = await userService.updateUser(data)
      user.value = res.user
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
      const res = await userService.updateUserImage(file)
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
      const res = await userService.updatePreferences(data)
      if (user.value && res.preferences) {
        user.value.preferences = res.preferences as typeof user.value.preferences
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
      await userService.deleteUser()
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
