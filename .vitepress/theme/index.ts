import type { Theme } from 'vitepress'

import { presetClient } from '@nolebase/integrations/vitepress/client'
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'

import AppContainer from './components/AppContainer.vue'
import DocFooter from './components/DocFooter.vue'
import HomePage from './components/HomePage.vue'
import Share from './components/Share.vue'

import 'virtual:uno.css'
import '../styles/main.css'
import '../styles/vars.css'

const nolebase = presetClient<{
  tags: string[]
  progress: number
}>({
  enhancedReadabilities: {
    options: {
      layoutSwitch: {
        defaultMode: 4,
      },
      spotlight: {
        defaultToggle: true,
        hoverBlockColor: 'rgb(240 197 52 / 7%)',
      },
    },
  },
})

const ExtendedTheme: Theme = {
  extends: DefaultTheme,
  Layout: () => {
    const slots = nolebase!.enhanceLayout?.() ?? {}

    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      'doc-top': () => [
        ...slots['doc-top'].map(slot => slot()),
      ],
      'doc-footer-before': () => [
        h(DocFooter),
      ],
      'nav-bar-content-after': () => [
        h(Share),
        ...slots['nav-bar-content-after'].map(slot => slot()),
      ],
      'nav-screen-content-after': () => [
        ...slots['nav-screen-content-after'].map(slot => slot()),
      ],
    })
  },
  async enhanceApp(ctx) {
    const { app } = ctx

    /**
     * Have to manually import and register the essential components that needed during build globally.
     *
     * Learn more at: Warn `Hydration completed but contains mismatches.` and Custom components are not rendered · Issue #1918 · vuejs/vitepress
     * https://github.com/vuejs/vitepress/issues/1918
     */

    await nolebase?.enhanceApp?.(ctx)

    app.component('HomePage', HomePage)
    app.component('DocFooter', DocFooter)
    app.component('Share', Share)
    app.component('AppContainer', AppContainer)
  },
}

export default ExtendedTheme
