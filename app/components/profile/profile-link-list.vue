<template>
  <div class="card flex flex-col gap-4">
    <h3>
      My Links
    </h3>

    <div class="flex flex-col gap-2">
      <Spinner v-if="loading" />
      <Empty v-if="!links.length" message="Your links help visitors discover more about you. Add your first link!" icon-name="mdi:link-variant-minus" />

      <ul v-else class="grid grid-cols-1 gap-2 md:grid-cols-2">
        <li v-for="link in links" :key="link.id" class="card flex flex-col gap-2">
          <div class="flex flex-row items-center justify-between font-semibold">
            <span>{{ link.title }}</span>

            <div class="flex flex-row items-center gap-1">
              <button aria-label="Update Link" class="flex items-center transition-transform hover:scale-110" @click="handleUpdateLink(link)">
                <icon name="mdi:circle-edit-outline" size="25" class="text-primary" />
              </button>
              <button aria-label="Delete Link" class="flex items-center transition-transform hover:scale-110" @click="handleDeleteLink(link.id!)">
                <icon name="mdi:remove-circle-outline" size="25" class="text-danger" />
              </button>
            </div>
          </div>

          <nuxt-link :to="link.url" class="text-caption truncate hover:underline">
            {{ link.url }}
          </nuxt-link>
        </li>
      </ul>

      <button class="btn-primary self-end" aria-label="Add Link" @click="isDialogOpen = true">
        <icon name="mdi:link-variant-plus" size="25" />
        <span>Add Link</span>
      </button>
    </div>
  </div>

  <ProfileLinkDialog :is-open="isDialogOpen" :selected-link="selectedLink" @close="isDialogOpen = false ; selectedLink = null" />
</template>

<script setup lang="ts">
const linksStore = useLinksStore()
const { links, loading } = storeToRefs(linksStore)
const isDialogOpen = ref(false)
const selectedLink = ref<Link | null>(null)

function handleUpdateLink(link: Link) {
  selectedLink.value = link
  isDialogOpen.value = true
}

async function handleDeleteLink(linkId: string) {
  if (!confirm("Are you sure you want to delete this link?")) {
    return
  }

  await linksStore.deleteLink(linkId)
}
</script>
