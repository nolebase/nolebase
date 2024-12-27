# 使用 `onWatcherCleanup` 构建一个在 `watch` 中安全使用的 `fetch` 函数

使用 Vue 3.5 中新的 `onWatcherCleanup` 和 `getCurrentWatcher` 函数，你可以封装一个能够安全的在 watch 中使用的 fetch 函数。

这个函数会在 watch 的回调函数执行之前，取消上一次的请求。

Using the new `onWatcherCleanup` and `getCurrentWatcher` functions in Vue 3.5, you can encapsulate a fetch function that can be safely used in watch.

This function will cancel the previous request before the callback function of watch is executed.

```typescript
import { onWatcherCleanup, getCurrentWatcher } from 'vue'

export function myFetch(url: string, options: RequestInit) {
  const controller = new AbortController()

  if (getCurrentWatcher()) {
    onWatcherCleanup(() => {
      controller.abort()
    })
  }

  return fetch(url, { ...options, signal: controller.signal })
}
```

```html
<script setup>
watch(id, (newId) => {
  myFetch(`/api/${newId}`).then(() => {
    // callback logic
  })
})
</script>
```
