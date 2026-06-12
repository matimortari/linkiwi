<template>
  <Dialog :is-open="isIconDialogOpen" title="Add Social Icon" @update:is-open="emit('close')">
    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <span class="text-sm font-medium">Select Platform</span>

      <div class="scroll-area grid max-h-64 grid-cols-3 gap-1 overflow-y-auto pr-1 md:grid-cols-6 2xl:grid-cols-8">
        <button
          v-for="[label, iconName] in socialIconEntries" :key="label"
          class="card flex flex-col items-center justify-center gap-2 p-2! transition-all hover:bg-muted! active:bg-muted"
          :class="{ 'bg-muted': form.platform === label }" @click="selectIcon(label, iconName)"
        >
          <icon :name="iconName" size="25" />
          <span class="truncate text-xs">{{ label }}</span>
        </button>
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

const profileItemsStore = useProfileItemsStore()
const { isIconDialogOpen } = useUIState()
const form = ref({ platform: "", logo: "", url: "" })
const socialIconEntries = computed(() => Object.entries(SOCIAL_ICONS) as [string, string][])

function selectIcon(label: string, iconName: string) {
  form.value.platform = label
  form.value.logo = iconName
}

async function handleSubmit() {
  if (!form.value.platform || !form.value.url) {
    return
  }

  await profileItemsStore.createItem({
    type: "ICON",
    isPinned: false,
    isVisible: true,
    icon: { platform: form.value.platform, logo: form.value.logo, url: form.value.url },
  })
  handleCancel()
}

function handleCancel() {
  resetForm()
  emit("close")
}

function resetForm() {
  form.value.platform = ""
  form.value.logo = ""
  form.value.url = ""
}

// Reset form when dialog is opened
watch(() => isIconDialogOpen.value, (open) => {
  if (!open) {
    resetForm()
  }
}, { immediate: true })
</script>
