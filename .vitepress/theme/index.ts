import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'

import type { Options as NolebaseEnhancedReadabilitiesOptions } from '@nolebase/vitepress-plugin-enhanced-readabilities'
import {
  InjectionKey as NolebaseEnhancedReadabilitiesInjectionKey,
  LayoutMode as NolebaseEnhancedReadabilitiesLayoutMode,
  NolebaseEnhancedReadabilitiesMenu,
  NolebaseEnhancedReadabilitiesScreenMenu,
} from '@nolebase/vitepress-plugin-enhanced-readabilities'

import LinkPreviewPopup from '../plugins/vue3-plugin-link-preview-popup/src/index'
import HomePage from './components/HomePage.vue'
import DocFooter from './components/DocFooter.vue'
import Share from './components/Share.vue'

import BasicButton from './components/BasicButton.vue'
import BasicDropdownMenu from './components/BasicDropdownMenu.vue'

import Tag from './components/Tag.vue'
import TagItem from './components/TagItem.vue'
import Tags from './components/Tags.vue'
import TocList from './components/TocList.vue'

import Changelog from './components/Changelog.vue'
import Contributors from './components/Contributors.vue'

import '../styles/main.css'
import '../styles/vars.css'
import '@nolebase/vitepress-plugin-enhanced-readabilities/dist/style.css'

import 'uno.css'

const ExtendedTheme: Theme = {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      'home-features-after': () => h(HomePage),
      'doc-footer-before': () => h(DocFooter),
      'nav-bar-content-after': () => [
        h(NolebaseEnhancedReadabilitiesMenu),
        h(Share),
      ],
      'nav-screen-content-after': () => [
        h(NolebaseEnhancedReadabilitiesScreenMenu),
      ],
    })
  },
  enhanceApp({ app }) {
    app.component('HomePage', HomePage)
    app.component('DocFooter', DocFooter)
    app.component('Share', Share)

    /**
     * Have to manually import and register the essential components that needed during build globally.
     *
     * Learn more at: Warn `Hydration completed but contains mismatches.` and Custom components are not rendered · Issue #1918 · vuejs/vitepress
     * https://github.com/vuejs/vitepress/issues/1918
     */

    app.component('BasicButton', BasicButton)
    app.component('BasicDropdownMenu', BasicDropdownMenu)

    app.component('Tag', Tag)
    app.component('TagItem', TagItem)
    app.component('Tags', Tags)
    app.component('TocList', TocList)

    app.component('Changelog', Changelog)
    app.component('Contributors', Contributors)

    app.provide(NolebaseEnhancedReadabilitiesInjectionKey, {
      layoutSwitch: {
        defaultMode: NolebaseEnhancedReadabilitiesLayoutMode.FullWidth,
      },
      spotlight: {
        defaultToggle: true,
      },
    } as NolebaseEnhancedReadabilitiesOptions)

    app.use(LinkPreviewPopup)
  },
}

export default ExtendedTheme
