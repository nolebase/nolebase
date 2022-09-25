
let __unconfig_data;
let __unconfig_stub = function (data = {}) { __unconfig_data = data };
__unconfig_stub.default = (data = {}) => { __unconfig_data = data };
import fs from 'fs'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
const UnoCSS = __unconfig_stub;
import { presetAttributify, presetIcons, presetUno } from 'unocss'
import { getChangeLog } from './scripts/changelog'
import { ChangeLog } from './.vitepress/plugins/changelog'
import { MarkdownTransform } from './.vitepress/plugins/markdownTransform'

const __unconfig_default =  defineConfig(async () => {
  const [changeLog] = await Promise.all([
    getChangeLog(800),
  ])

  return {
    ssr: {
      format: 'cjs',
    },
    legacy: {
      buildSsrCjsExternalHeuristics: true,
    },
    optimizeDeps: {
      // vitepress is aliased with replacement `join(DIST_CLIENT_PATH, '/index')`
      // This needs to be excluded from optimization
      exclude: ['vitepress'],
    },
    plugins: [
      // custom
      MarkdownTransform(),
      ChangeLog(changeLog),

      // plugins
      // TODO remove cast when moved to Vite 3
      Components({
        include: [/\.vue$/, /\.md$/],
        dirs: '.vitepress/theme/components',
        dts: '.vitepress/components.d.ts',
      }) as Plugin,
      UnoCSS({
        shortcuts: [
          ['btn', 'px-4 py-1 rounded inline-flex justify-center gap-2 text-white leading-30px children:mya !no-underline cursor-pointer disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
        ],
        presets: [
          presetUno({
            dark: 'media',
          }),
          presetAttributify(),
          presetIcons({
            prefix: 'i-',
            scale: 1.2,
          }),
        ],
      }) as unknown as Plugin,
    ],
  }
})

if (typeof __unconfig_default === "function") __unconfig_default(...[{"command":"serve","mode":"development"}]);export default __unconfig_data;