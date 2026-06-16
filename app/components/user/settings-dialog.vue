<template>
  <Dialog :is-open="isUserDialogOpen" title="Edit Profile" @update:is-open="emit('close')">
    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <div class="flex flex-row items-start gap-4">
        <div class="relative shrink-0">
          <img :src="form.image" alt="Profile preview" class="size-16 rounded-full border object-cover">
          <input
            id="image" type="file"
            accept="image/*" class="absolute inset-0 size-full cursor-pointer opacity-0"
            @change="handleUpdateImage"
          >
          <label class="btn absolute -right-2 -bottom-2 cursor-pointer p-1!" for="image" aria-label="Upload Profile Image">
            <icon name="mdi:camera" size="15" />
          </label>
        </div>

        <div class="grid flex-1 grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label for="name" class="text-xs font-medium text-muted-foreground">Name</label>
            <input id="name" v-model="form.name" type="text" placeholder="Your name">
          </div>
          <div class="flex flex-col gap-1">
            <label for="slug" class="text-xs font-medium text-muted-foreground">Username</label>
            <input id="slug" v-model="form.slug" type="text" placeholder="your-slug">
          </div>
          <div class="flex flex-col gap-1">
            <label for="location" class="text-xs font-medium text-muted-foreground">Location</label>
            <input id="location" v-model="form.location" type="text" placeholder="City, Country">
          </div>
          <div class="flex flex-col gap-1">
            <label for="description" class="text-xs font-medium text-muted-foreground">Bio</label>
            <input id="description" v-model="form.description" type="text" placeholder="A short bio">
          </div>
        </div>
      </div>

      <footer class="flex flex-row items-center justify-end">
        <button class="btn-success" type="submit">
          Update Profile
        </button>
      </footer>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
const emit = defineEmits<{ close: [] }>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const { isUserDialogOpen } = useUIState()
const form = ref({ name: "", slug: "", description: "", location: "", image: "" })

async function handleUpdateImage(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input?.files?.[0]
  if (!file) {
    return
  }

  const res = await userStore.updateUserImage(file)
  if (res?.imageUrl && user.value) {
    user.value.image = res.imageUrl
    form.value.image = res.imageUrl
  }
}

async function handleSubmit() {
  if (!user.value?.id || !form.value.name || !form.value.slug) {
    return
  }

  const updated = await userStore.updateUser({ name: form.value.name, slug: form.value.slug, description: form.value.description, location: form.value.location })
  if (!updated) {
    return
  }

  await userStore.getUser()
  emit("close")
}

// Reset form when dialog is opened
watch(() => isUserDialogOpen.value, (open) => {
  if (open && user.value) {
    form.value = {
      name: user.value.name ?? "",
      slug: user.value.slug ?? "",
      description: user.value.description ?? "",
      location: user.value.location ?? "",
      image: user.value.image ?? "",
    }
  }
}, { immediate: true })
</script>
