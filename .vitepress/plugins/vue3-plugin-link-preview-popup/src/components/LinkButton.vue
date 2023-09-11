<script setup lang="ts">
const props = defineProps<{
  showExternalIcon?: boolean
  href: string
}>()
</script>

<template>
  <a
    flex="~" items-center
    :href="props.href"
    class="link-preview-popup-link-local"
    transition="all duration-200 ease"
    bg="zinc-100 hover:zinc-200 active:zinc-300 dark:zinc-900 dark:hover:zinc-800 dark:active:zinc-700"
  >
    <slot />
    <span
      v-if="props.showExternalIcon"
      class="link-preview-popup-link-local-icon i-octicon:screen-full-16"
      inline-flex="~"
      ml-2 items-center justify-center text-xs
    />
  </a>
</template>

<style scoped less>
.link-preview-popup-link-local {
  width: calc(100% - 32px);
}
</style>
