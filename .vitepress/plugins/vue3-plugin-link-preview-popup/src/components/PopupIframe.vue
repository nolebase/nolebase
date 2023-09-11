<script setup lang="ts">
import { inject, ref } from 'vue'
import type { LinkPreviewPopupOptions } from '../types'
import { defaultLinkPreviewPopupOptions, linkPreviewPopupInjectionKey } from '../types'
import LinkButton from './LinkButton.vue'

const props = defineProps < {
  href: string
}>()

const iframeNotReady = ref(true)

const options = inject<LinkPreviewPopupOptions>(linkPreviewPopupInjectionKey, defaultLinkPreviewPopupOptions)

function querySelectUntilFind(iframeElement: HTMLIFrameElement, selector: string) {
  return new Promise<HTMLElement>((resolve) => {
    setTimeout(() => {
      if (!iframeElement.contentDocument) {
        querySelectUntilFind(iframeElement, selector).then(resolve)
        return
      }

      const targetElement = iframeElement.contentDocument.querySelector(selector) as HTMLElement

      if (!targetElement) {
        querySelectUntilFind(iframeElement, selector).then(resolve)
        return
      }

      resolve(targetElement)
    }, 100)
  })
}

async function handleIframeOnLoad(e: Event) {
  const iframeElement = e.target as HTMLIFrameElement

  const toBeHideSelectors = options.selectorsToBeHided || defaultLinkPreviewPopupOptions.selectorsToBeHided || []

  const elements = await Promise.all(toBeHideSelectors.map((selector) => {
    return querySelectUntilFind(iframeElement, selector)
  }))

  elements.forEach((element) => {
    if (element)
      element.style.setProperty('display', 'none', 'important')
  })

  if (options.handleIframeLoaded) {
    if (options.handleIframeLoaded instanceof Promise)
      await options.handleIframeLoaded(iframeElement)
    else
      options.handleIframeLoaded(iframeElement)
  }

  setTimeout(() => {
    iframeNotReady.value = false
  }, 250)
}
</script>

<template>
  <iframe
    v-show="!iframeNotReady"
    border="none"
    m-0 w-full overflow-hidden rounded-lg p-0
    class="live-preview-popup-iframe"
    flex="1"
    :src="props.href"
    @load="handleIframeOnLoad"
  />
  <div
    v-show="iframeNotReady"
    bg="white dark:zinc-900"
    text="zinc-700 dark:white"
    flex="~ col 1" m-0 w-full items-center justify-center p-0
    class="live-preview-popup-loading"
  >
    <span i-svg-spinners:3-dots-bounce text-3xl />
    <span>加载中</span>
  </div>
  <LinkButton
    show-external-icon :href="props.href" border="none"
    absolute bottom-0 m-4 rounded-lg px-4 py-2 text-sm
  >
    <span flex="1">在当前页面打开</span>
  </LinkButton>
</template>

<style scoped less>
.link-preview-popup-pointer {
  height: 8px;
  width: 16px;
  position: absolute;
  background: inherit;
  z-index: 30;
  top: -8px;
  left: 0;
  border: 1px solid blue;
}
</style>
