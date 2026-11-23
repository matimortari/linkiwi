import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { useUI } from "../../app/composables/use-ui"

describe("useUI", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    const ui = useUI()
    for (const name of ["share", "link", "icon", "photoGrid", "widget", "location"] as const) {
      ui.dialog.close(name)
    }
    ui.sidebar.close()
    ui.preview.close()
    ui.toast.clear()
    ui.confirmation.resolve(false)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe.each(["sidebar", "preview"] as const)("%s", (name) => {
    it("opens, closes and toggles", () => {
      const panel = useUI()[name]

      panel.open()
      expect(panel.isOpen()).toBe(true)
      panel.toggle()
      expect(panel.isOpen()).toBe(false)
      panel.toggle()
      panel.close()
      expect(panel.isOpen()).toBe(false)
    })
  })

  describe("dialog", () => {
    it("opens with a payload and clears it on close", () => {
      const { dialog } = useUI()
      const item = { id: "1", type: "LINK", link: { label: "Home", url: "/" } } as ProfileItem

      dialog.open("link", item)
      expect(dialog.isOpen("link")).toBe(true)
      expect(dialog.data("link")).toEqual(item)

      dialog.close("link")
      expect(dialog.isOpen("link")).toBe(false)
      expect(dialog.data("link")).toBeNull()
    })

    it("defaults the payload to null and keeps dialogs independent", () => {
      const { dialog } = useUI()

      dialog.open("share")
      expect(dialog.isOpen("share")).toBe(true)
      expect(dialog.data("share")).toBeNull()
      expect(dialog.isOpen("icon")).toBe(false)

      dialog.close("share")
      expect(dialog.isOpen("share")).toBe(false)
    })

    it("shares state across calls", () => {
      useUI().dialog.open("widget")
      expect(useUI().dialog.isOpen("widget")).toBe(true)
    })
  })

  describe("toast", () => {
    it("pushes typed toasts and dismisses by id", () => {
      const { toast } = useUI()

      const successId = toast.success("ok")
      const errorId = toast.error("bad")
      toast.warning("careful")
      toast.info("note")

      expect(toast.list().map(t => t.type)).toEqual(["success", "danger", "warning", "info"])
      expect(toast.list()[0]).toMatchObject({ id: successId, message: "ok", duration: 5000 })
      expect(toast.list()[1]).toMatchObject({ id: errorId, message: "bad", duration: 7000 })

      toast.dismiss(successId)
      expect(toast.list().map(t => t.id)).not.toContain(successId)

      toast.clear()
      expect(toast.list()).toEqual([])
    })

    it("auto-dismisses after the configured duration", () => {
      const { toast } = useUI()
      const id = toast.show("temp", "info", 1000)

      expect(toast.list()).toHaveLength(1)
      vi.advanceTimersByTime(1000)
      expect(toast.list().find(t => t.id === id)).toBeUndefined()
    })

    it("keeps toasts when duration is zero", () => {
      const { toast } = useUI()
      toast.show("sticky", "info", 0)

      vi.advanceTimersByTime(10_000)
      expect(toast.list()).toHaveLength(1)
      expect(toast.list()[0]?.message).toBe("sticky")
    })
  })

  describe("confirm", () => {
    it("opens with options and resolves with the user's choice", async () => {
      const { confirm, confirmation } = useUI()
      const options = { title: "Delete", message: "Sure?", variant: "danger" as const }

      const accepted = confirm(options)
      expect(confirmation.isOpen()).toBe(true)
      expect(confirmation.options()).toEqual(options)
      confirmation.resolve(true)
      await expect(accepted).resolves.toBe(true)
      expect(confirmation.isOpen()).toBe(false)

      const rejected = confirm(options)
      confirmation.resolve(false)
      await expect(rejected).resolves.toBe(false)
    })

    it("cancels a pending confirmation when a new one opens", async () => {
      const { confirm, confirmation } = useUI()

      const first = confirm({ title: "First", message: "1" })
      const second = confirm({ title: "Second", message: "2" })
      await expect(first).resolves.toBe(false)
      expect(confirmation.options()?.title).toBe("Second")

      confirmation.resolve(true)
      await expect(second).resolves.toBe(true)
    })
  })
})
