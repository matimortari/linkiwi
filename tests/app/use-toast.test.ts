import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { useToast } from "../../app/composables/use-toast"

describe("useToast", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    useToast().clear()
  })

  afterEach(() => {
    vi.useRealTimers()
    useToast().clear()
  })

  it("pushes typed toasts and dismisses by id", () => {
    const toast = useToast()

    const successId = toast.success("ok")
    const errorId = toast.error("bad")
    toast.warning("careful")
    toast.info("note")

    expect(toast.toasts.value.map(t => t.type)).toEqual(["success", "danger", "warning", "info"])
    expect(toast.toasts.value[0]).toMatchObject({ id: successId, message: "ok", duration: 5000 })
    expect(toast.toasts.value[1]).toMatchObject({ id: errorId, message: "bad", duration: 7000 })

    toast.dismiss(successId)
    expect(toast.toasts.value.map(t => t.id)).not.toContain(successId)

    toast.clear()
    expect(toast.toasts.value).toEqual([])
  })

  it("auto-dismisses after the configured duration", () => {
    const toast = useToast()
    const id = toast.show("temp", "info", 1000)

    expect(toast.toasts.value).toHaveLength(1)
    vi.advanceTimersByTime(1000)
    expect(toast.toasts.value.find(t => t.id === id)).toBeUndefined()
  })

  it("keeps toasts when duration is zero", () => {
    const toast = useToast()
    toast.show("sticky", "info", 0)

    vi.advanceTimersByTime(10_000)
    expect(toast.toasts.value).toHaveLength(1)
    expect(toast.toasts.value[0]?.message).toBe("sticky")
  })
})
