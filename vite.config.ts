import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import UnoCSS from 'unocss/vite'
import { GitChangelog, GitChangelogMarkdownSection } from '@nolebase/vitepress-plugin-git-changelog/vite'
import { PageProperties, PagePropertiesMarkdownSection } from '@nolebase/vitepress-plugin-page-properties/vite'

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
        exclude: (_, { helpers }): boolean => {
          if (helpers.idEquals('toc.md'))
            return true
          if (helpers.idEquals('index.md'))
            return true

          return false
        },
      }),
      PageProperties(),
      PagePropertiesMarkdownSection({
        excludes: [],
        exclude: (_, { helpers }): boolean => {
          if (helpers.idEquals('toc.md'))
            return true
          if (helpers.idEquals('index.md'))
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
