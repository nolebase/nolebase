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
    <div flex="~ col" p-5>
      <div flex="~ col 1">
        <div text-2xl font-semibold>
          <slot name="name" />
        </div>
        <div text-sm>
          <span>by</span><slot name="by" />
        </div>
      </div>
      <a
        :href="props.href"
        border="1 solid zinc-200 dark:zinc-900"
        class="hover:no-underline!"
        bg="zinc-50 dark:zinc-700 hover:zinc-100 dark:hover:zinc-800 active:zinc-200 dark:active:zinc-900"
        transition="all 200 ease"
        mt-2 block w-fit flex items-center rounded-lg p-2 text-xs shadow-sm
        target="_blank"
      >
        <span class="i-ic:outline-arrow-outward" /> View
      </a>
    </div>
  </div>
</template>
