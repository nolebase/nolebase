import { join } from 'node:path'
import { presetVite } from '@nolebase/integrations/vitepress/vite'
import UnoCSS from 'unocss/vite'

import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'

import { creators, githubRepoLink } from './metadata'

const nolebase = presetVite({
  gitChangelog: {
    options: {
      gitChangelog: {
        repoURL: () => githubRepoLink,
        mapAuthors: creators,
      },
      markdownSection: {
        excludes: [
          join('zh-CN', 'toc.md'),
          join('zh-CN', 'index.md'),
        ],
      },
    },
  },
  pageProperties: {
    options: {
      markdownSection: {
        excludes: [
          join('zh-CN', 'toc.md'),
          join('zh-CN', 'index.md'),
        ],
      },
    },
  },
})

export default defineConfig(async () => {
  return {
    assetsInclude: ['**/*.mov'],
    optimizeDeps: {
      // vitepress is aliased with replacement `join(DIST_CLIENT_PATH, '/index')`
      // This needs to be excluded from optimization
      exclude: [
        'vitepress',
        '@nolebase/vitepress-plugin-index',
      ],
    },
    plugins: [
      Inspect(),
      Components({
        include: [/\.vue$/, /\.md$/],
        dirs: '.vitepress/theme/components',
        dts: '.vitepress/components.d.ts',
      }),
      UnoCSS(),
      ...nolebase.plugins(),
    ],
    ssr: {
      noExternal: [
        '@nolebase/vitepress-plugin-enhanced-readabilities',
        '@nolebase/vitepress-plugin-highlight-targeted-heading',
        '@nolebase/vitepress-plugin-inline-link-preview',
        '@nolebase/vitepress-plugin-index',
      ],
    },
  }
})
