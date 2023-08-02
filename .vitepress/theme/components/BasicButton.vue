<script setup lang="ts">
const props = defineProps<{
  loading?: boolean
}>()
</script>

<template>
  <button
    inline
    px-1 py-1
    h-8
    rounded-lg
    text-white font-bold select-none
    transition-all
    flex flex-row items-center justify-center
    :disabled="props.loading"
  >
    <template v-if="props.loading">
      <span v-if="loading" flex items-center px-3>
        <div class="i-eos-icons:three-dots-loading" text-2xl />
        </span>
    </template>
    <template v-else>
      <slot />
    </template>
  </button>
</template>
