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
    bg-gray-200 dark:bg-gray-700

    :class="[ hasSlot('pre') || hasSlot('post') ? '' : 'hover:bg-gray-300 hover:dark:bg-gray-800 active:bg-gray-400 active:dark:bg-gray-900' ]"
  >
    <div flex items-center justify-center>
      <slot name="pre"></slot>
      <slot />
      <slot name="post"></slot>
    </div>
  </div>
</template>
