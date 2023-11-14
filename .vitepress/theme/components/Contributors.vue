<script setup lang="ts">
// @ts-expect-error virtual
import changelog from '/virtual-changelog'
import { computed } from 'vue'
import { creators } from '../../creators'
import type { CommitInfo, ContributorInfo } from '../../../scripts/types'
import { useRawPath } from '../composables/route'
import { useCommits } from '../composables/changelog'

const rawPath = useRawPath()

const allCommits = changelog as CommitInfo[]
const commits = useCommits(allCommits, rawPath)

const contributors = computed<ContributorInfo[]>(() => {
  const map: Record<string, ContributorInfo> = {}
  commits.value.forEach((c) => {
    const targetCreatorByName = creators.find(item => item.nameAliases && Array.isArray(item.nameAliases) && item.nameAliases.includes(c.author_name))
    const targetCreatorByEmail = creators.find(item => item.emailAliases && Array.isArray(item.emailAliases) && item.emailAliases.includes(c.author_email))

    let name = ''
    let avatar = ''
    let url: string | undefined

    if (targetCreatorByName) {
      name = targetCreatorByName.name
      avatar = targetCreatorByName.avatar
      const foundGitHubLink = targetCreatorByName.links?.find(item => item.type === 'github')
      if (foundGitHubLink)
        url = foundGitHubLink.link
    }
    else if (targetCreatorByEmail) {
      name = targetCreatorByEmail.name
      avatar = targetCreatorByEmail.avatar
      const foundGitHubLink = targetCreatorByEmail.links?.find(item => item.type === 'github')
      if (foundGitHubLink)
        url = foundGitHubLink.link
    }
    else {
      name = c.author_name
      avatar = `https://gravatar.com/avatar/${c.author_avatar}?d=retro`
    }

    if (!map[name]) {
      map[name] = {
        name,
        count: 0,
        avatarUrl: avatar,
        url,
      }
    }
    map[name].count++
  })
  return Object.values(map).sort((a, b) => b.count - a.count)
})
</script>

<template>
  <div class="flex flex-wrap gap-4 pt-2">
    <em v-if="!contributors.length">暂无相关贡献者</em>
    <template v-else>
      <template v-for="c of contributors" :key="c.name">
        <a v-if="typeof c.url !== 'undefined'" :href="c.url">
          <div class="flex items-center gap-2">
            <img :src="c.avatarUrl" class="h-8 w-8 rounded-full">
            {{ c.name }}
          </div>
        </a>
        <div v-else :key="c.name" class="flex items-center gap-2">
          <img :src="c.avatarUrl" class="h-8 w-8 rounded-full">
          {{ c.name }}
        </div>
      </template>
    </template>
  </div>
</template>
