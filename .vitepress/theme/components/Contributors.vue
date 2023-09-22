<script setup lang="ts">
// @ts-expect-error virtual
import changelog from '/virtual-changelog'
import { computed } from 'vue'
import type { CommitInfo, ContributorInfo } from '../../../scripts/types'
import { useRawPath } from '../composables/route'
import { useCommits } from '../composables/changelog'

const rawPath = useRawPath()

const allCommits = changelog as CommitInfo[]
const commits = useCommits(allCommits, rawPath)

const contributors = computed<ContributorInfo[]>(() => {
  const map: Record<string, ContributorInfo> = {}
  commits.value.forEach((c) => {
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
</script>

<template>
  <div class="flex flex-wrap gap-4 pt-2">
    <em v-if="!contributors.length">暂无相关贡献者</em>
    <div v-for="c of contributors" v-else :key="c.hash" class="flex items-center gap-2">
      <img :src="`https://gravatar.com/avatar/${c.hash}?d=retro`" class="h-8 w-8 rounded-full">
      {{ c.name }}
    </div>
  </div>
</template>
