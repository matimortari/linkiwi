<template>
  <Dialog :is-open="isIconDialogOpen" title="Add Social Icon" @update:is-open="resetForm">
    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <span class="text-sm font-medium">Select Platform</span>

      <div class="scroll-area grid max-h-64 grid-cols-3 gap-1 overflow-y-auto pr-1 md:grid-cols-6 2xl:grid-cols-8">
        <button
          v-for="[label, iconName] in socialIconEntries" :key="label"
          type="button" class="card flex flex-col items-center justify-center gap-2 p-2! transition-all hover:bg-muted! active:bg-muted"
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

const iconsStore = useIconsStore()
const { isIconDialogOpen } = useUIState()
const form = ref<Parameters<typeof iconsStore.createIcon>[0]>({ platform: "" as keyof typeof SOCIAL_ICONS, logo: "" as typeof SOCIAL_ICONS[keyof typeof SOCIAL_ICONS], url: "" })
const socialIconEntries = computed(() => Object.entries(SOCIAL_ICONS) as [keyof typeof SOCIAL_ICONS, (typeof SOCIAL_ICONS)[keyof typeof SOCIAL_ICONS]][])

function selectIcon(label: keyof typeof SOCIAL_ICONS, iconName: typeof SOCIAL_ICONS[keyof typeof SOCIAL_ICONS]) {
  form.value.platform = label
  form.value.logo = iconName
}

async function handleSubmit() {
  if (!form.value.platform || !form.value.url) {
    return
  }

  const created = await iconsStore.createIcon(form.value)
  if (created) {
    handleCancel()
  }
}

function handleCancel() {
  resetForm()
  emit("close")
}

function resetForm() {
  form.value.platform = "" as keyof typeof SOCIAL_ICONS
  form.value.logo = "" as typeof SOCIAL_ICONS[keyof typeof SOCIAL_ICONS]
  form.value.url = ""
}

// Reset form when dialog is opened
watch(() => isIconDialogOpen.value, (open) => {
  if (open) {
    form.value.platform = "" as keyof typeof SOCIAL_ICONS
    form.value.logo = "" as typeof SOCIAL_ICONS[keyof typeof SOCIAL_ICONS]
    form.value.url = ""
  }
  else {
    resetForm()
  }
}, { immediate: true })
</script>
