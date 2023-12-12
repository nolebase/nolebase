import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import process from 'node:process'
import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import UnoCSS from 'unocss/vite'
import { getChangeLog } from './scripts/changelog'
import { ChangeLog } from './.vitepress/plugins/changelog'
import { MarkdownTransform } from './.vitepress/plugins/markdownTransform'
import { EasyTag } from './.vitepress/plugins/vitepress-plugin-docsmd-easytag/src'
import { include } from './.vitepress/meta'

const ROOT = dirname(fileURLToPath(import.meta.url))

export default defineConfig(async () => {
  const [changeLog] = await Promise.all([
    getChangeLog(800),
  ])

  return {
    assetsInclude: ['**/*.mov'],
    optimizeDeps: {
      // vitepress is aliased with replacement `join(DIST_CLIENT_PATH, '/index')`
      // This needs to be excluded from optimization
      exclude: ['vitepress'],
    },
    plugins: [
      EasyTag({
        rootDir: ROOT,
        includes: [...include],
        openAIAPISecret: process.env.OPENAI_API_SECRET!,
        openAIAPIHost: process.env.OPENAI_API_HOST!,
      }),
      MarkdownTransform(),
      ChangeLog(changeLog),
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
