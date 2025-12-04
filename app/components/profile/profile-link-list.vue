<template>
  <div class="card flex flex-col gap-4">
    <header class="my-2 flex flex-col gap-2">
      <h3>
        My Links
      </h3>
      <p class="text-caption">
        Manage your links.
      </p>
    </header>

    <Spinner v-if="loading" />
    <Empty v-if="!links.length" message="Your links help visitors discover more about you. Add your first link!" icon-name="mdi:link-variant-minus" :icon-size="30" />

    <ul v-else class="grid grid-cols-1 gap-2 md:grid-cols-2 2xl:grid-cols-3">
      <li v-for="link in links" :key="link.id" class="card">
        <div class="flex flex-col gap-2">
          <div class="flex flex-row items-center justify-between">
            <nuxt-link :to="link.url" class="max-w-[80%] truncate font-semibold">
              {{ link.title }}
            </nuxt-link>

            <div class="flex flex-row items-center gap-1">
              <button aria-label="Update Link" class="flex items-center transition-transform hover:scale-110" @click="handleUpdateLink(link)">
                <icon name="mdi:circle-edit-outline" size="25" class="text-primary" />
              </button>
              <button aria-label="Delete Link" class="flex items-center transition-transform hover:scale-110" @click="linksStore.deleteLink(link.id!)">
                <icon name="mdi:remove-circle-outline" size="25" class="text-danger" />
              </button>
            </div>
          </div>

          <p class="text-caption truncate">
            {{ link.url }}
          </p>
        </div>
      </li>
    </ul>

    <button class="btn-primary self-end" aria-label="Add Link" @click="isDialogOpen = true">
      <icon name="mdi:link-variant-plus" size="25" />
      <span>Add Link</span>
    </button>
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
</script>
