<template>
  <Dialog :is-open="isLinkDialogOpen" :title="isUpdateMode ? 'Edit Link' : 'Add Link'" @update:is-open="emit('close')">
    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <div class="flex max-w-md flex-col gap-2">
        <label for="title" class="text-sm font-medium">Title</label>
        <input id="title" v-model="form.title" type="text" placeholder="Enter link title">
      </div>

      <div class="flex max-w-md flex-col gap-2">
        <label for="url" class="text-sm font-medium">URL</label>
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

const profileItemsStore = useProfileItemsStore()
const { isLinkDialogOpen, selectedLink } = useUIState()
const form = ref({ title: "", url: "" })
const editingLinkId = ref<string | null>(null)
const isUpdateMode = computed(() => !!editingLinkId.value)

async function handleSubmit() {
  if (!form.value.title || !form.value.url) {
    return
  }

  if (isUpdateMode.value && editingLinkId.value) {
    await profileItemsStore.updateItem(editingLinkId.value, { link: { label: form.value.title, url: form.value.url } })
  }
  else {
    await profileItemsStore.createItem({
      type: "LINK",
      isPinned: false,
      isVisible: true,
      link: { label: form.value.title, url: form.value.url },
    })
  }
  handleCancel()
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
watch(() => selectedLink.value, (item) => {
  if (item && item.link) {
    editingLinkId.value = item.id
    form.value.title = item.link.label
    form.value.url = item.link.url
  }
  else {
    resetForm()
  }
}, { immediate: true })
</script>
