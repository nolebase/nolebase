import { h } from 'vue';
import Theme from 'vitepress/theme'
import '../style/main.css'
import '../style/vars.css'
import 'uno.css'

import DocFooter from './components/DocFooter.vue'

export default {
  ...Theme,
  Layout() {
    return h(Theme.Layout, null, {
      'doc-footer-before': () => h(DocFooter)
    })
  }
}

