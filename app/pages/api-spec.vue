<template>
  <Loading v-if="pending" />

  <div v-else-if="endpoints.length > 0" class="space-y-8">
    <header class="space-y-2 border-b pb-4 text-center md:text-start">
      <h1>
        API Specification
      </h1>
      <p class="max-w-xl font-medium text-muted-foreground">
        Complete documentation for the LinKiwi REST API.
      </p>
    </header>

    <div v-for="(endpoint, idx) in endpoints" :key="idx" class="card overflow-hidden">
      <div class="flex items-center gap-4 border-b border-muted bg-muted/50 px-6 py-4">
        <span class="rounded-md px-2.5 py-1 text-xs font-semibold tracking-wide uppercase" :class="[getMethodClass(endpoint.method)]">
          {{ endpoint.method }}
        </span>
        <h2 class="font-mono">
          {{ endpoint.url }}
        </h2>
      </div>

      <div class="p-2">
        <h3 v-if="endpoint.summary" class="mb-2 text-base font-semibold text-foreground">
          {{ endpoint.summary }}
        </h3>
        <p v-if="endpoint.description" class="mb-6 text-sm/relaxed text-muted-foreground">
          {{ endpoint.description }}
        </p>

        <div v-if="endpoint.parameters && endpoint.parameters.length > 0">
          <h4 class="mb-2 tracking-wider text-muted-foreground uppercase">
            Parameters
          </h4>
          <ul class="space-y-2">
            <li v-for="param in endpoint.parameters" :key="param.name" class="flex flex-col gap-2 rounded-lg bg-muted p-3 text-sm md:flex-row md:items-baseline">
              <code class="rounded-sm bg-muted px-1.5 py-0.5 font-semibold text-foreground">
                {{ param.name }}
              </code>
              <span class="text-xs text-muted-foreground italic">
                ({{ param.in }})
              </span>
              <span v-if="param.description" class="ml-0 text-foreground md:ml-2">
                {{ param.description }}
              </span>
              <span v-if="param.required" class="ml-auto text-xs font-medium text-danger">
                Required
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { public: { baseURL } } = useRuntimeConfig()
const { data: openApiData, pending } = await useFetch<{ openapi: string, info: { title: string, version?: string }, paths: Record<string, { [method: string]: any }> }>("/_openapi.json")

const endpoints = computed(() => {
  if (!openApiData.value?.paths) {
    return []
  }

  const results = []
  for (const [url, methods] of Object.entries(openApiData.value.paths)) {
    for (const [method, details] of Object.entries(methods)) {
      results.push({ url, method, summary: details.summary, description: details.description, parameters: details.parameters || [] })
    }
  }

  return results
})

function getMethodClass(method: string) {
  switch (method.toLowerCase()) {
    case "get": return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
    case "post": return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
    case "put": return "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400"
    case "delete": return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
    default: return "bg-muted text-muted-foreground"
  }
}

useHead({
  title: "API Specification",
  link: [{ rel: "canonical", href: `${baseURL}/api-spec` }],
  meta: [{ name: "description", content: "LinKiwi API specification." }],
})

definePageMeta({ layout: "content" })
</script>
