<script setup lang="ts">
// @ts-expect-error virtual
import changelog from '/virtual-changelog'
import { computed } from 'vue'
import { ContributorInfo, CommitInfo } from '../../../scripts/types'
import { useRawPath } from '../composables/route'

const rawPath = useRawPath()

const allCommits = changelog as CommitInfo[]
const commits = computed(() => {
  const commits = allCommits.filter(c => c.version || c.path?.includes(rawPath))
  return commits.filter((i, idx) => {
    if (i.version && (!commits[idx + 1] || commits[idx + 1]?.version))
      return false
    return true
  })
})

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
    <div v-for="c of contributors" :key="c.hash" class="flex gap-2 items-center">
      <img :src="`https://gravatar.com/avatar/${c.hash}?d=retro`" class="w-8 h-8 rounded-full">
      {{ c.name }}
    </div>
  </div>
</template>
