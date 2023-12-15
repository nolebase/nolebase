import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'

import type { Options as NolebaseEnhancedReadabilitiesOptions } from '@nolebase/vitepress-plugin-enhanced-readabilities'
import {
  InjectionKey as NolebaseEnhancedReadabilitiesInjectionKey,
  LayoutMode as NolebaseEnhancedReadabilitiesLayoutMode,
  NolebaseEnhancedReadabilitiesMenu,
  NolebaseEnhancedReadabilitiesScreenMenu,
} from '@nolebase/vitepress-plugin-enhanced-readabilities'

import {
  NolebaseInlineLinkPreviewPlugin,
} from '@nolebase/vitepress-plugin-inline-link-preview'

import {
  NolebaseHighlightTargetedHeading,
} from '@nolebase/vitepress-plugin-highlight-targeted-heading'

import AppContainer from './components/AppContainer.vue'

import DocFooter from './components/DocFooter.vue'
import HomePage from './components/HomePage.vue'
import Share from './components/Share.vue'

import BasicButton from './components/BasicButton.vue'
import BasicDropdownMenu from './components/BasicDropdownMenu.vue'

import Tag from './components/Tag.vue'
import TagItem from './components/TagItem.vue'
import Tags from './components/Tags.vue'
import TocList from './components/TocList.vue'

import Changelog from './components/Changelog.vue'
import Contributors from './components/Contributors.vue'

import '@nolebase/vitepress-plugin-enhanced-readabilities/dist/style.css'
import '@nolebase/vitepress-plugin-highlight-targeted-heading/dist/style.css'
import '@nolebase/vitepress-plugin-inline-link-preview/dist/style.css'

import 'uno.css'

import '../styles/main.css'
import '../styles/vars.css'

const ExtendedTheme: Theme = {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      'doc-top': () => [
        h(NolebaseHighlightTargetedHeading),
      ],
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

    app.component('AppContainer', AppContainer)

    app.provide(NolebaseEnhancedReadabilitiesInjectionKey, {
      layoutSwitch: {
        defaultMode: NolebaseEnhancedReadabilitiesLayoutMode.FullWidth,
      },
      spotlight: {
        defaultToggle: true,
        hoverBlockColor: 'rgb(240 197 52 / 7%)',
      },
    } as NolebaseEnhancedReadabilitiesOptions)

    app.use(NolebaseInlineLinkPreviewPlugin)
  },
}

export default ExtendedTheme
