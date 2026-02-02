<template>
  <div class="card flex flex-col gap-4">
    <h3>
      My Social Icons
    </h3>

    <div class="flex flex-col gap-2">
      <Spinner v-if="loading" />
      <Empty v-if="!icons.length" message="Your social icons help visitors connect with you. Add your first social icon!" icon-name="mdi:star-minus" />

      <ul v-else class="flex flex-row items-center gap-2">
        <li v-for="icon in icons" :key="icon.id" class="card relative flex size-20 items-center justify-center">
          <nuxt-link :to="icon.url" class="transition-transform hover:scale-110">
            <icon :name="icon.logo" :size="30" />
          </nuxt-link>

          <button class="absolute right-0 bottom-0 flex items-center p-1 transition-transform hover:scale-110" aria-label="Delete Social Icon" @click="handleDeleteIcon(icon.id!)">
            <icon name="mdi:remove-circle-outline" size="25" class="text-danger" />
          </button>
        </li>
      </ul>

      <button class="btn-primary self-end" aria-label="Add Social Icon" @click="isDialogOpen = true">
        <icon name="mdi:star-plus" size="25" />
        <span>Add Social Icon</span>
      </button>
    </div>
  </div>

  <ProfileIconDialog :is-open="isDialogOpen" @close=" isDialogOpen = false" />
</template>

<script setup lang="ts">
const iconStore = useIconsStore()
const { icons, loading } = storeToRefs(iconStore)
const isDialogOpen = ref(false)

async function handleDeleteIcon(iconId: string) {
  if (!confirm("Are you sure you want to delete this social icon?")) {
    return
  }

  await iconStore.deleteIcon(iconId)
}
</script>
