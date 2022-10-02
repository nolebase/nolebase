import { defineConfigWithTheme } from 'vitepress'
import { sidebar } from './metainfo.json'
import {
  siteName,
  siteDescription,
  githubRepoLink,
} from './meta'
import MarkdownItFootnote from 'markdown-it-footnote'

export default defineConfigWithTheme({
  lang: 'zh-CN',
  title: siteName,
  description: siteDescription,
  lastUpdated: true,
  head: [
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' }],
    ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'alternate icon', href: '/favicon.ico', type: 'image/png', sizes: '16x16' }],
    ['meta', { name: 'author', content: `Ayaka Neko, Ayaka Rizumu` }],
    ['meta', { name: 'keywords', content: 'markdown, knowledgebase, 知识库, vitepress, obsidian, notebook, notes, nekomeowww, littlesound' }],
    ['meta', { property: 'og:title', content: siteName }],
    ['meta', { property: 'og:description', content: siteDescription }],
    ['meta', { name: 'twitter:title', content: siteName }],
    ['meta', { name: 'twitter:description', content: siteDescription }],
    ['link', { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#927baf' }],
    ['link', {rel: 'manifest', href: '/site.webmanifest' }],
    ['meta', { name: 'msapplication-TileColor', content: '#603cba' }],
  ],
  themeConfig: {
    outline: 'deep',
    editLink: {
      pattern: 'https://github.com/LittleSound/notebook/tree/main/:path',
      text: '编辑本页面',
    },
    localeLinks: {
      text: '简体中文',
    },
    socialLinks: [
      { icon: 'github', link: githubRepoLink },
    ],
    footer: {
      message: '用 <span style="color: #e25555;">&#9829;</span> 撰写',
      copyright: '<a class="footer-cc-link" target="_blank" href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a> © 2022-PRESENT Nólëbase 的创作者们',
    },
    nav: [
      { text: '主页', link: '/' },
      { text: '笔记', link: '/笔记/index' },
    ],
    sidebar,
  },
  markdown: {
    theme: {
      light: 'one-dark-pro',
      dark: 'one-dark-pro',
    },
    config: (md) => {
      md.use(MarkdownItFootnote)
    }
  }
})
