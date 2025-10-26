<template>
  <Dialog :is-open="isOpen" title="Edit Profile Info" @update:is-open="emit('close')">
    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <div class="flex flex-col items-center border-b pb-4">
        <div class="relative size-24">
          <img v-if="form.image" :src="form.image" alt="Profile preview" class="size-full rounded-full border object-cover">
          <input
            id="image" type="file"
            accept="image/*" class="absolute top-0 left-0 size-full opacity-0"
            @change="handleUpdateImage"
          >
          <label class="btn absolute -bottom-2 -left-2" for="image">
            <icon name="mdi:upload" size="20" />
          </label>
        </div>
      </div>

      <div class="navigation-group">
        <label for="slug" class="w-20 text-sm font-medium">Slug</label>
        <input
          id="slug" v-model="form.slug"
          type="text" placeholder="Enter your slug"
          class="flex-1"
        >
      </div>

      <div class="navigation-group">
        <label for="description" class="w-20 text-sm font-medium">Description</label>
        <input
          id="description" v-model="form.description"
          type="text" placeholder="Enter your description"
          class="flex-1"
        >
      </div>

      <footer class="flex flex-row items-center justify-between">
        <p class="text-warning">
          {{ userStore.errors.updateUser || '' }}
        </p>

        <button class="btn-primary" type="submit" aria-label="Save Link">
          Update Profile
        </button>
      </footer>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
  slug?: string
  description?: string
  image?: string
}>()

const emit = defineEmits<(e: "close") => void>()

const userStore = useUserStore()

const form = ref({
  slug: "",
  description: "",
  image: "",
})

watch(() => props.isOpen, (open) => {
  if (open) {
    form.value = {
      slug: props.slug ?? "",
      description: props.description ?? "",
      image: props.image ?? "",
    }
  }
  else {
    form.value = { slug: "", description: "", image: "" }
  }
}, { immediate: true })

// async function handleUpdateImage(event: Event) {
//   userStore.errors.updateUserImage = null

//   const input = event.target as HTMLInputElement
//   if (!input.files || input.files.length === 0)
//     return

//   const file = input.files[0]
//   if (!file)
//     return

//   const formData = new FormData()
//   formData.append("file", file, file.name)
//   formData.append("type", "avatar")

//   try {
//     const response = await userStore.updateUserImage(formData)
//     form.value.image = response.imageUrl
//   }
//   catch (err: any) {
//     console.error("Failed to upload image:", err)
//     userStore.errors.updateUserImage = err.message
//   }
// }

async function handleSubmit() {
  userStore.errors.updateUser = null
  if (!userStore.user?.id)
    return
  if (!userStore.user?.name) {
    userStore.errors.updateUser = "User name cannot be empty."
    return
  }

  try {
    await userStore.updateUser({
      name: userStore.user.name,
      slug: form.value.slug,
      description: form.value.description,
    })
    await userStore.getUser()
    emit("close")
  }
  catch (err: any) {
    console.error("Failed to update user data:", err)
    userStore.errors.updateUser = err.message
  }
}
</script>
