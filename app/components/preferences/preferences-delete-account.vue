<template>
  <div class="card flex flex-col gap-2">
    <h3>
      Delete Account
    </h3>

    <div class="flex flex-col justify-between gap-2 md:flex-row md:items-start">
      <p class="text-danger">
        This action is irreversible. All data will be lost.
      </p>

      <button title="Delete Account" class="btn-danger self-end" aria-label="Delete Account" @click="handleDeleteUser">
        <icon name="mdi:user-remove" size="20" />
        <span>Delete Account</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { clear } = useUserSession()
const userStore = useUserStore()

async function handleDeleteUser() {
  if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
    return
  }

  const success = await userStore.deleteUser()
  if (!success) {
    return
  }

  await clear()
  await navigateTo("/sign-in", { replace: true })
}
</script>
