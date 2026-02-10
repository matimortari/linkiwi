<template>
  <div class="card flex flex-col gap-4">
    <h3>
      Account Options
    </h3>

    <div class="flex flex-col gap-2">
      <div class="card flex flex-col gap-2">
        <h4>
          Guestbook
        </h4>
        <p class="text-caption">
          Allow visitors to leave comments on your profile page.
        </p>

        <div class="flex items-center justify-between gap-2 p-2 pt-0">
          <PreferencesCheckbox id="enableGuestbook" v-model:value="preferences.enableGuestbook" label="Enable Guestbook" class="max-w-xs" />

          <button class="btn-primary" @click="handleSubmit">
            <icon :name="saveAction.icon.value" size="20" />
            <span>Save</span>
          </button>
        </div>

        <div v-if="preferences.enableGuestbook" class="card flex flex-col gap-2">
          <h5>
            Comments
          </h5>

          <p v-if="comments.length === 0" class="text-caption">
            No comments yet.
          </p>

          <div v-else class="scroll-area flex max-h-64 flex-col gap-2 overflow-y-auto pr-1">
            <div v-for="comment in comments" :key="comment.id" class="card flex flex-col">
              <div class="flex justify-between">
                <div class="flex items-center gap-1">
                  <p class="font-semibold">
                    {{ comment.name }}
                  </p>
                  <span v-if="comment.email" class="text-xs text-muted-foreground">({{ comment.email }})</span>
                </div>

                <span class="text-caption">{{ formatDate(new Date(comment.createdAt)) }}</span>
              </div>

              <p class="text-sm text-muted-foreground">
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

        <button title="Delete Account" class="btn-danger md:self-end" @click="handleDeleteUser">
          <icon name="mdi:user-remove" size="20" />
          <span>Delete Account</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { createActionHandler } = useActionIcon()
const { clear } = useUserSession()
const userStore = useUserStore()
const { preferences } = storeToRefs(userStore)
const comments = computed(() => userStore.user?.comments ?? [])
const saveAction = createActionHandler("mdi:content-save-check")

async function handleSubmit() {
  await userStore.updatePreferences({
    enableGuestbook: preferences.value.enableGuestbook,
  })

  await userStore.getUser()
  saveAction.triggerSuccess()
}

async function handleDeleteUser() {
  if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
    return
  }

  await userStore.deleteUser()
  await clear()
  await navigateTo("/sign-in", { replace: true })
}
</script>
