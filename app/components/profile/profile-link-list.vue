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
        tag="ul" class="grid grid-cols-1 gap-2 md:grid-cols-2 2xl:grid-cols-3"
        handle=".drag-handle" :animation="150"
        @end="reorderLink"
      >
        <li v-for="link in orderedLinks" :key="link.id" class="card flex flex-col gap-2" :class="{ 'border-dashed! opacity-60': !link.isVisible }">
          <div class="flex flex-row items-center justify-between font-semibold">
            <div class="navigation-group">
              <button class="drag-handle btn-ghost cursor-move p-0.5!" aria-label="Drag to reorder">
                <icon name="mdi:drag-vertical" size="25" class="text-muted" />
              </button>
              <span :class="{ 'text-muted-foreground': !link.isVisible }">{{ link.title }}</span>
            </div>

            <div class="flex flex-row items-center gap-1">
              <button :aria-label="link.isVisible ? 'Hide Link' : 'Show Link'" class="btn-ghost p-0.5!" @click="toggleVisibility(link.id!, link.isVisible ?? true)">
                <icon :name="link.isVisible !== false ? 'mdi:eye-outline' : 'mdi:eye-off-outline'" size="25" class="text-muted-foreground" />
              </button>
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

      <button class="btn-primary self-end" @click="handleAddLink">
        <icon name="mdi:link-variant-plus" size="25" />
        <span>Add Link</span>
      </button>
    </div>
  </div>

  <ProfileLinkDialog :is-open="isLinkDialogOpen" @close="closeDialog('link')" />
</template>

<script setup lang="ts">
import { VueDraggable } from "vue-draggable-plus"

const linksStore = useLinksStore()
const { links, loading } = storeToRefs(linksStore)
const { uiState, isLinkDialogOpen, openDialog, closeDialog } = useUIState()
const orderedLinks = ref<Link[]>([])

function handleAddLink() {
  uiState.dialogs.link.selectedLink = null
  openDialog("link")
}

function handleUpdateLink(link: Link) {
  uiState.dialogs.link.selectedLink = link
  openDialog("link")
}

async function reorderLink() {
  const previousOrder = [...orderedLinks.value]
  const updates = orderedLinks.value.map((link, index) => ({ id: link.id!, order: index })).filter(({ id, order }) => {
    const existing = links.value.find(link => link.id === id)
    return existing?.order !== order
  })
  if (!updates.length) {
    return
  }

  try {
    await Promise.all(updates.map(({ id, order }) => linksStore.updateLink(id, { order })))
    linksStore.links.sort((a, b) => a.order - b.order)
  }
  catch {
    orderedLinks.value = previousOrder
    await linksStore.getLinks().catch(() => {})
  }
}

async function handleDeleteLink(linkId: string) {
  if (!confirm("Are you sure you want to delete this link?")) {
    return
  }

  await linksStore.deleteLink(linkId)
}

async function toggleVisibility(linkId: string, currentVisibility: boolean) {
  await linksStore.updateLink(linkId, { isVisible: !currentVisibility })
}

// Sync store links to local orderedLinks
watch(() => links.value, (newLinks) => {
  orderedLinks.value = [...newLinks]
}, { immediate: true, deep: true })
</script>
