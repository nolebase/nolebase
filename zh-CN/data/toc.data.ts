import { createRecentUpdatesLoader } from '@nolebase/vitepress-plugin-index/vitepress'

export default createRecentUpdatesLoader({
  dir: 'zh-CN/笔记',
  rewrites: [
    {
      from: /^zh-CN\/笔记/,
      to: '笔记',
    },
  ],
})
