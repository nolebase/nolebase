import { createRecentUpdatesLoader } from '@nolebase/vitepress-plugin-index/vitepress'

export default createRecentUpdatesLoader({
  dir: 'zh-CN/笔记',
  rewrites: [
    // wired, it wasn't designed to work like this.
    {
      from: /^zh-CN\/笔记/,
      to: 'zh-CN/笔记',
    },
  ],
})
