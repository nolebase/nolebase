<script setup lang="ts">
const props = defineProps<{
  showExternalIcon?: boolean
  href: string
}>()
</script>

<template>
  <a inline-flex="~" items-center :href="props.href" class="link-preview-popup-link-local">
    <slot />
    <div
      v-if="props.showExternalIcon"
      class="link-preview-popup-link-local-icon"
      flex="~"
      i-octicon:screen-full-16 ml-2 items-center justify-center text-xs
    />
  </a>
</template>

<style scoped less>
.link-preview-popup-link-local {
  width: calc(100% - 32px);
}
</style>
