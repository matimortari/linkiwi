<template>
  <div class="card flex flex-col gap-2">
    <h3>
      Account Options
    </h3>

    <div class="flex flex-col gap-2 py-4">
      <div class="card flex flex-col gap-2">
        <h4>
          Guestbook
        </h4>
        <p class="text-caption">
          Allow visitors to leave comments on your profile page.
        </p>

        <div class="flex items-center justify-between">
          <PreferencesCheckbox id="enableGuestbook" v-model:value="preferences.enableGuestbook" label="Enable Guestbook" class="max-w-xs" />

          <button class="btn-primary self-end" @click="handleSubmit">
            <icon :name="saveStatus === 'saved' ? 'mdi:check' : 'mdi:content-save-check'" size="20" />
            <span class="truncate">Save</span>
          </button>
        </div>

        <div v-if="preferences.enableGuestbook" class="my-4 flex flex-col gap-2">
          <h5>
            Comments
          </h5>

          <p v-if="comments.length === 0" class="text-">
            No comments yet.
          </p>

          <div v-else class="scroll-area flex max-h-64 flex-col gap-1 overflow-y-auto pr-1">
            <div v-for="comment in comments" :key="comment.id" class="card">
              <div class="flex justify-between">
                <div class="flex items-center gap-1">
                  <h5>
                    {{ comment.name }}
                  </h5>
                  <span v-if="comment.email" class="text-xs text-muted-foreground">({{ comment.email }})</span>
                </div>
                <span class="text-caption">{{ formatDate(new Date(comment.createdAt)) }}</span>
              </div>

              <p class="my-2 text-sm text-muted-foreground">
                {{ comment.message }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="card flex flex-col gap-2">
        <h4>
          Delete Account
        </h4>
        <p class="text-danger">
          This action is irreversible. All data will be lost.
        </p>

        <button title="Delete Account" class="btn-danger self-end" @click="handleDeleteUser">
          <icon name="mdi:user-remove" size="20" />
          <span>Delete Account</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { clear } = useUserSession()
const userStore = useUserStore()
const { preferences } = storeToRefs(userStore)
const comments = computed(() => userStore.user?.comments ?? [])
const saveStatus = ref<"idle" | "saved">("idle")

async function handleSubmit() {
  saveStatus.value = "idle"

  await userStore.updatePreferences({
    enableGuestbook: preferences.value.enableGuestbook,
  })

  await userStore.getUser()
  saveStatus.value = "saved"
}

watch(saveStatus, (newStatus, _oldStatus, onInvalidate) => {
  if (newStatus !== "idle") {
    const timer = setTimeout(() => {
      saveStatus.value = "idle"
    }, 2000)
    onInvalidate(() => clearTimeout(timer))
  }
})

async function handleDeleteUser() {
  if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
    return
  }

  await userStore.deleteUser()
  await clear()
  await navigateTo("/sign-in", { replace: true })
}
</script>
