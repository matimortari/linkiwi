<template>
  <Dialog :is-open="confirmation.isOpen()" :title="options?.title" @update:is-open="confirmation.resolve(false)">
    <div class="flex flex-col gap-4">
      <p class="text-sm text-muted-foreground">
        {{ options?.message }}
      </p>

      <footer class="flex flex-row items-center justify-end">
        <nav class="navigation-group">
          <button ref="cancelButton" type="button" class="btn-ghost" @click="confirmation.resolve(false)">
            {{ options?.cancelLabel ?? "Cancel" }}
          </button>
          <button ref="confirmButton" type="button" :class="`btn-${options?.variant ?? 'primary'}`" @click="confirmation.resolve(true)">
            {{ options?.confirmLabel ?? "Confirm" }}
          </button>
        </nav>
      </footer>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
const { confirmation } = useUI()
const options = computed(() => confirmation.options())
const cancelButton = useTemplateRef<HTMLButtonElement>("cancelButton")
const confirmButton = useTemplateRef<HTMLButtonElement>("confirmButton")

// Destructive actions focus Cancel so a stray Enter can't confirm them
watch(() => confirmation.isOpen(), async (open) => {
  if (!open) {
    return
  }
  await nextTick()
  ;(options.value?.variant === "danger" ? cancelButton : confirmButton).value?.focus()
})
</script>
