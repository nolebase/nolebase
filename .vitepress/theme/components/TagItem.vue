<script setup lang="ts">
import { useSlots } from 'vue'

const slots = useSlots()
const hasSlot = (name) => {
  return !!slots[name];
}
</script>

<template>
  <div
    w-fit h-32px
    mr-2 my-1 py-1 px-2
    inline-block
    rounded-lg
    select-none
    flex-inline items-center justify-center
    bg-zinc-200 dark:bg-zinc-700

    :class="[ hasSlot('pre') || hasSlot('post') ? '' : 'hover:bg-zinc-300 active:bg-zinc-400 dark:hover:bg-zinc-600 dark:active:bg-zinc-700' ]"
  >
    <div flex items-center justify-center space-x-1>
      <slot name="pre"></slot>
      <slot />
      <slot name="post"></slot>
    </div>
  </div>
</template>
