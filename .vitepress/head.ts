import type { HeadConfig } from 'vitepress'
import { creatorNames, creatorUsernames, siteDescription, siteName, targetDomain } from '../metadata'

export default [
  ['meta', {
    name: 'theme-color',
    content: '#ffffff',
  }],
  [
    'link',
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
      sizes: '180x180',
    },
  ],
  [
    'link',
    {
      rel: 'icon',
      href: '/logo.svg',
      type: 'image/svg+xml',
    },
  ],
  [
    'link',
    {
      rel: 'alternate icon',
      href: '/favicon.ico',
      type: 'image/png',
      sizes: '16x16',
    },
  ],
  ['meta', {
    name: 'author',
    content: creatorNames.join(', '),
  }],
  [
    'meta',
    {
      name: 'keywords',
      content:
          ['markdown', 'knowledge-base', '知识库', 'vitepress', 'obsidian', 'notebook', 'notes', ...creatorUsernames].join(', '),
    },
  ],

  ['meta', {
    property: 'og:title',
    content: siteName,
  }],
  [
    'meta',
    {
      property: 'og:image',
      content: `${targetDomain}/og.png`,
    },
  ],
  ['meta', {
    property: 'og:description',
    content: siteDescription,
  }],
  ['meta', {
    property: 'og:site_name',
    content: siteName,
  }],

  ['meta', {
    name: 'twitter:card',
    content: 'summary_large_image',
  }],
  ['meta', {
    name: 'twitter:creator',
    content: creatorUsernames.join(', '),
  }],
  [
    'meta',
    {
      name: 'twitter:image',
      content: `${targetDomain}/og.png`,
    },
  ],

  [
    'link',
    {
      rel: 'mask-icon',
      href: '/safari-pinned-tab.svg',
      color: '#927baf',
    },
  ],
  ['link', {
    rel: 'manifest',
    href: '/site.webmanifest',
  }],
  ['meta', {
    name: 'msapplication-TileColor',
    content: '#603cba',
  }],
  // Proxying Plausible through Netlify | Plausible docs
  // https://plausible.io/docs/proxy/guides/netlify
  ['script', { 'defer': 'true', 'data-domain': 'nolebase.ayaka.io', 'data-api': '/api/v1/page-external-data/submit', 'src': '/assets/page-external-data/js/script.js' }],
] satisfies HeadConfig[]
