<template>
  <Dialog :is-open="isOpen" :title="isUpdateMode ? 'Edit Link' : 'Add Link'" @update:is-open="emit('close')">
    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <div class="navigation-group">
        <label for="title" class="w-12 text-sm font-medium">Title</label>
        <input
          id="title" v-model="form.title"
          type="text" placeholder="Enter link title"
          class="flex-1" :disabled="isLoading"
        >
      </div>

      <div class="navigation-group">
        <label for="url" class="w-12 text-sm font-medium">URL</label>
        <input
          id="url" v-model="form.url"
          type="url" placeholder="https://example.com"
          class="flex-1" :disabled="isLoading"
        >
      </div>

      <footer class="flex flex-row items-center justify-between">
        <p class="text-warning">
          {{ isUpdateMode ? linkStore.errors.updateLink || '' : linkStore.errors.createLink || '' }}
        </p>

        <div class="flex flex-row items-center gap-2">
          <button class="btn-secondary" aria-label="Cancel" :disabled="isLoading" @click="emit('close')">
            Cancel
          </button>
          <button class="btn-primary" type="submit" aria-label="Save Link" :disabled="isLoading || !isFormValid">
            {{ isUpdateMode ? 'Update Link' : 'Add Link' }}
          </button>
        </div>
      </footer>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import type { CreateUserLinkInput, UpdateUserLinkInput } from "#shared/lib/schemas/links"
import { createUserLinkSchema, updateUserLinkSchema } from "#shared/lib/schemas/links"

const props = defineProps<{
  isOpen: boolean
  selectedLink?: Link | null
}>()

const emit = defineEmits<{
  (e: "close"): void
}>()

const linkStore = useLinksStore()
const { form, isLoading, isFormValid, resetForm, validateForm, hasFormChanged } = useFormValidation<CreateUserLinkInput | UpdateUserLinkInput>({
  title: "",
  url: "",
})

const isUpdateMode = computed(() => !!(props.selectedLink?.id))

async function handleSubmit() {
  if (!isFormValid.value) {
    const errorKey = isUpdateMode.value ? "updateLink" : "createLink"
    linkStore.errors[errorKey] = "Title and URL are required."
    return
  }
  if (isUpdateMode.value && !hasFormChanged(props.selectedLink || undefined)) {
    emit("close")
    return
  }

  isLoading.value = true
  linkStore.errors.createLink = null
  linkStore.errors.updateLink = null

  try {
    if (isUpdateMode.value) {
      await handleUpdateLink()
    }
    else {
      await handleCreateLink()
    }
  }
  catch (err: any) {
    isUpdateMode.value ? linkStore.errors.updateLink = err.message || "Failed to save link" : linkStore.errors.createLink = err.message || "Failed to save link"
  }
  finally {
    isLoading.value = false
  }
}

async function handleCreateLink() {
  if (!validateForm(createUserLinkSchema)) {
    linkStore.errors.createLink = "Please check your input and try again."
    return
  }

  const createData = form.value as CreateUserLinkInput
  await linkStore.createLink(createData)

  emit("close")
}

async function handleUpdateLink() {
  if (!props.selectedLink?.id) {
    linkStore.errors.updateLink = "Link ID is required for updates."
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
    linkStore.errors.updateLink = "Please check your input and try again."
    return
  }

  await linkStore.updateLink(props.selectedLink.id, validation.data)

  emit("close")
}

watch(() => props.isOpen, (open) => {
  if (open) {
    resetForm(props.selectedLink ? { ...props.selectedLink } : { title: "", url: "" })
    linkStore.errors.createLink = null
    linkStore.errors.updateLink = null
  }
}, { immediate: true })

watch(() => props.selectedLink, () => {
  if (props.isOpen) {
    resetForm(props.selectedLink ? { ...props.selectedLink } : { title: "", url: "" })
    linkStore.errors.createLink = null
    linkStore.errors.updateLink = null
  }
}, { deep: true })
</script>
