<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { defaultLinkPreviewPopupOptions, linkPreviewPopupInjectionKey } from '../types'
import type { LinkPreviewPopupOptions } from '../types'
import { useInIframe } from '../composables/iframe'
import PopupIframe from './PopupIframe.vue'

const props = defineProps < {
  href: string
}>()

const options = inject<LinkPreviewPopupOptions>(linkPreviewPopupInjectionKey, defaultLinkPreviewPopupOptions)

const inInClient = ref(false)
const hovering = ref(false)
const { width: windowWidth } = useWindowSize()
const { livesInIframe } = useInIframe()

const hrefHost = computed<string>(() => {
  if (!inInClient.value)
    return ''

  try {
    if (props.href.startsWith('#'))
      return ''

    return new URL(props.href, window.location.href).host
  }
  catch (e) {
    return ''
  }
})

const isOneOfPreviewHosts = computed<boolean>(() => {
  if (!inInClient.value)
    return false

  if (!window || !window.location)
    return false

  if (!options.previewHostNames || options.previewHostNames.length === 0)
    return hrefHost.value === window.location.host

  return hrefHost.value && options.previewHostNames.includes(hrefHost.value)
})

const showIframe = computed<boolean>(() => inInClient.value && !livesInIframe.value && isOneOfPreviewHosts.value && hovering.value)
const popupAlign = ref<'left' | 'right'>('left')

function handleMouseEnter(e: MouseEvent) {
  hovering.value = true
  const anchorElement = e.target as HTMLAnchorElement
  const { x } = anchorElement.getBoundingClientRect()

  if (x >= windowWidth.value / 2)
    popupAlign.value = 'right'
  else
    popupAlign.value = 'left'
}

function handleMouseLeave() {
  hovering.value = false
}

onMounted(() => {
  inInClient.value = true
})
</script>

<template>
  <a
    class="link-preview" relative inline-block
    :href="props.href"
    @mouseenter="handleMouseEnter"
    @pointerenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @pointerleave="handleMouseLeave"
  >
    <div class="link-preview-link-content-container" inline-block flex="~" items-center justify-center>
      <slot />
      <div
        v-if="!isOneOfPreviewHosts"
        class="link-preview-link-content-external-icon"
        flex="~"
        i-octicon:link-external-16 items-center justify-center text-xs
      />
    </div>
    <TransitionGroup name="fade">
      <div
        v-if="showIframe"
        flex="~ col"
        absolute z-10 m-0 h-120 w-150 overflow-hidden rounded-lg p-0
        border="solid 1 zinc-200 dark:zinc-700"
        class="link-preview-popup-wrapper"
        :class="{
          'link-preview-popup-align-left': popupAlign === 'left',
          'link-preview-popup-align-right': popupAlign === 'right',
        }"
      >
        <PopupIframe :href="props.href" />
      </div>
    </TransitionGroup>
  </a>
</template>

<style scoped less>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  pointer-events: none;
}

.link-preview-popup-align-left {
  left: 0;
}

.link-preview-popup-align-right {
  right: 0;
}
</style>
