<script setup lang="ts">
// @ts-expect-error virtual
import changelog from '/virtual-changelog'
import { computed } from 'vue'
import { CommitInfo } from '../../../scripts/types'
import { renderCommitMessage } from '../utils'
import { githubRepoLink } from "../../meta"

const rawPath = (() => {
  if (typeof window === 'undefined')
    return ''
  return decodeURIComponent(window.location.pathname).replace(/^\/(.+)\.html$/, '$1.md')
})()

const allCommits = changelog as CommitInfo[]
const commits = computed(() => {
  const commits = allCommits.filter(c => c.version || c.path?.includes(rawPath))
  return commits.filter((i, idx) => {
    if (i.version && (!commits[idx + 1] || commits[idx + 1]?.version))
      return false
    return true
  })
})
</script>

<template>
  <div class="vp-doc">
    <h2 id="changelog" tabindex="-1">
      Changelog
      <a class="header-anchor" href="#changelog" aria-hidden="true">#</a>
    </h2>
    <em v-if="!commits.length" opacity="70">No recent changes</em>

    <div class="grid grid-cols-[30px_auto] -ml-1 gap-1.5 children:my-auto">
      <template v-for="(commit, idx) of commits" :key="commit.hash">
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
          <div class="m-auto inline-flex bg-gray-400/10 w-7 h-7 rounded-full text-sm opacity-90">
            <div class="i-octicon:rocket-16" m="auto" />
          </div>
          <div>
            <a
              :href="`${githubRepoLink}/releases/tag/${commit.version}`"
              target="_blank"
            >
              <code class="!text-primary font-bold">{{ commit.version }}</code>
            </a>
            <span class="opacity-50 text-xs"> on {{ new Date(commit.date).toLocaleDateString() }}</span>
          </div>
        </template>
        <template v-else>
          <div class="i-octicon:git-commit-16 m-auto transform rotate-90 opacity-30" />
          <div>
            <a :href="`${githubRepoLink}/commit/${commit.hash}`" target="_blank">
              <code class="!text-xs !text-$vt-c-text-2 !hover:text-primary">{{ commit.hash.slice(0, 5) }}</code>
            </a>
            <span text="sm">
              -
              <span v-html="renderCommitMessage(commit.message)" />
            </span>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>
