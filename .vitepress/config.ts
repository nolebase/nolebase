import process from 'node:process'
import { defineConfig } from 'vitepress'
import MarkdownItFootnote from 'markdown-it-footnote'
import MarkdownItMathjax3 from 'markdown-it-mathjax3'
import { BiDirectionalLinks } from '@nolebase/markdown-it-bi-directional-links'
import type { Options as ElementTransformOptions } from '@nolebase/markdown-it-element-transform'
import { ElementTransform } from '@nolebase/markdown-it-element-transform'
import { githubRepoLink, siteDescription, siteName, targetDomain } from '../metadata'
import { sidebar } from './docsMetadata.json'

export default defineConfig({
  lang: 'en-US',
  title: siteName,
  description: siteDescription,
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
    ['meta', { name: 'author', content: 'Canarypwn' }],
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
      { property: 'og:image', content: `${targetDomain}/og.png` },
    ],
    ['meta', { property: 'og:description', content: siteDescription }],
    ['meta', { property: 'og:site_name', content: siteName }],

    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:creator', content: 'Ayaka Neko, Ayaka Rizumu' }],
    [
      'meta',
      { name: 'twitter:image', content: `${targetDomain}/og.png` },
    ],

    [
      'link',
      { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#927baf' },
    ],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    ['meta', { name: 'msapplication-TileColor', content: '#603cba' }],
  ],
  themeConfig: {
    outline: { label: 'Outline', level: 'deep' },
    darkModeSwitchLabel: 'DarkModeSwitch',
    editLink: {
      pattern: `${githubRepoLink}/tree/main/:path`,
      text: 'edit',
    },
    socialLinks: [{ icon: 'github', link: githubRepoLink }],
    footer: {
      message: '用 <span style="color: #e25555;">&#9829;</span> 撰写',
      copyright:
        '<a class="footer-cc-link" target="_blank" href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a> © 2022-PRESENT Nólëbase 的创作者们',
    },
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: 'Search',
                buttonAriaLabel: 'Search',
              },
              modal: {
                noResultsText: 'No results found',
                resetButtonTitle: 'Reset search query',
                footer: {
                  selectText: 'Select',
                  navigateText: 'Navigate',
                },
              },
            },
          },
        },
      },
    },
    nav: [
      { text: 'Homepage', link: '/' },
      { text: 'Notes', link: '/Notes/' },
      { text: 'Latest', link: '/toc' },
    ],
    sidebar,
  },
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'one-dark-pro',
    },
    math: true,
    config: (md) => {
      md.use(MarkdownItFootnote)
      md.use(MarkdownItMathjax3)
      md.use(BiDirectionalLinks({
        dir: process.cwd(),
      }))
      md.use(ElementTransform, (() => {
        let transformNextLinkCloseToken = false

        return {
          transform(token) {
            switch (token.type) {
              case 'link_open':
                if (token.attrGet('class') !== 'header-anchor') {
                  token.tag = 'VPNolebaseInlineLinkPreview'
                  transformNextLinkCloseToken = true
                }
                break
              case 'link_close':
                if (transformNextLinkCloseToken) {
                  token.tag = 'VPNolebaseInlineLinkPreview'
                  transformNextLinkCloseToken = false
                }

                break
            }
          },
        } as ElementTransformOptions
      })())
    },
  },
})
