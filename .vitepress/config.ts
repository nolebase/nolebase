import { defineConfigWithTheme } from 'vitepress'
import { sidebar } from './metainfo.json'

export default defineConfigWithTheme({
  title: 'notebook',
  description: 'Just playing around.',
  themeConfig: {
    outline: 'deep',
    nav: [
      { text: 'Home', link: '/' },
      { text: '笔记', link: '/笔记/index' },
    ],
    sidebar,
  },
})
