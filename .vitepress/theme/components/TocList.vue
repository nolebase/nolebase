<!-- 目录 -->
<script lang="ts" setup>
import { computed, reactive } from 'vue';
// @ts-expect-error virtual
import changelog from '/virtual-changelog'
import { ArticleTree } from '../../../scripts/types/metadata';
import { sidebar } from '../../metainfo.json'
import { invoke } from '@vueuse/core';
import { CommitInfo, ContributorInfo } from '../../../scripts/types';

const allCommits = changelog as CommitInfo[]

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

const filter = reactive({
  contributor: '',
})

const FilteredList = computed(() => {
  if (!filter.contributor) return list.value
  return list.value.filter(item => {
    return item.contributors?.some(c => c.name === filter.contributor)
  })
})

const sortedList = computed(() => {
  const ls = [...FilteredList.value]
  return ls.sort((a, b) => (b.lastUpdated) || 0 - (a.lastUpdated || 0))
})

const contributors = invoke(() => {
  const map: Record<string, ContributorInfo> = {}
  allCommits.forEach((c) => {
    if (!map[c.author_name]) {
      map[c.author_name] = {
        name: c.author_name,
        count: 0,
        hash: c.authorAvatar,
      }
    }
    map[c.author_name].count++
  })
  return Object.values(map).sort((a, b) => b.count - a.count)
})

function onSelect(c: ContributorInfo) {
  filter.contributor = c.name !== filter.contributor
    ? c.name
    : ''
}
</script>

<template>
  <div grid="~ cols-[80px_auto]" gap="y-2" mt-10>
    <div>
      排序方式
    </div>
    <div>
      <code>最近更新</code>
    </div>
    <div>
      贡献者
    </div>
    <div>
      <div flex="~ wrap" gap="2">
        <button
          v-for="c of contributors"
          :key="c.hash"
          class="select-button flex gap-2 items-center py-1"
          :class="[
            c.name === filter.contributor ? '!text-$vp-button-brand-active-text !bg-$vp-button-brand-active-bg' : '',
          ]"
          @click="onSelect(c)"
        >
          <img :src="`https://gravatar.com/avatar/${c.hash}?d=retro`" class="w-8 h-8 rounded-full">
          <span>{{ c.name }}</span>
        </button>
      </div>
    </div>
  </div>
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
