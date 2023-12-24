# Vue Vapor Discussion

本文粗略列举了一下 Vapor 目前需要具体讨论的一些事情

问题汇总：
1. runtime-vapor 和 runtime-core 代码复用
2. Render Watch and Render Effect
3. onEffectCleanup 直接集成到 reactivity 中
4. runtime-vapor 添加 renderEffect，移除原有的 watchEffect 和 watch 的 flush rendering
5. renderWatch 里面实现 beforeUpdate, updated 之类的各种钩子
6. 如何混用 Vapor Component 和 vDom Component？
7. 关于其它未实现功能的讨论

## runtime-vapor 和 runtime-core 代码复用
主要涉及 `scheduler.ts` 文件，这个文件负责调度 effect 的 flush，也就是 `sync`/`pre`/`post` 这些，因为考虑到之后需要支持  Vapor Component 和 vDom Component？的混用问题，现在的 vapor 和 core 各有一个 scheduler.ts 文件的形式是有问题的。

[相关 PR](https://github.com/vuejs/core-vapor/pull/69)

[相关代码](https://github.com/vuejs/core-vapor/pull/69/files#diff-c60e2c7d0cb1f0141de00557a7f54c49c8e1e88dddc4e0b74c3fadef78d088ffR51-R62)

## Render Watch / Render Effect：
在 render 函数中使用专用的 Render `watch` 和 Render `watchEffect` API

## 将 onEffectCleanup 直接集成到 reactivity package 中

我们需要讨论将它加入 **reactivity pkg** 或者单独的 **scheduler pkg** 中


这个 `onEffectCleanup` 已经在 Vapor 中实装了，下面是对应的 Issue 和 PR

[Issue](https://github.com/vuejs/core-vapor/issues/67) / [PR](https://github.com/vuejs/core-vapor/pull/69)

用起来大概是这样的，下面的例子中演示了 `@[eventName]="handler"` 这种情况, 这里的 on 函数是 runtime-vapor 提供的一个运行时：

```js
// in component setup or render
watchEffect(() => {
  on(el1, eventName.value, handler)
  on(el2, eventName.value, handler)
})

// in runtime-vapor pkg
function on(el, event, handler) {
  el.addEventListener(event, handler)
  onEffectCleanup(() => {
    el.removeEventListener(event, handler)
  })
}
```

Additionally, provide support for `watch`

```js
watch(id, async (newId, oldId) => {
  const { response, cancel } = doAsyncWork(newId)
  // `cancel` will be called if `id` changes, cancelling
  // the previous request if it hasn't completed yet
  onEffectCleanup(cancel)
  data.value = await response
})
```

## runtime-vapor 添加 renderEffect，移除原有的 watchEffect 和 watch 的 flush rendering

这里有一个问题，我们除了 watchEffect 的 render 版本之外，应该还需要 watch 的 render 版本吧\
我举个例子：

```html
<Comp v-if="show" />
```
**Compiled To**
```typescript

renderEffect(() => {
  if (ctx.show) {
                // ❌ 这里面的 setup 和 render 也会被作为 Effect 的依赖进 ❌
    const comp = createComponent(Comp)
    insert(comp, /* ... */, /* ... */)
    onEffectCleanup(() => {
      /* ... */
    })
  }
})


renderWatch(() => ctx.show /* 或者其它表达式 */, (value) => {
  if (value) {
                // ✅ 这样就没问题了 ✅
    const comp = createComponent(Comp)
    insert(comp, /* ... */, /* ... */)
    onEffectCleanup(() => {
      /* ... */
    })
  }
})
```

## renderWatch 里面实现 beforeUpdate, updated 之类的各种钩子

待讨论更多细节

## 如何混用 Vapor Component 和 vDom Component？

待讨论更多细节

## 未实现功能的讨论

[TODO](https://github.com/vuejs/core-vapor?tab=readme-ov-file#todo) |
[Issues](https://github.com/vuejs/core-vapor/issues) |
[Component](https://github.com/vuejs/core-vapor/issues/4)


v-for
#21 opened 3 weeks ago by sxzz

Runtime Directives todoPR welcome
#19 opened 3 weeks ago by sxzz

v-memo on hold todo
#18 opened 3 weeks ago by sxzz

v-model pending
#17 opened last month by Ubugeeei

v-show pending
#16 opened last month by zhangmo8

v-if on hold
#9 opened last month by faga295

[Runtime] Component (base issue) on discussing todo
#4 opened last month by Ubugeeei

Life Cycles
