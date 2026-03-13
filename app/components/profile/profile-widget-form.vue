<template>
  <Dialog :is-open="isOpen" :title="isUpdateMode ? 'Edit Widget' : 'Add Widget'" @update:is-open="emit('close')">
    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <div v-if="!isUpdateMode" class="flex flex-col gap-2">
        <span class="text-sm font-medium">Platform</span>

        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="option in WIDGET_OPTIONS" :key="option.type"
            type="button" class="card navigation-group p-2! transition-all hover:bg-muted!"
            :class="{ 'bg-muted!': form.type === option.type, 'cursor-not-allowed! opacity-40': existingTypes.includes(option.type) }" :disabled="existingTypes.includes(option.type)"
            @click="form.type = option.type"
          >
            <icon :name="option.icon" size="20" />
            <span class="text-sm font-medium">{{ option.label }}</span>
          </button>
        </div>
      </div>

      <div v-if="form.type" class="flex flex-col gap-2">
        <label for="handle" class="text-sm font-medium">
          {{ handleLabel }}
        </label>
        <input id="handle" v-model="form.handle" type="text" :placeholder="handlePlaceholder">
        <p class="text-caption">
          {{ handleHint }}
        </p>
      </div>

      <footer class="flex flex-row items-center justify-end">
        <div class="navigation-group">
          <button class="btn-danger" type="button" :disabled="loading" @click="emit('close')">
            Cancel
          </button>
          <button class="btn-success" type="submit" :disabled="loading || !form.type || !form.handle">
            Confirm
          </button>
        </div>
      </footer>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import type { WidgetType } from "#shared/schemas/widget-schema"

const props = defineProps<{
  isOpen: boolean
  selectedWidget?: Widget | null
  existingTypes: WidgetType[]
}>()

const emit = defineEmits<{ close: [] }>()

const WIDGET_OPTIONS: { type: WidgetType, label: string, icon: string }[] = [
  { type: "GITHUB", label: "GitHub", icon: "simple-icons:github" },
  { type: "YOUTUBE", label: "YouTube", icon: "simple-icons:youtube" },
  { type: "SPOTIFY", label: "Spotify", icon: "simple-icons:spotify" },
  { type: "TWITCH", label: "Twitch", icon: "simple-icons:twitch" },
]

const WIDGET_META: Record<WidgetType, { label: string, placeholder: string, hint: string }> = {
  GITHUB: {
    label: "GitHub Username",
    placeholder: "e.g. torvalds",
    hint: "Your GitHub username as it appears in your profile URL.",
  },
  YOUTUBE: {
    label: "YouTube Handle or Channel ID",
    placeholder: "e.g. @mkbhd or UCBcRF18a7Qf58cCRy5xuWwQ",
    hint: "Your @handle or the channel ID from your YouTube URL.",
  },
  SPOTIFY: {
    label: "Spotify User ID",
    placeholder: "e.g. spotify:user:abc123",
    hint: "Found in your Spotify profile URL: open.spotify.com/user/YOUR_ID",
  },
  TWITCH: {
    label: "Twitch Username",
    placeholder: "e.g. shroud",
    hint: "Your Twitch username as it appears in your channel URL.",
  },
}

const widgetsStore = useWidgetsStore()
const { loading } = storeToRefs(widgetsStore)

const form = ref<{ type: WidgetType | "", handle: string }>({ type: "", handle: "" })
const editingWidgetId = ref<string | null>(null)
const isUpdateMode = computed(() => !!editingWidgetId.value)

const handleLabel = computed(() => form.value.type ? WIDGET_META[form.value.type].label : "Handle")
const handlePlaceholder = computed(() => form.value.type ? WIDGET_META[form.value.type].placeholder : "")
const handleHint = computed(() => form.value.type ? WIDGET_META[form.value.type].hint : "")

async function handleSubmit() {
  if (!form.value.type || !form.value.handle) {
    return
  }

  try {
    if (isUpdateMode.value && editingWidgetId.value) {
      await widgetsStore.updateWidget(editingWidgetId.value, { handle: form.value.handle })
    }
    else {
      await widgetsStore.createWidget({ type: form.value.type, handle: form.value.handle })
    }
    emit("close")
  }
  catch {
    // Silently fail
  }
}

watch([() => props.isOpen, () => props.selectedWidget], ([open]) => {
  if (open) {
    editingWidgetId.value = props.selectedWidget?.id ?? null
    form.value.type = props.selectedWidget?.type ?? ""
    form.value.handle = props.selectedWidget?.handle ?? ""
  }
}, { immediate: true, deep: true })
</script>
