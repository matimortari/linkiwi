<template>
  <div class="card flex flex-col gap-4">
    <h3>
      My Links
    </h3>

    <div class="flex flex-col gap-2">
      <Loading v-if="loading" />
      <Empty v-else-if="!links.length" message="Your links help visitors discover more about you. Add your first link!" icon-name="mdi:link-variant-minus" />

      <VueDraggable
        v-else v-model="orderedLinks"
        tag="ul" class="grid grid-cols-1 gap-2 md:grid-cols-2"
        handle=".drag-handle" :animation="150"
        @end="handleReorderLink"
      >
        <li v-for="link in orderedLinks" :key="link.id" class="card flex flex-col gap-2">
          <div class="flex flex-row items-center justify-between font-semibold">
            <div class="navigation-group">
              <button class="drag-handle btn-ghost cursor-move p-0.5!" aria-label="Drag to reorder">
                <icon name="mdi:drag-vertical" size="25" class="text-muted" />
              </button>
              <span>{{ link.title }}</span>
            </div>

            <div class="flex flex-row items-center gap-1">
              <button aria-label="Update Link" class="btn-ghost p-0.5!" @click="handleUpdateLink(link)">
                <icon name="mdi:circle-edit-outline" size="25" class="text-primary" />
              </button>
              <button aria-label="Delete Link" class="btn-ghost p-0.5!" @click="handleDeleteLink(link.id!)">
                <icon name="mdi:remove-circle-outline" size="25" class="text-danger" />
              </button>
            </div>
          </div>

          <nuxt-link :to="link.url" class="text-caption truncate hover:underline">
            {{ link.url }}
          </nuxt-link>
        </li>
      </VueDraggable>

      <button class="btn-primary self-end" aria-label="Add Link" @click="handleAddLink">
        <icon name="mdi:link-variant-plus" size="25" />
        <span>Add Link</span>
      </button>
    </div>
  </div>

  <ProfileLinkDialog :is-open="isDialogOpen" :selected-link="selectedLink" @close="handleCloseDialog" />
</template>

<script setup lang="ts">
import { VueDraggable } from "vue-draggable-plus"

const linksStore = useLinksStore()
const { links, loading } = storeToRefs(linksStore)
const isDialogOpen = ref(false)
const selectedLink = ref<Link | null>(null)
const orderedLinks = ref<Link[]>([])

function handleAddLink() {
  selectedLink.value = null
  isDialogOpen.value = true
}

function handleUpdateLink(link: Link) {
  selectedLink.value = link
  isDialogOpen.value = true
}

function handleCloseDialog() {
  isDialogOpen.value = false
  selectedLink.value = null
}

async function handleReorderLink() {
  const updates = orderedLinks.value.map((link, index) => ({ id: link.id!, order: index }))
  for (const { id, order } of updates) {
    try {
      await linksStore.updateLink(id, { order })
    }
    catch (error) {
      console.error(`Failed to update order for link ${id}:`, error)
    }
  }
}

async function handleDeleteLink(linkId: string) {
  if (!confirm("Are you sure you want to delete this link?")) {
    return
  }

  await linksStore.deleteLink(linkId)
}

// Sync store links to local orderedLinks
watch(links, (newLinks) => {
  orderedLinks.value = [...newLinks]
}, { immediate: true })
</script>
