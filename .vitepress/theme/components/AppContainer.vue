<script setup lang="ts">
import { withBase } from 'vitepress'

const props = defineProps<{
  iconSrc: string
  href: string
}>()
</script>

<template>
  <div bg="zinc-100 dark:zinc-800" w-full flex rounded-xl p-4>
    <div flex="~" max-h-40 max-w-40 justify-center>
      <slot name="image" />
    </div>
    <div flex="~ col" p="5 <sm:2" min-w="<sm:[66%]">
      <div flex="~ col 1">
        <div text="2xl <sm:lg" font-semibold>
          <slot name="name" />
        </div>
        <div text-sm>
          <span>by</span><slot name="by" />
        </div>
      </div>
      <a
        :href="props.href"
        class="hover:no-underline!"
        bg="zinc-50 dark:zinc-700 hover:white dark:hover:zinc-600 active:zinc-50 dark:active:zinc-700"
        transition="all 200 ease"
        mt-2 block w-fit flex items-center rounded-lg p-2 text-xs shadow-sm
        target="_blank"
      >
        <span class="i-ic:outline-arrow-outward" /> View
      </a>
    </div>
  </div>
</template>
