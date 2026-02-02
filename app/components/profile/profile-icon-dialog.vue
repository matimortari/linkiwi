<template>
  <Dialog :is-open="isOpen" title="Add Social Icon" @update:is-open="emit('close')">
    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <span class="text-sm font-medium">Select Platform</span>

      <div class="scroll-area grid max-h-64 grid-cols-3 gap-1 overflow-y-auto pr-1 md:grid-cols-6 2xl:grid-cols-8">
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

        <div class="navigation-group">
          <button class="btn-danger" aria-label="Cancel" :disabled="loading" @click="emit('close')">
            Cancel
          </button>
          <button class="btn-success" type="submit" aria-label="Add Social Icon" :disabled="loading || !form.platform || !form.url">
            Confirm
          </button>
        </div>
      </footer>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import type { CreateUserIconInput } from "#shared/schemas/icon-schema"

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<(e: "close") => void>()

const iconsStore = useIconsStore()
const { icons, errors, loading } = storeToRefs(iconsStore)
const form = ref<CreateUserIconInput>({
  platform: "" as keyof typeof SOCIAL_ICONS,
  logo: "" as typeof SOCIAL_ICONS[keyof typeof SOCIAL_ICONS],
  url: "",
})

const socialIconEntries = computed(() => Object.entries(SOCIAL_ICONS) as [keyof typeof SOCIAL_ICONS, (typeof SOCIAL_ICONS)[keyof typeof SOCIAL_ICONS]][])

function selectIcon(label: keyof typeof SOCIAL_ICONS, iconName: typeof SOCIAL_ICONS[keyof typeof SOCIAL_ICONS]) {
  form.value.platform = label
  form.value.logo = iconName
}

async function handleSubmit() {
  if (!form.value.platform || !form.value.url) {
    errors.value.createIcon = "Platform and URL are required."
    return
  }

  if (icons.value.some((i: Icon) => i.platform === form.value.platform)) {
    errors.value.createIcon = "You have already a social icon for this platform."
    return
  }

  loading.value = true

  try {
    await iconsStore.createIcon(form.value)
    emit("close")
  }
  catch {
    // Silently fail
  }
  finally {
    loading.value = false
  }
}

watch(() => props.isOpen, (open) => {
  if (open) {
    errors.value.createIcon = null
    form.value = { platform: "" as keyof typeof SOCIAL_ICONS, logo: "" as typeof SOCIAL_ICONS[keyof typeof SOCIAL_ICONS], url: "" }
  }
}, { immediate: true })
</script>
