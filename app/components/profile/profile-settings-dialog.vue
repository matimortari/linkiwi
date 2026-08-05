<template>
  <Dialog :is-open="isOpen" title="Profile Settings" @update:is-open="emit('close')">
    <form class="flex flex-col gap-4" @submit.prevent="handleSaveProfile">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label for="profile-name" class="text-xs font-medium text-muted-foreground">Name</label>
          <input id="profile-name" v-model="profileForm.name" type="text" placeholder="Your name">
        </div>
        <div class="flex flex-col gap-1">
          <label for="profile-slug" class="text-xs font-medium text-muted-foreground">Username</label>
          <input id="profile-slug" v-model="profileForm.slug" type="text" placeholder="your-slug">
        </div>
        <div class="flex flex-col gap-1">
          <label for="profile-description" class="text-xs font-medium text-muted-foreground">Description</label>
          <input id="profile-description" v-model="profileForm.description" type="text" placeholder="A short bio">
        </div>
        <div class="flex flex-col gap-1">
          <label for="profile-location" class="text-xs font-medium text-muted-foreground">Location</label>
          <input id="profile-location" v-model="profileForm.location" type="text" placeholder="City, Country">
        </div>
      </div>

      <footer class="flex flex-row items-center justify-end">
        <div class="navigation-group">
          <button type="button" class="btn-ghost" @click="emit('close')">
            Cancel
          </button>
          <button type="submit" class="btn-success">
            <icon :name="profileAction.icon.value" size="20" />
            <span>Save</span>
          </button>
        </div>
      </footer>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{ close: [] }>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const profileForm = ref({ name: "", slug: "", description: "", location: "" })
const profileAction = useActionIcon("mdi:content-save-check")

async function handleSaveProfile() {
  if (!user.value?.id || !profileForm.value.name || !profileForm.value.slug) {
    return
  }

  await userStore.updateUser({
    name: profileForm.value.name,
    slug: profileForm.value.slug,
    description: profileForm.value.description,
    location: profileForm.value.location,
  })
  await userStore.getUser()
  profileAction.triggerSuccess()
  emit("close")
}

// Prefill the profile form when the dialog opens
watch(() => props.isOpen, (open) => {
  if (open && user.value) {
    profileForm.value = {
      name: user.value.name ?? "",
      slug: user.value.slug ?? "",
      description: user.value.description ?? "",
      location: user.value.location ?? "",
    }
  }
})
</script>
