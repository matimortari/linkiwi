<template>
  <Dialog :is-open="isLocationDialogOpen" :title="isUpdateMode ? 'Edit Location' : 'Add Location'" @update:is-open="emit('close')">
    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <div class="flex max-w-md flex-col gap-2">
        <label for="location-label" class="text-sm font-medium">Label</label>
        <input id="location-label" v-model="form.label" type="text" placeholder="Studio, cafe, city…">
      </div>

      <div class="flex max-w-md flex-col gap-2">
        <label for="location-search" class="text-sm font-medium">Search place</label>
        <div class="flex gap-2">
          <input
            id="location-search" v-model="searchQuery"
            type="text" placeholder="Search OpenStreetMap…"
            @keydown.enter.prevent="searchPlaces"
          >
          <button type="button" class="btn shrink-0" :disabled="searching || searchQuery.trim().length < 2" @click="searchPlaces">
            <icon :name="searching ? 'mdi:loading' : 'mdi:magnify'" size="20" :class="{ 'animate-spin': searching }" />
            <span>Search</span>
          </button>
        </div>
        <ul v-if="searchResults.length" class="scroll-area flex max-h-36 flex-col gap-1 overflow-y-auto rounded-lg border p-1">
          <li v-for="(result, index) in searchResults" :key="`${result.lat}-${result.lng}-${index}`">
            <button type="button" class="w-full rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted" @click="selectResult(result)">
              {{ result.label }}
            </button>
          </li>
        </ul>
      </div>

      <div class="grid max-w-md grid-cols-3 gap-2">
        <div class="flex flex-col gap-1">
          <label for="location-lat" class="text-sm font-medium">Latitude</label>
          <input
            id="location-lat" v-model.number="form.lat"
            type="number" step="any"
            min="-90" max="90"
            required
          >
        </div>
        <div class="flex flex-col gap-1">
          <label for="location-lng" class="text-sm font-medium">Longitude</label>
          <input
            id="location-lng" v-model.number="form.lng"
            type="number" step="any"
            min="-180" max="180"
            required
          >
        </div>
        <div class="flex flex-col gap-1">
          <label for="location-zoom" class="text-sm font-medium">Zoom</label>
          <input
            id="location-zoom" v-model.number="form.zoom"
            type="number" min="1"
            max="19" required
          >
        </div>
      </div>

      <div v-if="hasCoordinates" class="overflow-hidden rounded-xl border">
        <UserLocation :location="{ lat: form.lat, lng: form.lng, zoom: form.zoom }" :interactive="true" @move="onMapMove" />
      </div>
      <p v-else class="text-xs text-muted-foreground">
        Search for a place or enter coordinates to preview the map. Click or drag the pin to adjust.
      </p>

      <footer class="flex flex-row items-center justify-end">
        <div class="navigation-group">
          <button type="button" class="btn-ghost" @click="handleCancel">
            Cancel
          </button>
          <button type="submit" class="btn-success" :disabled="!canSubmit">
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
const { isLocationDialogOpen, selectedLocation } = useUIState()
const form = ref({ label: "", lat: NaN, lng: NaN, zoom: 14 })
const searchQuery = ref("")
const searchResults = ref<{ label: string, lat: number, lng: number }[]>([])
const searching = ref(false)
const editingId = ref<string | null>(null)
const isUpdateMode = computed(() => !!editingId.value)
const hasCoordinates = computed(() => Number.isFinite(form.value.lat) && Number.isFinite(form.value.lng))
const canSubmit = computed(() => hasCoordinates.value && Number.isFinite(form.value.zoom) && form.value.zoom >= 1 && form.value.zoom <= 19)

function onMapMove(payload: { lat: number, lng: number, zoom: number }) {
  form.value.lat = Number(payload.lat.toFixed(6))
  form.value.lng = Number(payload.lng.toFixed(6))
  form.value.zoom = payload.zoom
}

async function searchPlaces() {
  const q = searchQuery.value.trim()
  if (q.length < 2) {
    return
  }

  searching.value = true
  const searchResult = await Promise.allSettled([profileItemsStore.searchGeocode(q)])
  searchResults.value = searchResult[0].status === "fulfilled" ? searchResult[0].value?.results ?? [] : []
  searching.value = false
}

function selectResult(result: { label: string, lat: number, lng: number }) {
  form.value.lat = result.lat
  form.value.lng = result.lng
  if (!form.value.label.trim()) {
    form.value.label = result.label.split(",")[0]?.trim() || result.label
  }
  searchResults.value = []
  searchQuery.value = result.label
}

async function handleSubmit() {
  if (!canSubmit.value) {
    return
  }

  const location = {
    label: form.value.label.trim() || null,
    lat: form.value.lat,
    lng: form.value.lng,
    zoom: form.value.zoom,
  }

  if (isUpdateMode.value && editingId.value) {
    await profileItemsStore.updateItem(editingId.value, { location })
  }
  else {
    await profileItemsStore.createItem({
      type: "LOCATION",
      isPinned: false,
      isVisible: true,
      location,
    })
  }
  handleCancel()
}

function handleCancel() {
  resetForm()
  emit("close")
}

function resetForm() {
  editingId.value = null
  form.value = { label: "", lat: NaN, lng: NaN, zoom: 14 }
  searchQuery.value = ""
  searchResults.value = []
}

// Populate form from the selected location
watch(() => selectedLocation.value, (item) => {
  if (item?.location) {
    editingId.value = item.id
    form.value = {
      label: item.location.label ?? "",
      lat: item.location.lat,
      lng: item.location.lng,
      zoom: item.location.zoom ?? 14,
    }
    searchQuery.value = item.location.label ?? ""
  }
  else {
    resetForm()
  }
}, { immediate: true })
</script>
