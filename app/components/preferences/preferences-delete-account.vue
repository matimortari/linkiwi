<template>
  <div class="card flex flex-col gap-4">
    <header class="my-2 flex flex-col gap-2">
      <h3>
        Delete Account
      </h3>
      <p class="text-danger">
        This action is irreversible. All data will be lost.
      </p>
    </header>

    <div class="navigation-group justify-end md:justify-start">
      <button title="Delete Account" class="btn-danger" aria-label="Delete Account" @click="handleDeleteUser">
        <icon name="mdi:user-remove" size="20" />
        <span>Delete Account</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()

async function handleDeleteUser() {
  if (!confirm("Are you sure you want to delete your account? This action cannot be undone."))
    return

  await userStore.deleteUser()
}
</script>
