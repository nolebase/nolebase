# RFC：在 Vue 中实现另一种自定义指令 API

custom directive 是 Vue 中一个非常强大的功能，它允许我们在 DOM 元素上添加自定义行为。在 Vue Vapor 中为了更好的性能，移除了 vDom。我之前的尝试模仿了 vDom 的 custom directive API，结果是这样的模仿会十分消耗性能，并增加代码的复杂度。

为了解决这个问题，我尝试使用另一种方式来实现新的自定义指令 API，在 Vue Vapor 中获得更好的性能并兼容 Vue Core。

## 思路速记

- 使用 effectScope 和 effect 现有的生命周期作为触发时机，避免模拟 vDom 行为的性能损耗。
- 如果不使用相关 API，就避免产生性能损耗。
- v-show 和 v-model 这样的 API 为确保性能，尽量使用底层定制化实现而不是用户层的自定义指令 API 来实现。

```html
<p v-directive="myRef">text</p>
```

- created: 在指令声明时执行
- beforeMount: 在元素所在的 effectScope 执行之后，元素挂载“前”执行
- mounted: 在元素所在的 effectScope 执行之后，元素挂载“后”执行
- beforeUpdate: 在绑定的值变化后，元素更新“前”执行,类似 render watch。
- updated: 在绑定的值变化后，元素更新“后”执行，类似 post watch
- beforeUnmount: 在元素所在的 effectScope 卸载之前执行
- unmounted: 在元素所在的 effectScope 卸载之后执行

## 编写指令

<!-- 为了实现这个设计，我们可以创建 `directiveWatch` 函数。它接受类似 watch source 的参数和 -->

我们可以创建一个 directive 函数。它的作用就把 `v-directive="myRef"` 里面的 `myRef` 传递给我们的自定义指令函数。

这个自定义指令函数会在当前这个 node 所在的 effectScope 中被调用。

函数的行为就像 setup 一样，所以开发者可以在里面写类似 watchEffect 这样的代码。setup 的 props 会包含用户传入的值。

```js
import { onScopeBeforeMount, onScopeDispose } from 'vue/vapor'
const vShowMap = new WeakMap()

export function vShow(source, node) {
  let value = source()
  let oldValue

  onScopeBeforeMount(() => {
    vShowMap.set(node, node.style.display === 'none' ? '' : node.style.display)
    setDisplay(node, value)
  })

  watchPostEffect(() => {
    let value = source()
    if (!oldValue !== !value)
      setDisplay(node, source)
    oldValue = value
  })

  onScopeDispose(() => {
    setDisplay(node, source())
  })
}

function setDisplay(el, value) {
  el.style.display = value ? vShowMap.get(el)! : 'none'
}
```

需要注意的是为了实现 `beforeMount` / `mounted`，我们需要拓展 `effectScope`。在其中增加两个 hooks。并在 vapor runtime 中合适的时机调用它。如果没有任何地方用到这两种 hook，则跳过调用。

## 生成指令运行时

```js
function render(ctx) {
  const n0 = t0()
  vShow(() => ctx.ok, n0)
  return n0
}
```


## 兼容 Vue Core

可以在现有的  v1 自定义指令 `created` 钩子的相同时机创建一个 scope 作为 v2 的 `setup`，然后在 unmounted 钩子中销毁这个 scope 作为 v2 的 `onScopeDispose`。

至于 `beforeMount` / `mounted` 钩子，我们可以在现有的 v1 自定义指令中同名 hook 相同时机调用 v2 的 hook。

对值的 update 回调使用 Watch API 实现。
