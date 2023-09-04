<script setup lang="ts">
const props = defineProps<{
  loading?: boolean
}>()
</script>

<template>
  <button

    inline h-8 flex
    flex-row select-none items-center justify-center
    rounded-lg px-1 py-1 font-bold text-white transition="all duration-200 ease"
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
