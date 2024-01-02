<!-- 目录 -->
<script lang="ts" setup>
import { computed } from 'vue'
import type { ArticleTree } from '../../../scripts/types/metadata'
import { sidebar } from '../../docsMetadata.json'

const list = computed(() => {
  const list: ArticleTree[] = ([] as any).concat(...sidebar.map(series => [...series?.items.map(item => ({ ...item, category: series.text }))]))
  for (let i = 0; i < list.length; i++) {
    const items = list[i].items
    if (items)

      list.push(...items.map(item => ({ ...item, category: list[i].category })))
  }
  return list.filter(item => item.link)
})

const sortedList = computed(() => {
  const ls = [...list.value]
  return ls.sort((a, b) => (b.lastUpdated || 0) - (a.lastUpdated || 0))
})
</script>

<template>
  <div v-for="item of sortedList" :key="item.link" class="space-y-3">
    <a :href="item.link">
      <h3 m="0">
        {{ item.text }}
      </h3>
    </a>
    <div class="text-sm space-x-4">
      <div class="inline-block">
        <span class="i-octicon:repo-16 align-middle text-xs opacity-50" />
        <span class="align-middle opacity-50">
          类别：
        </span>
        <span class="rounded-sm bg-[var(--vp-c-bg-mute)] px-6px py-3px align-middle opacity-70">{{ item.category }}</span>
      </div>
      <div class="inline-block opacity-50">
        <span class="i-octicon:history-16 align-middle text-xs" />
        <span class="align-middle">
          更新时间：{{ new Date(item.lastUpdated || 0).toLocaleDateString() }}
        </span>
      </div>
    </div>
  </div>
</template>
