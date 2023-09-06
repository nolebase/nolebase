<script setup lang="ts">
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { useWindowSize } from '@vueuse/core'

const props = defineProps < {
  href: string
}>()

const previewHostsIncludes = ['localhost:5173', 'localhost:4173', 'nolebase.ayaka.io']

const hovering = ref(false)
const iframeElement = ref<HTMLIFrameElement>(null)
const { width: windowWidth } = useWindowSize()

const livesInIframe = computed(() => {
  try {
    return window.self !== window.top && 'location' in window.top
  }
  catch (e) {
    return false
  }
})

const hrefHost = computed(() => {
  try {
    if (props.href.startsWith('#'))
      return ''

    return new URL(props.href, window.location.href).host
  }
  catch (e) {
    return ''
  }
})

const isOneOfPreviewHosts = computed(() => hrefHost.value && previewHostsIncludes.includes(hrefHost.value))
const showIframe = computed(() => !livesInIframe.value && isOneOfPreviewHosts.value && hovering.value)
const iframeAlign = ref<'left' | 'right'>('left')
const iframeNotReady = ref(true)

function handleMouseEnter(e: MouseEvent) {
  hovering.value = true
  const anchorElement = e.target as HTMLAnchorElement
  const { x } = anchorElement.getBoundingClientRect()

  if (x >= windowWidth.value / 2)
    iframeAlign.value = 'right'
  else
    iframeAlign.value = 'left'
}

function handleMouseLeave() {
  hovering.value = false
  iframeNotReady.value = true
}

function querySelectUntilFind(iframeElement: HTMLIFrameElement, selector: string) {
  return new Promise<HTMLElement>((resolve) => {
    setTimeout(() => {
      if (!iframeElement.contentDocument)
        querySelectUntilFind(iframeElement, selector).then(resolve)

      const targetElement = iframeElement.contentDocument.querySelector(selector)

      if (!targetElement)
        querySelectUntilFind(iframeElement, selector).then(resolve)

      resolve(targetElement as HTMLElement)
    }, 100)
  })
}

async function handleIframeOnLoad(e: Event) {
  const iframeElement = e.target as HTMLIFrameElement
  const toBeHideSelectors = ['.VPNav', '.VPFooter', '.VPLocalNav', '.VPSidebar', '.VPDocFooter > .prev-next']

  const elements = await Promise.all(toBeHideSelectors.map((selector) => {
    return querySelectUntilFind(iframeElement, selector)
  }))
  elements.forEach((element) => {
    if (element)
      element.style.setProperty('display', 'none', 'important')
  })
  setTimeout(() => {
    iframeNotReady.value = false
  }, 500)
}
</script>

<template>
  <a
    class="link-wrapper" relative inline-block
    :href="props.href"
    @mouseenter="handleMouseEnter"
    @pointerenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @pointerleave="handleMouseLeave"
  >
    <slot />
    <iframe
      v-if="showIframe"
      ref="iframeElement"
      border="solid 1 zinc-200 dark:zinc-700"
      bg="white dark:zinc-800"
      shadow="2xl"
      absolute z-10 m-0 h-120 w-150 rounded-lg p-0
      class="live-preview-popup"
      :class="{
        'link-preview-popup-align-left': iframeAlign === 'left',
        'link-preview-popup-align-right': iframeAlign === 'right',
        'invisible': iframeNotReady,
      }"
      :src="props.href"
      @load="handleIframeOnLoad"
    />
    <Transition name="fade">
      <div
        v-if="showIframe"
        border="solid 1 zinc-200 dark:zinc-700"
        bg="white dark:zinc-900"
        shadow="2xl"
        text="zinc-700 dark:white"
        flex="~ col" absolute z-10 m-0 h-120 w-150 items-center justify-center rounded-lg p-0
        :class="{
          'link-preview-popup-align-left': iframeAlign === 'left',
          'link-preview-popup-align-right': iframeAlign === 'right',
          'invisible': !iframeNotReady,
        }"
      >
        <div i-svg-spinners:3-dots-bounce text-3xl />
        <span>加载中</span>
      </div>
    </Transition>
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

.link-wrapper {
  &:hover {
    .link {
      text-decoration: underline;
    }
  }
}

.link-preview-popup-align-left {
  left: 0;
}

.link-preview-popup-align-right {
  right: 0;
}
</style>
