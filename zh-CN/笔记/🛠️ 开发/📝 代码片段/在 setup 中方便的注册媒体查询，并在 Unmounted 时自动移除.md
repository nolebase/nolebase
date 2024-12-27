---
tags:
  - 开发/前端/Vue/Vue3
  - 开发/前端/Vue
  - 开发/前端/样式层叠表/CSS/媒体查询/Media-Query
---
# 在 `setup` 中方便的注册媒体查询，并在 `Unmounted` 时自动移除

Web 的多端适配需求日益增长，依靠 CSS 的媒体查询有时已经不能满足需求。为了应对复杂的需求，这时就需要  JavaScript 的介入。但是 在 `setup` 中注册媒体查询事件十分的繁琐。为了将重复的代码简化，特制了下面这个封装好的方法，直接调用即可注册媒体查询，并在适当的时候进行移除。

`src/util/matchMedia.ts`:

```typescript
/**
  在 setup 中方便的注册媒体查询，并在 Unmounted 时自动移除
 */
export default function onMedia(query: string, callback: (matches: boolean) => void) {
  let media: MediaQueryList | false
  const func = () => callback(!!media && media.matches)
  // 挂载
  onMounted(() => {
    media = typeof matchMedia === 'function' && matchMedia(`(${query})`)
    // 判断是否查询成功
    if (media && typeof media.addEventListener === 'function' && media.media !== 'not all') {
      // 初始触发一次事件，然后注册事件监听
      func()
      media.addEventListener('change', func)
    }
    else {
      // 出错时的提示
      if (import.meta.env.VITE_APP_MODE !== 'production')
        console.error(`Media query failed，Query Params："${query}"`)
    }
  })

  // 移除
  onUnmounted(() => {
    if (media && typeof media.removeEventListener === 'function')
      media.removeEventListener('change', func)
  })
}

```

## 使用方法

调用该方法的组件在 `Mounted` 时会触发一次回调函数，之后每当查询结果变更时会触发一次。如果因为浏览器不支持或者参数错误导致媒体查询失败，会在 `console` 中打印一条错误，并且不会触发任何的 `callback`

```vue
<script setup lang="ts">
import onMedia from '~/util/matchMedia'

onMedia('max-width: 640px', (matches) => {
  console.log('媒体查结果是否匹配：', matches)
})
</script>
```
