const uiState = reactive<UIState>({
  sidebar: false,
  preview: false,
  dialogs: {
    user: false,
    share: false,
    supportButton: false,
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
  },
})

export function useUIState() {
  const openDialog = (type: "user" | "share" | "supportButton" | "item" | "link" | "icon", payload?: { item?: ProfileItem | null, activeType?: ProfileItemType | null }) => {
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
    else {
      uiState.dialogs[type] = true
    }
  }

  const closeDialog = (type: "user" | "share" | "supportButton" | "item" | "link" | "icon") => {
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
  const isSupportButtonDialogOpen = computed(() => uiState.dialogs.supportButton)
  const isItemDialogOpen = computed(() => uiState.dialogs.item.isOpen)
  const isLinkDialogOpen = computed(() => uiState.dialogs.link.isOpen)
  const isIconDialogOpen = computed(() => uiState.dialogs.icon.isOpen)
  const selectedItem = computed(() => uiState.dialogs.item.selectedItem)
  const selectedLink = computed(() => uiState.dialogs.link.selectedLink)
  const selectedIcon = computed(() => uiState.dialogs.icon.selectedIcon)
  const activeItemType = computed(() => uiState.dialogs.item.activeType)
  const isSidebarOpen = computed(() => uiState.sidebar)
  const isPreviewOpen = computed(() => uiState.preview)

  return {
    uiState,
    isUserDialogOpen,
    isShareDialogOpen,
    isSupportButtonDialogOpen,
    isItemDialogOpen,
    isLinkDialogOpen,
    isIconDialogOpen,
    selectedItem,
    selectedLink,
    selectedIcon,
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
