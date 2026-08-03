<template>
  <li v-if="preferences" class="flex w-full min-w-32 flex-col gap-2 text-start">
    <div class="w-full overflow-hidden" :style="mapShellStyle">
      <ClientOnly>
        <div ref="container" class="map-embed z-0 size-full h-44 min-h-40 overflow-hidden" />
      </ClientOnly>
    </div>
    <div v-if="location.label" class="px-1">
      <p class="truncate text-sm font-medium" :style="linkInnerStyle">
        {{ location.label }}
      </p>
      <nuxt-link :to="openStreetMapUrl" target="_blank" class="text-xs opacity-80 hover:underline" :style="linkInnerStyle">
        Open in OpenStreetMap
      </nuxt-link>
    </div>
    <nuxt-link
      v-else :to="openStreetMapUrl"
      target="_blank" class="px-1 text-xs opacity-80 hover:underline"
      :style="linkInnerStyle"
    >
      Open in OpenStreetMap
    </nuxt-link>
  </li>
  <ClientOnly v-else>
    <div ref="container" class="map-embed z-0 size-full h-44 min-h-40 overflow-hidden" />
  </ClientOnly>
</template>

<script setup lang="ts">
import type { Map as LeafletMap, Marker } from "leaflet"
import "leaflet/dist/leaflet.css"

const props = defineProps<{
  location: Pick<ProfileItemLocation, "lat" | "lng" | "zoom"> & { label?: string | null }
  preferences?: UserPreferences
  interactive?: boolean
}>()

const emit = defineEmits<{ move: [payload: { lat: number, lng: number, zoom: number }] }>()

const { linkStyle, linkInnerStyle } = useDynamicStyles(toRef(props, "preferences"))
const container = ref<HTMLElement | null>(null)
let map: LeafletMap | null = null
let marker: Marker | null = null
const mapShellStyle = computed(() => ({ ...linkStyle(), padding: "0", overflow: "hidden" }))
const openStreetMapUrl = computed(() => {
  const { lat, lng, zoom } = props.location
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${zoom}/${lat}/${lng}`
})

async function initMap() {
  if (!import.meta.client || !container.value || map) {
    return
  }

  const L = await import("leaflet")
  delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  })

  map = L.map(container.value, {
    center: [props.location.lat, props.location.lng],
    zoom: props.location.zoom,
    zoomControl: props.interactive,
    dragging: props.interactive,
    scrollWheelZoom: props.interactive,
    doubleClickZoom: props.interactive,
    boxZoom: props.interactive,
    keyboard: props.interactive,
    touchZoom: props.interactive,
    attributionControl: true,
  })

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a>",
    maxZoom: 19,
  }).addTo(map)

  marker = L.marker([props.location.lat, props.location.lng], { draggable: props.interactive }).addTo(map)

  if (props.interactive) {
    marker.on("dragend", () => {
      if (!marker || !map) {
        return
      }
      const { lat, lng } = marker.getLatLng()
      emit("move", { lat, lng, zoom: map.getZoom() })
    })

    map.on("click", (event) => {
      if (!marker || !map) {
        return
      }
      marker.setLatLng(event.latlng)
      emit("move", { lat: event.latlng.lat, lng: event.latlng.lng, zoom: map.getZoom() })
    })

    map.on("zoomend", () => {
      if (!marker || !map) {
        return
      }
      const { lat, lng } = marker.getLatLng()
      emit("move", { lat, lng, zoom: map.getZoom() })
    })
  }

  requestAnimationFrame(() => {
    map?.invalidateSize()
    setTimeout(() => map?.invalidateSize(), 150)
  })
}

function syncView() {
  if (!map || !marker) {
    return
  }
  const current = marker.getLatLng()
  if (Math.abs(current.lat - props.location.lat) > 1e-6 || Math.abs(current.lng - props.location.lng) > 1e-6) {
    marker.setLatLng([props.location.lat, props.location.lng])
    map.setView([props.location.lat, props.location.lng], props.location.zoom)
  }
  else if (map.getZoom() !== props.location.zoom) {
    map.setZoom(props.location.zoom)
  }
  map.invalidateSize()
}

watch(() => [props.location.lat, props.location.lng, props.location.zoom] as const, () => syncView())
watch(container, (el) => {
  if (el) {
    initMap()
  }
})

onBeforeUnmount(() => {
  map?.remove()
  map = null
  marker = null
})
</script>

<style>
.map-embed .leaflet-container {
  font: inherit;
  background: #f9fafb;
}
</style>
