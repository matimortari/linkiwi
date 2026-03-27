const uiState = reactive<UIState>({ sidebar: false, dialogs: { user: false, share: false, link: { isOpen: false, selectedLink: null }, icon: false } })

export function useUIState() {
  const openDialog = (type: "user" | "share" | "link" | "icon") => {
    if (type === "link") {
      uiState.dialogs.link.isOpen = true
    }
    else {
      uiState.dialogs[type] = true
    }
  }

  const closeDialog = (type: "user" | "share" | "link" | "icon") => {
    if (type === "link") {
      uiState.dialogs.link.isOpen = false
      uiState.dialogs.link.selectedLink = null
    }
    else {
      uiState.dialogs[type] = false
    }
  }

  const openSidebar = () => uiState.sidebar = true
  const closeSidebar = () => uiState.sidebar = false

  const isUserDialogOpen = computed(() => uiState.dialogs.user)
  const isShareDialogOpen = computed(() => uiState.dialogs.share)
  const isLinkDialogOpen = computed(() => uiState.dialogs.link.isOpen)
  const selectedLink = computed(() => uiState.dialogs.link.selectedLink)
  const isIconDialogOpen = computed(() => uiState.dialogs.icon)
  const isSidebarOpen = computed(() => uiState.sidebar)

  return {
    isUserDialogOpen,
    isShareDialogOpen,
    isLinkDialogOpen,
    selectedLink,
    isIconDialogOpen,
    isSidebarOpen,
    openDialog,
    closeDialog,
    openSidebar,
    closeSidebar,
  }
}
