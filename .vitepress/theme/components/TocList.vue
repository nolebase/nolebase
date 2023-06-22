<!-- 目录 -->
<script lang="ts" setup>
import { computed, reactive } from 'vue';
import { ArticleTree } from '../../../scripts/types/metadata';
import { sidebar } from '../../metainfo.json'

const list = computed(() => {
  const list: ArticleTree[] = ([] as any).concat(...sidebar.map(series => [...series?.items.map(item => ({ ...item, category: series.text }))] || []))
  for (let i = 0; i < list.length; i++) {
    const items = list[i].items
    if (items) {

      list.push(...items.map(item => ({ ...item, category: list[i].category })))
    }
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
        <span class="i-octicon:repo-16 text-xs opacity-50 align-middle" />
        <span class="opacity-50 align-middle">
          类别：
        </span>
        <span class="opacity-70 align-middle rounded-sm py-3px px-6px bg-[var(--vp-c-bg-mute)]">{{ item.category }}</span>
      </div>
      <div class="opacity-50 inline-block">
        <span class="i-octicon:history-16 text-xs align-middle" />
        <span class="align-middle">
          更新时间：{{ new Date(item.lastUpdated || 0).toLocaleDateString() }}
        </span>
      </div>
    </div>
  </div>
</template>

