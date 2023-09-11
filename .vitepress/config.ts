import process from 'node:process'
import { defineConfigWithTheme } from 'vitepress'
import MarkdownItFootnote from 'markdown-it-footnote'
import MarkdownItMathjax3 from 'markdown-it-mathjax3'
import { MarkdownItBiDirectionalLinks } from './plugins/markdown-it-bidirectional-links/src'
import { sidebar } from './docsMetadata.json'
import { githubRepoLink, siteDescription, siteName } from './meta'
import { MarkdownItTokenTransform } from './plugins/markdown-it-element-transform/src'

export default defineConfigWithTheme({
  lang: 'zh-CN',
  title: siteName,
  description: siteDescription,
  lastUpdated: true,
  ignoreDeadLinks: true,
  head: [
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        href: '/apple-touch-icon.png',
        sizes: '180x180',
      },
    ],
    ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    [
      'link',
      {
        rel: 'alternate icon',
        href: '/favicon.ico',
        type: 'image/png',
        sizes: '16x16',
      },
    ],
    ['meta', { name: 'author', content: 'Ayaka Neko, Ayaka Rizumu' }],
    [
      'meta',
      {
        name: 'keywords',
        content:
          'markdown, knowledgebase, 知识库, vitepress, obsidian, notebook, notes, nekomeowww, littlesound',
      },
    ],

    ['meta', { property: 'og:title', content: siteName }],
    [
      'meta',
      { property: 'og:image', content: 'https://nolebase.ayaka.io/og.png' },
    ],
    ['meta', { property: 'og:description', content: siteDescription }],
    ['meta', { property: 'og:site_name', content: siteName }],

    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:creator', content: 'Ayaka Neko, Ayaka Rizumu' }],
    [
      'meta',
      { name: 'twitter:image', content: 'https://nolebase.ayaka.io/og.png' },
    ],

    [
      'link',
      { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#927baf' },
    ],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
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
    socialLinks: [{ icon: 'github', link: githubRepoLink }],
    footer: {
      message: '用 <span style="color: #e25555;">&#9829;</span> 撰写',
      copyright:
        '<a class="footer-cc-link" target="_blank" href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a> © 2022-PRESENT Nólëbase 的创作者们',
    },
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档',
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                },
              },
            },
          },
        },
      },
    },
    nav: [
      { text: '主页', link: '/' },
      { text: '笔记', link: '/笔记/' },
      { text: '最近更新', link: '/toc' },
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
      md.use(MarkdownItMathjax3)
      md.use(MarkdownItBiDirectionalLinks({
        dir: process.cwd(),
      }))
      md.use(MarkdownItTokenTransform({
        transformToken: (token) => {
          switch (token.type) {
            case 'link_open':
              token.tag = 'LinkPreviewPopup'
              break
            case 'link_close':
              token.tag = 'LinkPreviewPopup'
          }
        },
      }))
    },
  },
})
