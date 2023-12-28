import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import UnoCSS from 'unocss/vite'
import { GitChangelog, GitChangelogMarkdownSection } from '@nolebase/vitepress-plugin-git-changelog/vite'
import Inspect from 'vite-plugin-inspect'
import { MarkdownTransform } from './.vitepress/plugins/markdownTransform'
import { EasyTag } from './.vitepress/plugins/vitepress-plugin-docsmd-easytag/src'
import { include } from './.vitepress/meta'

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
      Inspect(),
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
        excludes: [
          join(ROOT, 'index.md'),
          join(ROOT, 'toc.md'),
        ],
      }),
      MarkdownTransform(),
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
