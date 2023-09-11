import type { Plugin } from 'vue'
import LinkPreviewPopup from './components/LinkPreviewPopup.vue'
import { defaultLinkPreviewPopupOptions, linkPreviewPopupInjectionKey } from './types'
import type { LinkPreviewPopupOptions } from './types'

export default {
  install: (app, options?: LinkPreviewPopupOptions) => {
    if (options)
      app.provide(linkPreviewPopupInjectionKey, options)
    else
      app.provide(linkPreviewPopupInjectionKey, defaultLinkPreviewPopupOptions)

    app.component('LinkPreviewPopup', LinkPreviewPopup)
  },
} as Plugin
