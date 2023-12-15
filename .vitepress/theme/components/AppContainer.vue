<script setup lang="ts">
const props = defineProps<{
  iconSrc: string
  href: string
}>()
</script>

<template>
  <div bg="zinc-100 dark:zinc-800" w-full flex rounded-xl p-4>
    <div max-w-auto flex="~" justify-center>
      <img :src="props.iconSrc" max-h-40 max-w-40>
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
        border="1 solid $vp-c-brand-1"
        class="hover:bg-zinc-50 hover:no-underline!"
        transition="all 200 ease"
        mt-2 block w-fit flex items-center rounded-lg p-2 text-xs
        target="_blank"
      >
        View <span class="i-ic:outline-arrow-outward" />
      </a>
    </div>
  </div>
</template>
