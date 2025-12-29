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
          <label class="btn absolute -bottom-2 -left-2 cursor-pointer" for="image">
            <icon name="mdi:upload" size="20" />
          </label>
        </div>
      </div>

      <div class="flex max-w-md flex-col gap-2">
        <label for="slug" class="w-20 text-sm font-medium">Slug</label>
        <input id="slug" v-model="form.slug" type="text" placeholder="Enter your slug">
      </div>

      <div class="flex max-w-md flex-col gap-2">
        <label for="description" class="w-20 text-sm font-medium">Description</label>
        <input id="description" v-model="form.description" type="text" placeholder="Enter your description">
      </div>

      <footer class="flex flex-row items-center justify-between">
        <p class="text-danger">
          {{ errors.updateUser || '' }}
        </p>

        <button class="btn-primary" type="submit">
          Update Profile
        </button>
      </footer>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<(e: "close") => void>()

const userStore = useUserStore()
const { user, errors } = storeToRefs(userStore)
const form = ref({ slug: "", description: "", image: "" })

async function handleUpdateImage(event: Event) {
  errors.value.updateUserImage = null

  const input = event.target as HTMLInputElement
  const file = input?.files?.[0]
  if (!file) {
    return
  }

  try {
    const res = await userStore.updateUserImage(file)
    if (res?.imageUrl && user.value) {
      user.value.image = res.imageUrl
      form.value.image = res.imageUrl
    }
  }
  catch (err: any) {
    errors.value.updateUserImage = err.data.message
  }
}

async function handleSubmit() {
  errors.value.updateUser = null

  if (!user.value?.id) {
    return
  }
  if (!user.value?.name) {
    errors.value.updateUser = "User name cannot be empty."
    return
  }

  try {
    await userStore.updateUser({
      name: user.value.name,
      slug: form.value.slug,
      description: form.value.description,
    })

    await userStore.getUser()
    emit("close")
  }
  catch (err: any) {
    errors.value.updateUser = err.data.message
  }
}

watch(() => props.isOpen, (open) => {
  if (open && user.value) {
    form.value = {
      slug: user.value.slug ?? "",
      description: user.value.description ?? "",
      image: user.value.image ?? "",
    }
  }
  else {
    form.value = { slug: "", description: "", image: "" }
  }
}, { immediate: true })
</script>
