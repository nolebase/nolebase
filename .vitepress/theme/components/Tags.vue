<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const pageData = useData()
const tags = computed(() => {
  if (!('tags' in pageData.frontmatter.value) || !Array.isArray(pageData.frontmatter.value.tags) || pageData.frontmatter.value.tags.length === 0) {
    return []
  }

  return pageData.frontmatter.value.tags
})
</script>

<template>
  <div
      v-if="tags && tags.length > 0"
      my-4 p-4
      rounded-lg
      bg-gray-50 dark="bg-[#252529]"
    >
      <Tag v-for="(tag, index) in tags" :tag="tag" :key="`${index}`" />
  </div>
</template>
