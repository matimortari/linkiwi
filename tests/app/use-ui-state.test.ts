import { beforeEach, describe, expect, it } from "vitest"
import { useUIState } from "../../app/composables/use-ui-state"

describe("useUIState", () => {
  beforeEach(() => {
    const ui = useUIState()
    for (const type of ["share", "item", "link", "icon", "photoGrid", "widget", "location"] as const) {
      ui.closeDialog(type)
    }
    ui.closeSidebar()
    ui.closePreview()
  })

  it("opens item dialog with payload and clears it on close", () => {
    const ui = useUIState()
    const item = { id: "1", type: "LINK", link: { label: "Home", url: "/" } } as ProfileItem

    ui.openDialog("item", { item, activeType: "LINK" })
    expect(ui.isItemDialogOpen.value).toBe(true)
    expect(ui.selectedItem.value).toEqual(item)
    expect(ui.activeItemType.value).toBe("LINK")

    ui.closeDialog("item")
    expect(ui.isItemDialogOpen.value).toBe(false)
    expect(ui.selectedItem.value).toBeNull()
    expect(ui.activeItemType.value).toBeNull()
  })

  it("opens typed dialogs and toggles sidebar/preview", () => {
    const ui = useUIState()
    const item = { id: "2", type: "ICON" } as ProfileItem

    ui.openDialog("share")
    expect(ui.isShareDialogOpen.value).toBe(true)
    ui.closeDialog("share")
    expect(ui.isShareDialogOpen.value).toBe(false)

    ui.openDialog("icon", { item })
    expect(ui.isIconDialogOpen.value).toBe(true)
    expect(ui.selectedIcon.value).toEqual(item)
    ui.closeDialog("icon")
    expect(ui.selectedIcon.value).toBeNull()

    ui.openSidebar()
    ui.openPreview()
    expect(ui.isSidebarOpen.value).toBe(true)
    expect(ui.isPreviewOpen.value).toBe(true)
    ui.closeSidebar()
    ui.closePreview()
    expect(ui.isSidebarOpen.value).toBe(false)
    expect(ui.isPreviewOpen.value).toBe(false)
  })
})
