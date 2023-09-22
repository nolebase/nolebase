<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { v4 as uuidv4 } from 'uuid'

const pageData = useData()
const tags = computed(() => {
  if (!('tags' in pageData.frontmatter.value) || !Array.isArray(pageData.frontmatter.value.tags) || pageData.frontmatter.value.tags.length === 0)
    return []

  return pageData.frontmatter.value.tags.map((tag) => {
    return {
      id: String(uuidv4()),
      content: tag,
    }
  })
})
</script>

<template>
  <div
    v-if="tags && tags.length > 0"
    my-4 rounded-lg bg-zinc-50 p-4 dark="bg-zinc-900"
  >
    <Tag v-for="(tag, index) in tags" :key="`${index}`" :tag="tag" />
  </div>
</template>
