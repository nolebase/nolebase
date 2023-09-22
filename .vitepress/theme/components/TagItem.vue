<script setup lang="ts">
import { useSlots } from 'vue'

const slots = useSlots()
function hasSlot(name) {
  return !!slots[name]
}
</script>

<template>
  <div
    my-1 mr-2 inline-block h-32px w-fit
    flex-inline cursor-help select-none items-center justify-center
    rounded-lg bg-zinc-200 px-2 py-1 dark:bg-zinc-700
    :class="[hasSlot('pre') || hasSlot('post') ? '' : 'hover:bg-zinc-300 active:bg-zinc-400 dark:hover:bg-zinc-600 dark:active:bg-zinc-700']"
    transition="all duration-200 ease"
  >
    <div flex items-center justify-center space-x-1>
      <slot name="pre" />
      <slot />
      <slot name="post" />
    </div>
  </div>
</template>
