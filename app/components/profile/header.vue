<template>
  <div
    v-motion :initial="{ opacity: 0, x: -20 }"
    :visible="{ opacity: 1, x: 0 }" :duration="800"
    class="relative flex flex-col gap-2 rounded-2xl border bg-card p-4 md:p-8"
  >
    <div class="group relative h-28 w-full md:h-36">
      <div class="relative size-full overflow-hidden rounded-t-2xl bg-muted">
        <img v-if="bannerPreview" :src="bannerPreview" alt="Banner" class="size-full object-cover">
        <span v-else class="text-caption flex size-full items-center justify-center">No banner uploaded</span>

        <input
          ref="bannerInput" type="file"
          class="hidden" accept="image/jpeg,image/png,image/webp"
          @change="handleBannerFileChange"
        >

        <div class="absolute inset-0 hidden items-center justify-center gap-2 bg-muted/30 opacity-0 backdrop-blur-xs transition-all md:flex md:group-hover:opacity-100">
          <button type="button" class="btn-ghost" :disabled="!showBannerAssetPicker && !userStore.assets.length" @click="toggleBannerAssetPicker">
            <icon :name="showBannerAssetPicker ? 'mdi:close' : 'mdi:image-multiple-outline'" size="20" />
            <span>{{ showBannerAssetPicker ? "Close" : "Pick from Library" }}</span>
          </button>
          <button type="button" class="btn-ghost" @click="bannerInput?.click()">
            <icon name="mdi:upload" size="20" />
            <span>Upload</span>
          </button>

          <button v-if="bannerFile || pendingBannerAsset" class="btn-primary" @click="handleSaveBanner">
            <icon :name="bannerAction.icon.value" size="20" />
            <span>Save</span>
          </button>
          <button v-if="bannerPreview" class="btn-ghost" aria-label="Remove banner" @click="handleRemoveBanner">
            <icon name="mdi:trash-can-outline" size="20" />
          </button>
        </div>
      </div>

      <!-- Mobile dropdown -->
      <div ref="mediaDropdownRef" class="absolute top-2 right-2 z-10 md:hidden">
        <div class="flex items-center gap-1">
          <button
            v-if="bannerFile || pendingBannerAsset"
            type="button" class="btn-primary rounded-lg p-1!"
            aria-label="Save banner" @click="handleMobileBannerSave"
          >
            <icon :name="bannerAction.icon.value" size="18" />
          </button>
          <button type="button" class="btn-ghost rounded-lg bg-card/80 p-1!" aria-label="Media options" @click="mediaDropdownOpen = !mediaDropdownOpen">
            <icon name="mdi:dots-vertical" size="20" />
          </button>
        </div>
        <div v-if="mediaDropdownOpen" class="absolute top-8 right-0 z-50 flex min-w-44 flex-col gap-1 rounded-xl border bg-card p-1 shadow-lg">
          <button
            type="button" class="text-caption navigation-group rounded-lg p-2 whitespace-nowrap hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
            :disabled="!showBannerAssetPicker && !userStore.assets.length" @click="handleMobileBannerPick"
          >
            <icon :name="showBannerAssetPicker ? 'mdi:close' : 'mdi:image-multiple-outline'" size="15" />
            <span>{{ showBannerAssetPicker ? "Close Library" : "Pick Banner" }}</span>
          </button>
          <button type="button" class="text-caption navigation-group rounded-lg p-2 whitespace-nowrap hover:bg-muted" @click="handleMobileBannerUpload">
            <icon name="mdi:upload" size="15" />
            <span>Upload Banner</span>
          </button>
          <button type="button" class="text-caption navigation-group rounded-lg p-2 whitespace-nowrap hover:bg-muted" @click="handleMobileAvatarUpload">
            <icon name="mdi:camera" size="15" />
            <span>Change Picture</span>
          </button>
          <button
            v-if="bannerPreview" type="button"
            class="text-caption navigation-group rounded-lg p-2 whitespace-nowrap text-danger-foreground hover:bg-danger/20" @click="handleMobileBannerRemove"
          >
            <icon name="mdi:trash-can-outline" size="15" class="text-caption-danger" />
            <span>Remove Banner</span>
          </button>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2 md:mx-4">
      <div v-if="showBannerAssetPicker" class="scroll-area flex max-h-32 flex-wrap gap-2 overflow-y-auto p-4 pb-0">
        <button
          v-for="asset in userStore.assets" :key="asset.id"
          type="button" class="group relative size-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all"
          :class="(pendingBannerAsset?.id ?? user?.banner?.assetId) === asset.id ? 'border-primary' : 'border-transparent hover:border-muted-foreground'" @click="selectBannerAsset(asset)"
        >
          <img :src="asset.url" :alt="asset.label ?? 'Asset'" class="size-full object-cover">
          <div v-if="(pendingBannerAsset?.id ?? user?.banner?.assetId) === asset.id" class="absolute inset-0 flex items-center justify-center bg-primary/30">
            <icon name="mdi:check" size="15" class="text-primary-foreground" />
          </div>
        </button>
      </div>

      <div v-if="user" class="flex items-start gap-2 md:gap-4">
        <div class="group relative -mt-10 ml-4 size-24 shrink-0 overflow-hidden rounded-full border-4 border-card">
          <img :src="user.image" alt="Avatar" class="size-full object-cover select-none">
          <input
            ref="avatarInput" type="file"
            accept="image/*" class="hidden"
            @change="handleUpdateImage"
          >

          <button
            type="button" class="absolute inset-0 hidden cursor-pointer items-center justify-center bg-muted/30 opacity-0 backdrop-blur-xs transition-all md:flex md:group-hover:opacity-100"
            aria-label="Change picture" @click="avatarInput?.click()"
          >
            <icon name="mdi:camera" size="20" />
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

      <div class="flex items-center gap-4 overflow-x-auto px-8 py-2 md:px-16">
        <VueDraggable
          v-model="orderedIcons" tag="ul"
          class="flex min-w-max items-center gap-8" handle=".drag-handle"
          :animation="150" @end="reorderIcons"
        >
          <li v-for="icon in orderedIcons" :key="icon.id" class="relative flex size-12 shrink-0 items-center justify-center rounded-full" :class="{ 'opacity-60': !icon.isVisible }">
            <button class="drag-handle btn-ghost absolute -top-2 -left-2 cursor-move p-0!" aria-label="Drag to reorder">
              <icon name="mdi:drag-vertical" size="25" class="text-muted" />
            </button>
            <nuxt-link :to="icon.url" class="btn-ghost" :aria-label="icon.platform" target="_blank">
              <icon :name="icon.logo" size="30" />
            </nuxt-link>
            <button class="btn-ghost absolute -right-2 -bottom-2 p-0!" aria-label="Delete" @click="handleDeleteIcon(icon.id)">
              <icon name="mdi:remove-circle-outline" size="20" class="text-caption-danger" />
            </button>
          </li>
        </VueDraggable>

        <button class="btn-ghost" aria-label="Add social icon" @click="openDialog('icon')">
          <icon name="mdi:plus" size="35" class="text-muted-foreground" />
        </button>
      </div>

      <Loading v-if="loading" />

      <template v-else>
        <Empty v-if="!mainItems.length" message="Customize your profile by adding links and content." icon-name="mdi:shape" />

        <VueDraggable
          v-else v-model="orderedItems"
          tag="ul" class="flex flex-col gap-2"
          handle=".drag-handle" :animation="150"
          @end="reorderItems"
        >
          <li v-for="item in orderedItems" :key="item.id">
            <div v-if="item.type === 'DIVIDER'" class="card navigation-group justify-between py-2!" :class="{ 'opacity-50': !item.isVisible }">
              <div class="navigation-group">
                <button class="drag-handle btn-ghost cursor-move p-0!" aria-label="Drag to reorder">
                  <icon name="mdi:drag-vertical" size="25" class="text-muted" />
                </button>
                <icon name="mdi:minus" size="20" class="text-muted-foreground" />
                <span class="text-xs text-muted-foreground italic">Divider</span>
              </div>
              <ProfileItemRowActions
                :item="item" :is-scheduled="!!(item.scheduledStart || item.scheduledEnd)"
                :show-edit="false" @toggle="toggleItemVisibility(item.id, item.isVisible)"
                @pin="togglePin(item.id, item.isPinned)" @schedule="openSchedule(item)"
                @delete="handleDeleteItem(item.id)"
              />
            </div>

            <div v-else-if="item.type === 'LINK' && item.link" class="card flex flex-col gap-1" :class="{ 'border-dashed! opacity-60': !item.isVisible }">
              <div class="flex items-center justify-between">
                <div class="navigation-group min-w-0">
                  <button class="drag-handle btn-ghost cursor-move p-0!" aria-label="Drag to reorder">
                    <icon name="mdi:drag-vertical" size="25" class="text-muted" />
                  </button>
                  <img v-if="item.link.imageUrl" :src="item.link.imageUrl" :alt="item.link.label" class="size-6 shrink-0 rounded-full object-cover">
                  <icon v-else name="mdi:link-variant" size="20" class="shrink-0 text-muted-foreground" />
                  <span class="truncate text-sm font-semibold" :class="{ 'text-muted-foreground': !item.isVisible }">{{ item.link.label }}</span>
                </div>
                <ProfileItemRowActions
                  :item="item" :is-scheduled="!!(item.scheduledStart || item.scheduledEnd)"
                  @toggle="toggleItemVisibility(item.id, item.isVisible)" @pin="togglePin(item.id, item.isPinned)"
                  @schedule="openSchedule(item)" @edit="handleEdit(item)"
                  @delete="handleDeleteItem(item.id)"
                />
              </div>
              <nuxt-link :to="item.link.url" class="truncate pl-8 text-xs text-muted-foreground hover:underline" target="_blank">
                {{ item.link.url }}
              </nuxt-link>
            </div>

            <div v-else-if="item.type === 'WIDGET' && item.widget" class="card flex flex-col gap-0.5" :class="{ 'border-dashed! opacity-60': !item.isVisible }">
              <div class="flex items-center justify-between">
                <div class="navigation-group min-w-0">
                  <button class="drag-handle btn-ghost cursor-move p-0!" aria-label="Drag to reorder">
                    <icon name="mdi:drag-vertical" size="25" class="text-muted" />
                  </button>
                  <icon :name="WIDGET_ICONS[item.widget.type]" size="20" class="shrink-0 text-muted-foreground" />
                  <span class="truncate text-sm font-semibold" :class="{ 'text-muted-foreground': !item.isVisible }">{{ WIDGET_LABELS[item.widget.type] }}</span>
                </div>
                <ProfileItemRowActions
                  :item="item" :is-scheduled="!!(item.scheduledStart || item.scheduledEnd)"
                  @toggle="toggleItemVisibility(item.id, item.isVisible)" @pin="togglePin(item.id, item.isPinned)"
                  @schedule="openSchedule(item)" @edit="handleEdit(item)"
                  @delete="handleDeleteItem(item.id)"
                />
              </div>
              <span class="truncate pl-8 text-xs text-muted-foreground">{{ item.widget.handle }}</span>
            </div>

            <div v-else-if="item.type === 'PHOTO_GRID'" class="card flex flex-col gap-1" :class="{ 'border-dashed! opacity-60': !item.isVisible }">
              <div class="flex items-center justify-between">
                <div class="navigation-group min-w-0">
                  <button class="drag-handle btn-ghost cursor-move p-0!" aria-label="Drag to reorder">
                    <icon name="mdi:drag-vertical" size="25" class="text-muted" />
                  </button>
                  <icon name="mdi:image-multiple-outline" size="20" class="shrink-0 text-muted-foreground" />
                  <span class="text-sm font-semibold" :class="{ 'text-muted-foreground': !item.isVisible }">Photo Grid</span>
                </div>
                <ProfileItemRowActions
                  :item="item" :is-scheduled="!!(item.scheduledStart || item.scheduledEnd)"
                  @toggle="toggleItemVisibility(item.id, item.isVisible)" @pin="togglePin(item.id, item.isPinned)"
                  @schedule="openSchedule(item)" @edit="handleEdit(item)"
                  @delete="handleDeleteItem(item.id)"
                />
              </div>
              <span class="truncate pl-8 text-xs text-muted-foreground">{{ getPhotoGridLabel(item) }}</span>
            </div>
          </li>
        </VueDraggable>

        <div v-if="isPicking" class="flex flex-col gap-2 rounded-2xl border bg-card p-4 md:p-8">
          <p class="text-sm font-medium">
            What do you want to add?
          </p>
          <div class="flex flex-row flex-wrap gap-2">
            <button
              v-for="option in ITEM_TYPES" :key="option.type"
              type="button" class="card navigation-group p-2! hover:bg-muted! disabled:pointer-events-none disabled:opacity-40"
              :disabled="option.type === 'PHOTO_GRID' && !userStore.assets.length" @click="handlePickType(option.type)"
            >
              <icon :name="option.icon" size="20" />
              <span class="text-sm">{{ option.label }}</span>
            </button>
          </div>
          <div class="flex justify-end">
            <button class="btn-ghost" @click="isPicking = false">
              <icon name="mdi:close" size="20" />
              <span>Cancel</span>
            </button>
          </div>
        </div>

        <button v-else class="btn-primary self-end" @click="isPicking = true">
          <icon name="mdi:plus" size="20" />
          <span>Add Item</span>
        </button>
      </template>
    </div>
  </div>

  <ProfileLinkDialog :is-open="isLinkDialogOpen" @close="closeDialog('link')" />
  <ProfileIconDialog :is-open="isIconDialogOpen" @close="closeDialog('icon')" />
  <ProfileWidgetDialog :is-open="isWidgetDialogOpen" @close="closeDialog('widget')" />
  <ProfilePhotoGridDialog :is-open="uiState.dialogs.photoGrid.isOpen" @close="closeDialog('photoGrid')" />
  <ProfileScheduleDialog :is-open="isScheduleDialogOpen" :item="schedulingItem" @close="closeScheduleDialog" />
  <ProfileSettingsDialog :is-open="isProfileSettingsOpen" @close="isProfileSettingsOpen = false" />
</template>

<script setup lang="ts">
import { VueDraggable } from "vue-draggable-plus"

const { createActionHandler } = useActionIcon()
const userStore = useUserStore()
const profileItemsStore = useProfileItemsStore()
const { loading } = storeToRefs(profileItemsStore)
const { user } = storeToRefs(userStore)
const { uiState, isLinkDialogOpen, isIconDialogOpen, isWidgetDialogOpen, openDialog, closeDialog } = useUIState()
const isPicking = ref(false)
const isScheduleDialogOpen = ref(false)
const schedulingItem = ref<ProfileItem | null>(null)
const orderedItems = ref<ProfileItem[]>([])
const orderedIcons = ref<NormalizedIcon[]>([])
const isProfileSettingsOpen = ref(false)
const bannerInput = ref<HTMLInputElement | null>(null)
const avatarInput = ref<HTMLInputElement | null>(null)
const bannerFile = ref<File | null>(null)
const pendingBannerAsset = ref<{ id: string, url: string } | null>(null)
const bannerPreview = ref<string | null>(user.value?.banner?.url ?? null)
const showBannerAssetPicker = ref(false)
const bannerAction = createActionHandler("mdi:content-save-check")
const mediaDropdownOpen = ref(false)
const mediaDropdownRef = ref<HTMLElement | null>(null)
useClickOutside(mediaDropdownRef, () => mediaDropdownOpen.value = false, { escapeKey: true })
const icons = computed<NormalizedIcon[]>(() => (profileItemsStore.items || []).filter((item: ProfileItem) => item.type === "ICON" && item.icon).map((item: ProfileItem) => ({
  id: item.id,
  platform: item.icon!.platform ?? "",
  url: item.icon!.url ?? "",
  logo: item.icon!.logo ?? "",
  isVisible: item.isVisible,
  order: item.order,
})).sort((a, b) => a.order - b.order))

const mainItems = computed<ProfileItem[]>(() => (profileItemsStore.items || []).filter((item: ProfileItem) => item.type !== "ICON").sort((a, b) => {
  if (a.isPinned !== b.isPinned) {
    return a.isPinned ? -1 : 1
  }
  return a.order - b.order
}))

function clearBannerFileInput() {
  bannerFile.value = null
  if (bannerInput.value) {
    bannerInput.value.value = ""
  }
}

function handleMobileBannerPick() {
  toggleBannerAssetPicker()
  mediaDropdownOpen.value = false
}

function handleMobileBannerUpload() {
  mediaDropdownOpen.value = false
  bannerInput.value?.click()
}

async function handleMobileBannerSave() {
  mediaDropdownOpen.value = false
  await handleSaveBanner()
}

async function handleMobileBannerRemove() {
  mediaDropdownOpen.value = false
  await handleRemoveBanner()
}

function handleMobileAvatarUpload() {
  mediaDropdownOpen.value = false
  avatarInput.value?.click()
}

function handleBannerFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) {
    return
  }

  bannerFile.value = file
  pendingBannerAsset.value = null
  bannerPreview.value = URL.createObjectURL(file)
  showBannerAssetPicker.value = false
}

function selectBannerAsset(asset: { id: string, url: string }) {
  if (user.value?.banner?.assetId === asset.id && !bannerFile.value) {
    pendingBannerAsset.value = null
    bannerPreview.value = asset.url
    return
  }

  clearBannerFileInput()
  pendingBannerAsset.value = { id: asset.id, url: asset.url }
  bannerPreview.value = asset.url
}

async function toggleBannerAssetPicker() {
  if (!showBannerAssetPicker.value && !userStore.assets.length) {
    return
  }
  showBannerAssetPicker.value = !showBannerAssetPicker.value
}

async function handleSaveBanner() {
  if (bannerFile.value) {
    const uploadedAsset = await userStore.uploadAsset(bannerFile.value)
    if (uploadedAsset?.newAsset) {
      await userStore.updateUserBanner({ url: uploadedAsset.newAsset.url, assetId: uploadedAsset.newAsset.id })
      bannerAction.triggerSuccess()
    }
    clearBannerFileInput()
    pendingBannerAsset.value = null
    showBannerAssetPicker.value = false
    return
  }

  if (pendingBannerAsset.value) {
    await userStore.updateUserBanner({
      url: pendingBannerAsset.value.url,
      assetId: pendingBannerAsset.value.id,
    })
    bannerAction.triggerSuccess()
    pendingBannerAsset.value = null
    showBannerAssetPicker.value = false
  }
}

async function handleRemoveBanner() {
  if (bannerFile.value || pendingBannerAsset.value) {
    clearBannerFileInput()
    pendingBannerAsset.value = null
    bannerPreview.value = user.value?.banner?.url ?? null
    return
  }
  if (!user.value?.banner) {
    return
  }
  if (!confirm("Are you sure you want to remove your profile banner?")) {
    return
  }
  await userStore.deleteUserBanner()
  bannerPreview.value = null
  clearBannerFileInput()
  pendingBannerAsset.value = null
}

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

function getPhotoGridLabel(item: ProfileItem) {
  const count = item.photoGrid?.photos?.length ?? 0
  return count === 1 ? "1 photo" : `${count} photos`
}

async function handlePickType(type: ProfileItemType) {
  if (type === "PHOTO_GRID" && !userStore.assets.length) {
    return
  }
  isPicking.value = false
  if (type === "LINK") {
    uiState.dialogs.link.selectedLink = null
    openDialog("link")
    return
  }
  if (type === "ICON") {
    openDialog("icon")
    return
  }
  if (type === "WIDGET") {
    uiState.dialogs.widget.selectedWidget = null
    openDialog("widget")
    return
  }
  if (type === "PHOTO_GRID") {
    openDialog("photoGrid")
    return
  }
  if (type === "DIVIDER") {
    await profileItemsStore.createItem({ type: "DIVIDER", isPinned: false, isVisible: true })
  }
}

function handleEdit(item: ProfileItem) {
  if (item.type === "LINK") {
    openDialog("link", { item })
    return
  }
  if (item.type === "WIDGET") {
    openDialog("widget", { item })
    return
  }
  if (item.type === "PHOTO_GRID") {
    openDialog("photoGrid", { item })
  }
}

async function reorderIcons() {
  const updates = orderedIcons.value.map((icon, index) => ({ id: icon.id, order: index })).filter(({ id, order }) => icons.value.find(i => i.id === id)?.order !== order)
  if (!updates.length) {
    return
  }
  await Promise.all(updates.map(({ id, order }) => profileItemsStore.updateItem(id, { order })))
}

async function reorderItems() {
  const updates = orderedItems.value.map((item, index) => ({ id: item.id, order: index })).filter(({ id, order }) => mainItems.value.find(i => i.id === id)?.order !== order)
  if (!updates.length) {
    return
  }

  const results = await Promise.all(updates.map(({ id, order }) => profileItemsStore.updateItem(id, { order })))
  if (results.every(Boolean)) {
    profileItemsStore.items.sort((a, b) => a.order - b.order)
  }
  else {
    orderedItems.value = [...mainItems.value]
    await profileItemsStore.getItems()
  }
}

async function togglePin(id: string, current: boolean) {
  await profileItemsStore.updateItem(id, { isPinned: !current })
}

async function toggleItemVisibility(id: string, current: boolean) {
  await profileItemsStore.updateItem(id, { isVisible: !current })
}

function openSchedule(item: ProfileItem) {
  schedulingItem.value = item
  isScheduleDialogOpen.value = true
}

function closeScheduleDialog() {
  isScheduleDialogOpen.value = false
  schedulingItem.value = null
}

async function handleDeleteItem(id: string) {
  if (!confirm("Are you sure you want to delete this item?")) {
    return
  }
  await profileItemsStore.deleteItem(id)
}

async function handleDeleteIcon(id: string) {
  if (!confirm("Are you sure you want to delete this social icon?")) {
    return
  }
  await profileItemsStore.deleteItem(id)
}

onMounted(async () => {
  if (!userStore.assets.length) {
    await userStore.getAssets()
  }
})

watch(() => userStore.assets.length, (length) => {
  if (!length) {
    showBannerAssetPicker.value = false
  }
})

watch(() => user.value?.banner?.url, (url) => {
  if (!bannerFile.value && !pendingBannerAsset.value) {
    bannerPreview.value = url ?? null
  }
})

watch(() => icons.value, newIcons => orderedIcons.value = [...newIcons], { immediate: true, deep: true })
watch(() => mainItems.value, newItems => orderedItems.value = [...newItems], { immediate: true, deep: true })
watch(isPicking, async (picking) => {
  if (picking && !userStore.assets.length) {
    await userStore.getAssets()
  }
})
</script>
