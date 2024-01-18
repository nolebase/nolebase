import { fileURLToPath } from 'node:url'
import { dirname, join, sep } from 'node:path'
import process from 'node:process'
import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import UnoCSS from 'unocss/vite'
import { GitChangelog, GitChangelogMarkdownSection } from '@nolebase/vitepress-plugin-git-changelog/vite'
import { EasyTag } from './.vitepress/plugins/vitepress-plugin-docsmd-easytag/src'
import { include } from './metadata'

const ROOT = dirname(fileURLToPath(import.meta.url))

export default defineConfig(async () => {
  return {
    assetsInclude: ['**/*.mov'],
    optimizeDeps: {
      // vitepress is aliased with replacement `join(DIST_CLIENT_PATH, '/index')`
      // This needs to be excluded from optimization
      exclude: [
        'vitepress',
      ],
    },
    plugins: [
      EasyTag({
        rootDir: ROOT,
        includes: [...include],
        openAIAPISecret: process.env.OPENAI_API_SECRET!,
        openAIAPIHost: process.env.OPENAI_API_HOST!,
      }),
      GitChangelog({
        repoURL: () => 'https://github.com/nolebase/nolebase',
        maxGitLogCount: 1000,
      }),
      GitChangelogMarkdownSection({
        getChangelogTitle: (): string => {
          return '文件历史'
        },
        getContributorsTitle: (): string => {
          return '贡献者'
        },
        excludes: [],
        exclude: (id): boolean => {
          if (id === join(ROOT, 'toc.md').split(sep).join('/'))
            return true
          if (id === join(ROOT, 'index.md').split(sep).join('/'))
            return true

          return false
        },
      }),
      Components({
        include: [/\.vue$/, /\.md$/],
        dirs: '.vitepress/theme/components',
        dts: '.vitepress/components.d.ts',
      }),
      UnoCSS(),
    ],
    ssr: {
      noExternal: [
        '@nolebase/vitepress-plugin-enhanced-readabilities',
        '@nolebase/vitepress-plugin-highlight-targeted-heading',
        '@nolebase/vitepress-plugin-inline-link-preview',
      ],
    },
  }
})
