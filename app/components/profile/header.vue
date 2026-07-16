<template>
  <div
    v-motion :initial="{ opacity: 0, x: -20 }"
    :visible="{ opacity: 1, x: 0 }" :duration="800"
    class="relative flex flex-col gap-2 rounded-2xl border bg-card p-4 md:p-8"
  >
    <button
      type="button" class="group relative h-28 w-full overflow-hidden rounded-t-2xl bg-muted md:h-36"
      aria-label="Edit banner" @click="isBannerDialogOpen = true"
    >
      <img v-if="user?.banner?.url" :src="user.banner.url" alt="Banner" class="size-full object-cover">
      <span v-else class="text-caption flex size-full items-center justify-center">No banner uploaded</span>
      <div class="absolute inset-0 hidden items-center justify-center bg-muted/30 opacity-0 backdrop-blur-xs transition-all md:flex md:group-hover:opacity-100">
        <icon name="mdi:image-edit-outline" size="30" class="text-foreground" />
      </div>
      <span class="absolute top-2 right-2 flex size-8 items-center justify-center rounded-lg border bg-card/80 md:hidden">
        <icon name="mdi:image-edit-outline" size="20" />
      </span>
    </button>

    <div class="flex flex-col gap-2 md:mx-4">
      <div v-if="user" class="flex items-start gap-2 md:gap-4">
        <div class="group relative -mt-10 ml-4 size-24 shrink-0">
          <div class="size-full overflow-hidden rounded-full border-4 border-card">
            <img :src="user.image" alt="Avatar" class="size-full object-cover select-none">
            <button
              type="button" class="absolute inset-0 hidden cursor-pointer items-center justify-center bg-muted/30 opacity-0 backdrop-blur-xs transition-all md:flex md:group-hover:opacity-100"
              aria-label="Change picture" @click="avatarInput?.click()"
            >
              <icon name="mdi:camera" size="20" />
            </button>
          </div>
          <input
            ref="avatarInput" type="file"
            accept="image/*" class="hidden"
            @change="handleUpdateImage"
          >
          <button
            type="button" class="absolute -right-1 -bottom-1 flex size-7 items-center justify-center rounded-full border-2 border-card bg-card md:hidden"
            aria-label="Change picture" @click="avatarInput?.click()"
          >
            <icon name="mdi:camera" size="15" />
          </button>
        </div>

        <div class="flex min-w-0 flex-1 flex-col">
          <div class="flex flex-row items-center gap-1">
            <p class="truncate text-sm font-semibold">
              @{{ user.slug }}
            </p>
            <button class="btn-ghost shrink-0" aria-label="Edit profile settings" @click="isProfileSettingsOpen = true">
              <icon name="mdi:circle-edit-outline" size="25" class="text-muted-foreground" />
            </button>
          </div>
          <div class="hidden flex-row items-center gap-4 md:flex">
            <span v-if="user.description" class="text-caption truncate">{{ user.description }}</span>
            <p class="flex flex-row items-center gap-1">
              <icon name="mdi:map-marker" size="15" class="text-muted-foreground" />
              <span v-if="user.location" class="text-caption truncate">{{ user.location }}</span>
            </p>
          </div>
        </div>
      </div>

      <ProfileIconList />
      <ProfileLinkList />
    </div>
  </div>

  <ProfileBannerDialog :is-open="isBannerDialogOpen" @close="isBannerDialogOpen = false" />
  <ProfileSettingsDialog :is-open="isProfileSettingsOpen" @close="isProfileSettingsOpen = false" />
</template>

<script setup lang="ts">
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const isProfileSettingsOpen = ref(false)
const isBannerDialogOpen = ref(false)
const avatarInput = ref<HTMLInputElement | null>(null)

async function handleUpdateImage(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) {
    return
  }

  const res = await userStore.updateUserImage(file)
  if (res?.imageUrl && user.value) {
    user.value.image = res.imageUrl
  }
  input.value = ""
}
</script>
