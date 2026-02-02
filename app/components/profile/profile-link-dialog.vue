<template>
  <Dialog :is-open="isOpen" :title="isUpdateMode ? 'Edit Link' : 'Add Link'" @update:is-open="emit('close')">
    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <div class="flex max-w-md flex-col gap-2">
        <label for="title" class="w-12 text-sm font-medium">Title</label>
        <input id="title" v-model="form.title" type="text" placeholder="Enter link title">
      </div>

      <div class="flex max-w-md flex-col gap-2">
        <label for="url" class="w-12 text-sm font-medium">URL</label>
        <input id="url" v-model="form.url" type="url" placeholder="https://example.com">
      </div>

      <footer class="flex flex-row items-center justify-between">
        <p class="text-danger">
          {{ isUpdateMode ? errors.updateLink || '' : errors.createLink || '' }}
        </p>

        <div class="flex flex-row items-center gap-2">
          <button class="btn-danger" aria-label="Cancel" :disabled="loading" @click="emit('close')">
            Cancel
          </button>
          <button class="btn-primary" type="submit" :disabled="loading || !form.title || !form.url">
            Confirm
          </button>
        </div>
      </footer>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import type { CreateUserLinkInput, UpdateUserLinkInput } from "#shared/schemas/link-schema"
import { updateUserLinkSchema } from "#shared/schemas/link-schema"

const props = defineProps<{
  isOpen: boolean
  selectedLink?: Link | null
}>()

const emit = defineEmits<(e: "close") => void>()

const linksStore = useLinksStore()
const { errors, loading } = storeToRefs(linksStore)
const form = ref<CreateUserLinkInput | UpdateUserLinkInput>({
  title: "",
  url: "",
})
const isUpdateMode = computed(() => !!(props.selectedLink?.id))

async function handleSubmit() {
  if (!form.value.title || !form.value.url) {
    errors.value[isUpdateMode.value ? "updateLink" : "createLink"] = "Title and URL are required."
    return
  }

  if (isUpdateMode.value) {
    await handleUpdateLink()
  }
  else {
    await handleCreateLink()
  }
}

async function handleCreateLink() {
  if (!form.value.title || !form.value.url) {
    errors.value.createLink = "Please check your input and try again."
    return
  }

  try {
    const createData = form.value as CreateUserLinkInput
    await linksStore.createLink(createData)
    emit("close")
  }
  catch {
    // Silently fail
  }
}

async function handleUpdateLink() {
  if (!props.selectedLink?.id) {
    errors.value.updateLink = "Link ID is required for updates."
    return
  }

  const updateData: UpdateUserLinkInput = {}
  if (form.value.title !== props.selectedLink.title) {
    updateData.title = form.value.title
  }
  if (form.value.url !== props.selectedLink.url) {
    updateData.url = form.value.url
  }
  if (Object.keys(updateData).length === 0) {
    emit("close")
    return
  }

  const validation = updateUserLinkSchema.safeParse(updateData)
  if (!validation.success) {
    errors.value.updateLink = "Please check your input and try again."
    return
  }

  try {
    await linksStore.updateLink(props.selectedLink.id, validation.data)
    emit("close")
  }
  catch {
    // Silently fail
  }
}

watch(() => props.isOpen, (open) => {
  if (open) {
    errors.value.createLink = null
    errors.value.updateLink = null
    form.value = props.selectedLink ? { ...props.selectedLink } : { title: "", url: "" }
  }
}, { immediate: true })

watch(() => props.selectedLink, () => {
  if (props.isOpen) {
    form.value = props.selectedLink ? { ...props.selectedLink } : { title: "", url: "" }
  }
}, { deep: true })
</script>
