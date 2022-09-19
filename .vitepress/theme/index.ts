import { h } from 'vue';
import Theme from 'vitepress/theme'
import '../style/main.css'
import '../style/vars.css'
import 'uno.css'
import Changelog from './components/ChangeLog.vue'

export default {
  ...Theme,
  Layout() {
    return h(Theme.Layout, null, {
      'doc-footer-before': () => h(Changelog),
    })
  },
}

