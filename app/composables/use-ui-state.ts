const uiState = reactive<UIState>({
  sidebar: false,
  preview: false,
  dialogs: {
    user: false,
    share: false,
    item: {
      isOpen: false,
      selectedItem: null,
      activeType: null,
    },
    link: {
      isOpen: false,
      selectedLink: null,
    },
    icon: {
      isOpen: false,
      selectedIcon: null,
    },
    photoGrid: {
      isOpen: false,
      selectedPhotoGrid: null,
    },
    widget: {
      isOpen: false,
      selectedWidget: null as ProfileItem | null,
    },
  },
})

export function useUIState() {
  const openDialog = (type: "user" | "share" | "item" | "link" | "icon" | "photoGrid" | "widget", payload?: { item?: ProfileItem | null, activeType?: ProfileItemType | null }) => {
    if (type === "item") {
      uiState.dialogs.item.isOpen = true
      uiState.dialogs.item.selectedItem = payload?.item ?? null
      uiState.dialogs.item.activeType = payload?.activeType ?? payload?.item?.type ?? null
    }
    else if (type === "link") {
      uiState.dialogs.link.isOpen = true
      if (payload?.item !== undefined) {
        uiState.dialogs.link.selectedLink = payload.item
      }
    }
    else if (type === "icon") {
      uiState.dialogs.icon.isOpen = true
      if (payload?.item !== undefined) {
        uiState.dialogs.icon.selectedIcon = payload.item
      }
    }
    else if (type === "photoGrid") {
      uiState.dialogs.photoGrid.isOpen = true
      if (payload?.item !== undefined) {
        uiState.dialogs.photoGrid.selectedPhotoGrid = payload.item
      }
      else {
        uiState.dialogs.photoGrid.selectedPhotoGrid = null
      }
    }
    else if (type === "widget") {
      uiState.dialogs.widget.isOpen = true
      if (payload?.item !== undefined) {
        uiState.dialogs.widget.selectedWidget = payload.item
      }
    }
    else {
      uiState.dialogs[type] = true
    }
  }

  const closeDialog = (type: "user" | "share" | "item" | "link" | "icon" | "photoGrid" | "widget") => {
    if (type === "item") {
      uiState.dialogs.item.isOpen = false
      uiState.dialogs.item.selectedItem = null
      uiState.dialogs.item.activeType = null
    }
    else if (type === "link") {
      uiState.dialogs.link.isOpen = false
      uiState.dialogs.link.selectedLink = null
    }
    else if (type === "icon") {
      uiState.dialogs.icon.isOpen = false
      uiState.dialogs.icon.selectedIcon = null
    }
    else if (type === "photoGrid") {
      uiState.dialogs.photoGrid.isOpen = false
      uiState.dialogs.photoGrid.selectedPhotoGrid = null
    }
    else if (type === "widget") {
      uiState.dialogs.widget.isOpen = false
      uiState.dialogs.widget.selectedWidget = null
    }
    else {
      uiState.dialogs[type] = false
    }
  }

  const openSidebar = () => (uiState.sidebar = true)
  const closeSidebar = () => (uiState.sidebar = false)
  const openPreview = () => (uiState.preview = true)
  const closePreview = () => (uiState.preview = false)

  const isUserDialogOpen = computed(() => uiState.dialogs.user)
  const isShareDialogOpen = computed(() => uiState.dialogs.share)
  const isItemDialogOpen = computed(() => uiState.dialogs.item.isOpen)
  const isLinkDialogOpen = computed(() => uiState.dialogs.link.isOpen)
  const isIconDialogOpen = computed(() => uiState.dialogs.icon.isOpen)
  const isPhotoGridDialogOpen = computed(() => uiState.dialogs.photoGrid.isOpen)
  const isWidgetDialogOpen = computed(() => uiState.dialogs.widget.isOpen)
  const selectedItem = computed(() => uiState.dialogs.item.selectedItem)
  const selectedLink = computed(() => uiState.dialogs.link.selectedLink)
  const selectedIcon = computed(() => uiState.dialogs.icon.selectedIcon)
  const selectedPhotoGrid = computed(() => uiState.dialogs.photoGrid.selectedPhotoGrid)
  const selectedWidget = computed(() => uiState.dialogs.widget.selectedWidget)
  const activeItemType = computed(() => uiState.dialogs.item.activeType)
  const isSidebarOpen = computed(() => uiState.sidebar)
  const isPreviewOpen = computed(() => uiState.preview)

  return {
    uiState,
    isUserDialogOpen,
    isShareDialogOpen,
    isItemDialogOpen,
    isLinkDialogOpen,
    isIconDialogOpen,
    isPhotoGridDialogOpen,
    isWidgetDialogOpen,
    selectedItem,
    selectedLink,
    selectedIcon,
    selectedPhotoGrid,
    selectedWidget,
    activeItemType,
    isSidebarOpen,
    isPreviewOpen,
    openDialog,
    closeDialog,
    openSidebar,
    closeSidebar,
    openPreview,
    closePreview,
  }
}
