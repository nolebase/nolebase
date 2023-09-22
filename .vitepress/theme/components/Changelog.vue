<script setup lang="ts">
// @ts-expect-error virtual
import changelog from '/virtual-changelog'
import type { CommitInfo } from '../../../scripts/types'
import { renderCommitMessage } from '../utils'
import { githubRepoLink } from '../../meta'
import { useRawPath } from '../composables/route'
import { useCommits } from '../composables/changelog'

const rawPath = useRawPath()

const allCommits = changelog as CommitInfo[]
const commits = useCommits(allCommits, rawPath)
</script>

<template>
  <em v-if="!commits.length" opacity="70">暂无最近变更历史</em>

  <div class="grid grid-cols-[30px_auto] gap-1.5 children:my-auto -ml-1">
    <template v-for="(commit) of commits" :key="commit.hash">
      <!-- <template v-if="idx === 0 && !commit.version">
        <div m="t-1" />
        <div m="t-1" />
        <div class="m-auto inline-flex bg-gray-400/10 w-7 h-7 rounded-full text-sm opacity-90">
          <div class="i-octicon:git-pull-request-draft-16" m="auto" />
        </div>
        <div>
          <code>Pending for release...</code>
        </div>
      </template> -->
      <template v-if="commit.version">
        <div m="t-1" />
        <div m="t-1" />
        <div class="m-auto h-7 w-7 inline-flex rounded-full bg-gray-400/10 text-sm opacity-90">
          <div class="i-octicon:rocket-16" m="auto" />
        </div>
        <div>
          <a :href="`${githubRepoLink}/releases/tag/${commit.version}`" target="_blank">
            <code class="!text-primary font-bold">{{ commit.version }}</code>
          </a>
          <span class="text-xs opacity-50"> on {{ new Date(commit.date).toLocaleDateString() }}</span>
        </div>
      </template>
      <template v-else>
        <div class="i-octicon:git-commit-16 m-auto rotate-90 transform opacity-30" />
        <div>
          <a :href="`${githubRepoLink}/commit/${commit.hash}`" target="_blank">
            <code class="!hover:text-primary !text-xs !text-$vt-c-text-2">{{ commit.hash.slice(0, 5) }}</code>
          </a>
          <span text="sm">
            -
            <span v-html="renderCommitMessage(commit.message)" />
          </span>

          <span class="text-xs opacity-50"> on {{ new Date(commit.date).toLocaleDateString() }}</span>
        </div>
      </template>
    </template>
  </div>
</template>
