<template>
  <div class="section-container flex flex-col gap-2">
    <header class="my-2 flex flex-col gap-1">
      <h3>
        My Links
      </h3>
      <p class="text-caption">
        Manage your links.
      </p>
    </header>

    <Spinner v-if="loading" />
    <p v-else-if="!links.length" class="text-lead m-8 text-center">
      Your links help visitors discover more about you. Add your first link!
    </p>

    <ul v-else class="grid grid-cols-1 gap-2 md:grid-cols-2 2xl:grid-cols-3">
      <li v-for="link in links" :key="link.id" class="card">
        <div class="flex flex-col gap-2">
          <div class="flex flex-row items-center justify-between">
            <nuxt-link :to="link.url" class="max-w-[80%] truncate font-semibold">
              {{ link.title }}
            </nuxt-link>

            <div class="flex flex-row items-center gap-1">
              <button aria-label="Update Link" class="flex items-center" @click="handleUpdateLink(link)">
                <icon name="mdi:circle-edit-outline" size="25" class="hover:scale-md text-primary transition-all" />
              </button>
              <button aria-label="Delete Link" class="flex items-center" @click="linkStore.deleteLink(link.id!)">
                <icon name="mdi:remove-circle-outline" size="25" class="hover:scale-md text-danger-foreground transition-all" />
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
      <icon name="mdi:link-add" size="25" />
      <span>Add Link</span>
    </button>
  </div>

  <ProfileLinkDialog :is-open="isDialogOpen" :selected-link="selectedLink" @close="isDialogOpen = false ; selectedLink = null" />
</template>

<script setup lang="ts">
const linkStore = useLinksStore()

const { links, loading } = storeToRefs(linkStore)
const isDialogOpen = ref(false)
const selectedLink = ref<Link | null>(null)

function handleUpdateLink(link: Link) {
  selectedLink.value = link
  isDialogOpen.value = true
}
</script>
