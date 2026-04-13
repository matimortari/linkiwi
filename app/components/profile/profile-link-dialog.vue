<template>
  <Dialog :is-open="isLinkDialogOpen" :title="isUpdateMode ? 'Edit Link' : 'Add Link'" @update:is-open="emit('close')">
    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <div class="flex max-w-md flex-col gap-2">
        <label for="title" class="w-12 text-sm font-medium">Title</label>
        <input id="title" v-model="form.title" type="text" placeholder="Enter link title">
      </div>

      <div class="flex max-w-md flex-col gap-2">
        <label for="url" class="w-12 text-sm font-medium">URL</label>
        <input id="url" v-model="form.url" type="url" placeholder="https://example.com">
      </div>

      <footer class="flex flex-row items-center justify-end">
        <div class="navigation-group">
          <button class="btn-danger" @click="handleCancel">
            Cancel
          </button>
          <button class="btn-success" type="submit">
            Confirm
          </button>
        </div>
      </footer>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
const emit = defineEmits<{ close: [] }>()

const linksStore = useLinksStore()
const { isLinkDialogOpen, selectedLink } = useUIState()
const form = ref<Parameters<typeof linksStore.createLink>[0] | Parameters<typeof linksStore.updateLink>[1]>({ title: "", url: "" })
const editingLinkId = ref<string | null>(null)
const isUpdateMode = computed(() => !!editingLinkId.value)

async function handleSubmit() {
  if (!form.value.title || !form.value.url) {
    return
  }

  const result = isUpdateMode.value && editingLinkId.value ? await linksStore.updateLink(editingLinkId.value, { title: form.value.title, url: form.value.url }) : await linksStore.createLink(form.value as Parameters<typeof linksStore.createLink>[0])
  if (result) {
    handleCancel()
  }
}

function handleCancel() {
  resetForm()
  emit("close")
}

function resetForm() {
  editingLinkId.value = null
  form.value.title = ""
  form.value.url = ""
}

// Reset form when dialog is opened or when selectedLink changes
watch([() => isLinkDialogOpen.value, () => selectedLink.value], ([open]) => {
  if (open) {
    editingLinkId.value = selectedLink.value?.id || null
    form.value.title = selectedLink.value?.title || ""
    form.value.url = selectedLink.value?.url || ""
  }
  else {
    resetForm()
  }
}, { immediate: true })
</script>
