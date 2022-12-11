import { h } from 'vue';
import Theme from 'vitepress/theme'
import '../style/main.css'
import '../style/vars.css'
import 'uno.css'

import HomePage from './components/HomePage.vue'
import DocFooter from './components/DocFooter.vue'
import Share from './components/Share.vue'

export default {
  ...Theme,
  Layout() {
    return h(Theme.Layout, null, {
      'home-features-after': () => h(HomePage),
      'doc-footer-before': () => h(DocFooter),
      'nav-bar-content-after': () => h(Share),
    })
  }
}

