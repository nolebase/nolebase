<script setup lang="ts">
import { computed, inject, onMounted, ref, watch } from 'vue'
import { useMouseInElement, useWindowSize } from '@vueuse/core'
import { defaultLinkPreviewPopupOptions, linkPreviewPopupInjectionKey } from '../types'
import type { LinkPreviewPopupOptions } from '../types'
import { useInIframe } from '../composables/iframe'
import PopupIframe from './PopupIframe.vue'

const props = defineProps < {
  href: string
}>()

const options = inject<LinkPreviewPopupOptions>(linkPreviewPopupInjectionKey, defaultLinkPreviewPopupOptions)

const anchorElement = ref<HTMLAnchorElement | null>(null)
const iframeWrapperElement = ref<HTMLDivElement | null>(null)

const { width: windowWidth, height: windowHeight } = useWindowSize()
const { livesInIframe } = useInIframe()
const { isOutside: isOutsideAnchorElement } = useMouseInElement(anchorElement)
const { isOutside: isOutsideIframeWrapperElement } = useMouseInElement(iframeWrapperElement)

const popupCoordinatesX = ref(0)
const popupCoordinatesY = ref(0)

const isClient = ref(false)
const hovering = ref(false)

const isAnchor = computed<boolean>(() => {
  return props.href.startsWith('#')
})

const hrefHost = computed<string>(() => {
  if (isAnchor.value)
    return ''

  try {
    return new URL(props.href, window.location.href).host
  }
  catch (e) {
    return ''
  }
})

const isOneOfPreviewHosts = computed<boolean>(() => {
  if (!window || !window.location)
    return false

  if (!options.previewHostNames || options.previewHostNames.length === 0)
    return hrefHost.value === window.location.host

  return hrefHost.value && options.previewHostNames.includes(hrefHost.value)
})

const showIframe = computed<boolean>(() => !livesInIframe.value && isOneOfPreviewHosts.value && hovering.value)

function watchHandler(val: boolean, oldVal: boolean) {
  if (val === oldVal)
    return

  if (!val) {
    hovering.value = true

    const { x, y, right, bottom, height, width } = anchorElement.value.getBoundingClientRect()

    if (right + 600 > windowWidth.value)
      popupCoordinatesX.value = x + window.scrollX - 600 + width
    else
      popupCoordinatesX.value = x + window.scrollX

    if (bottom + 480 > windowHeight.value)
      popupCoordinatesY.value = y + window.scrollY - 480 - 4
    else
      popupCoordinatesY.value = y + window.scrollY + height + 4
  }
  if (val) {
    setTimeout(() => {
      if (isOutsideAnchorElement.value && isOutsideIframeWrapperElement.value)
        hovering.value = false
    }, 250)
  }
}

onMounted(() => {
  isClient.value = true
})

watch(isOutsideAnchorElement, watchHandler)
watch(isOutsideIframeWrapperElement, watchHandler)
</script>

<template>
  <a
    ref="anchorElement"
    class="link-preview" relative inline-flex items-center justify-center
    :href="props.href"
  >
    <slot />
    <span
      v-if="isClient && !isAnchor && !isOneOfPreviewHosts"
      class="link-preview-link-content-external-icon"
      i-octicon:link-external-16 inline-flex items-center justify-center text-xs
    />
    <template v-if="isClient">
      <Teleport :to="options.popupTeleportTargetSelector">
        <TransitionGroup name="fade">
          <div
            v-if="isClient && showIframe"
            ref="iframeWrapperElement"
            flex="~ col"
            absolute top-0 z-20 m-0 h-120 w-150 overflow-hidden rounded-lg p-0
            border="solid 1 zinc-200 dark:zinc-700"
            class="link-preview-popup-wrapper"
            :style="{
              left: `${popupCoordinatesX}px`,
              top: `${popupCoordinatesY}px`,
            }"
            shadow="2xl"
          >
            <PopupIframe :href="props.href" />
          </div>
        </TransitionGroup>
      </Teleport>
    </template>
  </a>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
