<template>
  <Dialog :is-open="isOpen" title="Add Social Icon" @update:is-open="emit('close')">
    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <span class="text-sm font-medium">Select Platform</span>

      <div class="scroll-area grid max-h-64 grid-cols-3 gap-1 overflow-y-auto pr-2 md:grid-cols-5 2xl:grid-cols-9">
        <button
          v-for="[label, iconName] in socialIconEntries" :key="label"
          type="button" aria-label="Select Social Icon"
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

      <footer class="flex flex-row items-center justify-between">
        <p class="text-danger">
          {{ errors.createIcon || '' }}
        </p>

        <div class="flex flex-row items-center gap-2">
          <button class="btn-danger" aria-label="Cancel" :disabled="isLoading" @click="emit('close')">
            Cancel
          </button>
          <button class="btn-primary" type="submit" aria-label="Add Social Icon" :disabled="!isFormValid">
            Confirm
          </button>
        </div>
      </footer>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import type { CreateUserIconInput } from "#shared/schemas/icon-schema"
import { SOCIAL_ICONS } from "#shared/lib/constants"
import { createUserIconSchema } from "#shared/schemas/icon-schema"

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<(e: "close") => void>()

const iconsStore = useIconsStore()
const { icons, errors } = storeToRefs(iconsStore)
const { form, isLoading, isFormValid, resetForm, validateForm } = useFormValidation<CreateUserIconInput>({
  platform: "" as keyof typeof SOCIAL_ICONS,
  logo: "" as typeof SOCIAL_ICONS[keyof typeof SOCIAL_ICONS],
  url: "",
})

const socialIconEntries = computed(() => Object.entries(SOCIAL_ICONS) as [keyof typeof SOCIAL_ICONS, (typeof SOCIAL_ICONS)[keyof typeof SOCIAL_ICONS]][])

function selectIcon(label: keyof typeof SOCIAL_ICONS, iconName: typeof SOCIAL_ICONS[keyof typeof SOCIAL_ICONS]) {
  form.value.platform = label
  form.value.logo = iconName
  errors.value.createIcon = null
}

async function handleSubmit() {
  if (!validateForm(createUserIconSchema)) {
    errors.value.createIcon = "Platform and URL are required."
    return
  }
  if (icons.value.some((i: Icon) => i.platform === form.value.platform)) {
    errors.value.createIcon = "You have already a social icon for this platform."
    return
  }

  isLoading.value = true
  errors.value.createIcon = null

  try {
    await iconsStore.createIcon(form.value)
    emit("close")
  }
  catch (err: any) {
    errors.value.createIcon = err.data.message
  }
  finally {
    isLoading.value = false
  }
}

watch(() => props.isOpen, (open) => {
  if (open) {
    resetForm({ platform: "" as keyof typeof SOCIAL_ICONS, logo: "" as typeof SOCIAL_ICONS[keyof typeof SOCIAL_ICONS], url: "" })
    errors.value.createIcon = null
  }
}, { immediate: true })
</script>
