export function useFormValidation<T>(initialData: T) {
  const form = ref<T>({ ...initialData })
  const isLoading = ref(false)
  const validationErrors = ref<Record<string, string>>({})

  const resetForm = (data?: T) => {
    form.value = data ? { ...data } : { ...initialData }
    validationErrors.value = {}
    isLoading.value = false
  }

  const validateField = (field: keyof T, value: any): boolean => {
    const fieldStr = String(field)

    // Basic required field validation
    if (value === null || value === undefined || (typeof value === "string" && value.trim() === "")) {
      validationErrors.value[fieldStr] = `${fieldStr} is required`
      return false
    }

    // URL validation for url fields
    if (fieldStr.toLowerCase() === "url" && typeof value === "string") {
      try {
        new URL(value)
        delete validationErrors.value[fieldStr]
        return true
      }
      catch {
        validationErrors.value[fieldStr] = "Please enter a valid URL"
        return false
      }
    }

    delete validationErrors.value[fieldStr]
    return true
  }

  const validateForm = (schema?: any): boolean => {
    validationErrors.value = {}

    if (schema) {
      const result = schema.safeParse(form.value)
      if (!result.success) {
        result.error.issues.forEach((issue: any) => {
          const field = issue.path.join(".")
          validationErrors.value[field] = issue.message
        })
        return false
      }
      return true
    }

    // Fallback validation - check required fields
    let isValid = true
    for (const [key, value] of Object.entries(form.value as Record<string, any>)) {
      if (!validateField(key as keyof T, value)) {
        isValid = false
      }
    }

    return isValid
  }

  const isFormValid = computed(() => {
    return Object.keys(validationErrors.value).length === 0
      && Object.values(form.value as Record<string, any>).every(value =>
        value !== null && value !== undefined
        && (typeof value !== "string" || value.trim() !== ""),
      )
  })

  const hasFormChanged = (originalData?: T): boolean => {
    if (!originalData)
      return true

    return JSON.stringify(form.value) !== JSON.stringify(originalData)
  }

  return {
    form,
    isLoading,
    validationErrors,
    isFormValid,
    resetForm,
    validateField,
    validateForm,
    hasFormChanged,
  }
}
