<template>
  <Dialog :is-open="isOpen" title="Add Social Icon" @update:is-open="emit('close')">
    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <span class="text-sm font-medium">Select Platform</span>

      <div class="scroll-area grid max-h-48 grid-cols-3 gap-1 overflow-y-auto pr-2 md:grid-cols-5 2xl:grid-cols-9">
        <button
          v-for="[label, iconName] in Object.entries(SOCIAL_ICONS) as [keyof typeof SOCIAL_ICONS, typeof SOCIAL_ICONS[keyof typeof SOCIAL_ICONS]][]" :key="label"
          type="button" aria-label="Select Social Icon"
          class="hover:bg-muted active:bg-accent flex flex-col items-center justify-center gap-1 rounded-lg border p-2 transition-all"
          :class="{ 'bg-accent': form.platform === label }" @click="selectIcon(label, iconName)"
        >
          <icon :name="iconName" size="25" />
          <span class="truncate text-xs">{{ label }}</span>
        </button>
      </div>

      <div class="navigation-group">
        <label for="url" class="w-12 text-sm font-medium">URL</label>
        <input
          id="url" v-model="form.url"
          type="url" class="flex-1"
          placeholder="https://example.com"
        >
      </div>

      <footer class="flex flex-row items-center justify-between">
        <p class="text-warning">
          {{ iconStore.errors.createIcon || '' }}
        </p>

        <div class="flex flex-row items-center gap-2">
          <button class="btn-secondary" aria-label="Cancel" :disabled="isLoading" @click="emit('close')">
            Cancel
          </button>
          <button class="btn-primary" type="submit" aria-label="Add Social Icon" :disabled="!isFormValid">
            Add Social Icon
          </button>
        </div>
      </footer>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import type { CreateUserIconInput } from "#shared/schemas/icons"
import { SOCIAL_ICONS } from "#shared/config/social-icons"
import { createUserIconSchema } from "#shared/schemas/icons"

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: "close"): void
}>()

const iconStore = useIconsStore()
const { form, isLoading, isFormValid, resetForm, validateForm } = useFormValidation<CreateUserIconInput>({
  platform: "" as keyof typeof SOCIAL_ICONS,
  logo: "" as typeof SOCIAL_ICONS[keyof typeof SOCIAL_ICONS],
  url: "",
})

function selectIcon(label: keyof typeof SOCIAL_ICONS, iconName: typeof SOCIAL_ICONS[keyof typeof SOCIAL_ICONS]) {
  form.value.platform = label
  form.value.logo = iconName
  iconStore.errors.createIcon = null
}

async function handleSubmit() {
  if (!validateForm(createUserIconSchema)) {
    iconStore.errors.createIcon = "Platform and URL are required."
    return
  }

  isLoading.value = true
  iconStore.errors.createIcon = null

  try {
    await iconStore.createIcon(form.value)
    emit("close")
  }
  catch (err: any) {
    iconStore.errors.createIcon = err.message || "Failed to add social icon"
  }
  finally {
    isLoading.value = false
  }
}

watch(() => props.isOpen, (open) => {
  if (open) {
    resetForm({
      platform: "" as keyof typeof SOCIAL_ICONS,
      logo: "" as typeof SOCIAL_ICONS[keyof typeof SOCIAL_ICONS],
      url: "",
    })
    iconStore.errors.createIcon = null
  }
}, { immediate: true })
</script>
