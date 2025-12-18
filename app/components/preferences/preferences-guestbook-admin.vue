<template>
  <div class="card flex flex-col gap-2">
    <h3>
      Guestbook Messages
    </h3>

    <PreferencesAppearanceCheckbox id="enableGuestbook" v-model:value="preferences.enableGuestbook" label="Enable Guestbook" />

    <div v-for="comment in comments" :key="comment.id" class="card">
      <div class="flex justify-between">
        <div class="flex items-center gap-1">
          <h5>
            {{ comment.name }}
          </h5>
          <span v-if="comment.email" class="text-xs text-muted-foreground">
            ({{ comment.email }})
          </span>
        </div>

        <span class="text-caption">
          {{ formatDate(new Date(comment.createdAt)) }}
        </span>
      </div>

      <p class="my-2 text-sm text-muted-foreground">
        {{ comment.message }}
      </p>
    </div>

    <div class="flex flex-row items-center justify-between">
      <p class="text-danger">
        {{ errors.updateUser || '' }}
      </p>

      <button class="btn-primary" @click="handleSubmit">
        <icon name="mdi:content-save-check" size="20" />
        <span>{{ status === 'saved' ? 'Saved!' : 'Save' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore?.() ?? null

const { preferences, errors } = storeToRefs(userStore)
const comments = computed(() => userStore?.user?.comments ?? [])
const status = ref<"idle" | "saved">("idle")
async function handleSubmit() {
  errors.value.updateUser = null
  status.value = "idle"

  try {
    await userStore.updatePreferences({
      enableGuestbook: preferences.value.enableGuestbook,
    })

    await userStore.getUser()
    status.value = "saved"
  }
  catch (err: any) {
    errors.value.updateUser = err.data.message
    status.value = "idle"
  }
}

watch(status, (newStatus, _oldStatus, onInvalidate) => {
  if (newStatus !== "idle") {
    const timer = setTimeout(() => {
      status.value = "idle"
    }, 2000)
    onInvalidate(() => clearTimeout(timer))
  }
})
</script>
