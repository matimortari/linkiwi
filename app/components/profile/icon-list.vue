<template>
  <div class="flex flex-col gap-3">
    <Loading v-if="loading" />

    <template v-else>
      <ul v-if="icons.length" class="flex flex-row flex-wrap items-center gap-3">
        <li v-for="icon in icons" :key="icon.id" class="card relative flex size-16 items-center justify-center" :class="{ 'border-dashed! opacity-60': !icon.isVisible }">
          <nuxt-link :to="icon.url" class="btn-ghost" :aria-label="icon.platform" target="_blank">
            <icon :name="icon.logo" size="25" />
          </nuxt-link>

          <button :aria-label="icon.isVisible ? 'Hide Icon' : 'Show Icon'" class="btn-ghost absolute top-0 right-0 p-0.5!" @click="toggleVisibility(icon.id, icon.isVisible)">
            <icon :name="icon.isVisible ? 'mdi:eye-outline' : 'mdi:eye-off-outline'" size="15" class="text-muted-foreground" />
          </button>

          <button class="btn-ghost absolute right-0 bottom-0 p-0.5!" aria-label="Delete Social Icon" @click="handleDelete(icon.id)">
            <icon name="mdi:remove-circle-outline" size="15" class="text-caption-danger" />
          </button>
        </li>
      </ul>

      <button class="btn-ghost self-start text-sm" @click="openDialog('icon')">
        <icon name="mdi:star-plus" size="20" />
        <span>Add Social Icon</span>
      </button>
    </template>
  </div>

  <ProfileIconDialog :is-open="isIconDialogOpen" @close="closeDialog('icon')" />
</template>

<script setup lang="ts">
const profileItemsStore = useProfileItemsStore()
const { loading } = storeToRefs(profileItemsStore)
const { isIconDialogOpen, openDialog, closeDialog } = useUIState()

const icons = computed<NormalizedIcon[]>(() => (profileItemsStore.items || []).filter((item: ProfileItem) => item.type === "ICON" && item.icon).map((item: ProfileItem) => ({
  id: item.id,
  platform: item.icon!.platform ?? "",
  url: item.icon!.url ?? "",
  logo: item.icon!.logo ?? "",
  isVisible: item.isVisible,
  order: item.order,
})).sort((a, b) => a.order - b.order))

async function toggleVisibility(id: string, current: boolean) {
  await profileItemsStore.updateItem(id, { isVisible: !current })
}

async function handleDelete(id: string) {
  if (!confirm("Are you sure you want to delete this social icon?")) {
    return
  }
  await profileItemsStore.deleteItem(id)
}
</script>
