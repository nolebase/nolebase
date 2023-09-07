<script setup lang="ts">
import { inject, onUnmounted, ref } from 'vue'
import type { LinkPreviewPopupOptions } from '../types'
import { defaultLinkPreviewPopupOptions, linkPreviewPopupInjectionKey } from '../types'
import LocalLink from './LocalLink.vue'

const props = defineProps < {
  href: string
}>()

const options = inject<LinkPreviewPopupOptions>(linkPreviewPopupInjectionKey, defaultLinkPreviewPopupOptions)

const iframeNotReady = ref(true)

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
  }, 500)
}

onUnmounted(() => {
  iframeNotReady.value = true
})
</script>

<template>
  <iframe
    v-show="!iframeNotReady"
    border="none"
    m-0 w-full p-0
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
    <div i-svg-spinners:3-dots-bounce text-3xl />
    <span>加载中</span>
  </div>
  <LocalLink
    show-external-icon :href="props.href" border="none"
    bg="zinc-100 dark:zinc-800" absolute bottom-0 m-4 rounded-lg px-4 py-2 text-sm
  >
    <span flex="1">在当前页面打开</span>
  </LocalLink>
</template>
