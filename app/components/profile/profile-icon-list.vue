<template>
  <div class="section-container flex flex-col gap-2">
    <header class="my-2 flex flex-col gap-2">
      <h3>
        My Social Icons
      </h3>
      <p class="text-caption">
        Manage your social icons.
      </p>
    </header>

    <Spinner v-if="loading" />
    <p v-else-if="!icons.length" class="text-lead m-8 text-center">
      Pin social icons to your profile so visitors can easily connect. Add your first social icon!
    </p>

    <ul v-else class="flex flex-row items-center gap-2">
      <li v-for="icon in icons" :key="icon.id" class="card relative flex size-20 items-center justify-center">
        <nuxt-link :to="icon.url">
          <icon :name="icon.logo" :size="30" />
        </nuxt-link>

        <button class="absolute right-0 bottom-0 flex items-center p-1 transition-transform hover:scale-110" aria-label="Delete Social Icon" @click="iconStore.deleteIcon(icon.id!)">
          <icon name="mdi:remove-circle-outline" size="25" class="text-danger" />
        </button>
      </li>
    </ul>

    <button class="btn-primary self-end" aria-label="Add Social Icon" @click="isDialogOpen = true">
      <icon name="mdi:favorite-add" size="25" />
      <span>Add Social Icon</span>
    </button>
  </div>

  <ProfileIconDialog :is-open="isDialogOpen" @close=" isDialogOpen = false" />
</template>

<script setup lang="ts">
const iconStore = useIconsStore()
const { icons, loading } = storeToRefs(iconStore)
const isDialogOpen = ref(false)
</script>
