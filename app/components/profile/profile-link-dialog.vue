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

        <div class="navigation-group">
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
const props = defineProps<{
  isOpen: boolean
  selectedLink?: Link | null
}>()

const emit = defineEmits<(e: "close") => void>()

const linksStore = useLinksStore()
const { errors, loading } = storeToRefs(linksStore)
const form = ref<Parameters<typeof linksStore.createLink>[0] | Parameters<typeof linksStore.updateLink>[1]>({ title: "", url: "" })
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
  try {
    await linksStore.createLink(form.value as Parameters<typeof linksStore.createLink>[0])
    emit("close")
  }
  catch {
    // Silently fail
  }
}

async function handleUpdateLink() {
  if (!props.selectedLink?.id) {
    return
  }

  const updateData: Parameters<typeof linksStore.updateLink>[1] = {}
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

  try {
    await linksStore.updateLink(props.selectedLink.id, updateData)
    emit("close")
  }
  catch {
    // Silently fail
  }
}

// Reset form and clear errors when dialog is opened or when selectedLink changes
watch([() => props.isOpen, () => props.selectedLink], ([open]) => {
  if (open) {
    form.value.title = props.selectedLink?.title || ""
    form.value.url = props.selectedLink?.url || ""
    errors.value.createLink = null
    errors.value.updateLink = null
  }
}, { immediate: true, deep: true })
</script>
