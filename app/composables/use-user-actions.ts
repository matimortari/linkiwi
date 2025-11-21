import type { UpdateUserInput, UpdateUserPreferencesInput } from "#shared/schemas/user-schema"

export function useUserActions() {
  const userStore = useUserStore()
  const { clear } = useUserSession()

  const user = computed(() => userStore.user)
  const loading = computed(() => userStore.loading)
  const errors = computed(() => userStore.errors)

  /**
   * Fetch and initialize user data
   */
  const fetchUser = async () => {
    try {
      await userStore.getUser()
      if (!userStore.user) {
        await clear()
        await navigateTo("/", { replace: true })
      }
    }
    catch {
      await clear()
      await navigateTo("/", { replace: true })
    }
  }

  /**
   * Fetch user by slug
   * @param slug User slug to fetch
   */
  const fetchUserBySlug = async (slug: string) => {
    return await userStore.getUserBySlug(slug)
  }

  /**
   * Update user profile information
   * @param data User data to update (name, slug, description, or image URL)
   */
  const updateProfile = async (data: UpdateUserInput) => {
    await userStore.updateUser(data)
  }

  /**
   * Update user profile image by uploading a file
   * @param file Image file to upload (png, jpeg, or webp, max 5MB)
   */
  const updateProfileImage = async (file: File) => {
    return await userStore.updateUserImage(file)
  }

  /**
   * Update user preferences (appearance, theme, etc.)
   * @param data User preferences to update
   */
  const updatePreferences = async (data: UpdateUserPreferencesInput) => {
    await userStore.updatePreferences(data)
  }

  /**
   * Delete user account and session cookies
   */
  const deleteAccount = async () => {
    await userStore.deleteUser()
    await clear()
    await navigateTo("/")
  }

  return {
    user,
    loading,
    errors,
    fetchUser,
    fetchUserBySlug,
    updateProfile,
    updateProfileImage,
    updatePreferences,
    deleteAccount,
  }
}
