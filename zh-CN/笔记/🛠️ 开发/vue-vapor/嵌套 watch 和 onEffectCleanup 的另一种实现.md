# 嵌套 watch 和 onEffectCleanup 的另一种实现

在思考如何实现 `v-if` 时想到了这种实现方式：

```javascript
// in the generated code
function render() => {
  const t0 = template('<div></div>')

  // ...
  // <div v-if="expression">{{bar}}</div>
  renderWatch(() => !!(/* vIfExpression */), (bool) => {
    if (bool) {
      const t1 = template("<div></div>")
      // ...
      renderEffect(() => {
        setText(n1, undefined, bar.value)
      })
    }
  })
  return t0()
}
```

但是这涉及到嵌套 Watch API，但是经过简单的测试，发现目前并不支持。[在 Playground 中尝试一下](https://play.vuejs.org/#eNp9UclOwzAQ/ZXBlwQpJEK9VWklQJWAAyBA4uJLlE7SFMe2bCetFOXfGTvdDqiHLH7L+M3MwB60TvsO2ZzltjSNdmDRdXrJZdNqZRwMYLBKYFe4cnP4rKoKSwcjVEa1EJE94rJU0jpobQ0L74ijZxRCwY8yYn0T3XLJZTDH8S0sll6Y9oXoMIEJGLiEy/IHXYABfHUlMBWqjqOTN0rOdegGgJHe/smzqRlqgw4OWy0Kh3QCyDf3y2EIQccxz+gU0EbqzkF/16o1igVnxHMGGZF5duFnCXOWwlRNnW6tkjS3kJCzUrW6EWjetWsoLGfzY3bOCprE7jVgzlDLR7zcYPn7D761e49x9mHQoumRsxPnClOjm+jV1xvu6f9EUvpOkPoK+Yk0yM5nnGSPnVxT7AtdSPsStt/I+tuu9g6lPTblg4ZRBz1ntP2nK62f487SWfDRhtj4B4DCz7o=)会发现 Console 中的 log 会随着输入行为变得越来越多，因为之前注册的 `watchEffect` 并没有被销毁。

实现 Watch API 中嵌套 Watch API 调用的时候，需要把 `CallBack` 包在 `EffectScope` 里面，这样就可以在 `cleanup` 时调用 `effectScope.stop()`，然后突然发现这种情况下 `onScopeDispose` 完全可以取代 `onEffectCleanup` 的作用。

但是考虑到 `onScopeDispose` 的名称在 `watch` 中使用容易产生误解，我们可以采用两种方法解决这个问题：

#### 方案 1

用 `const onEffectCleanup = onScopeDispose` 的办法创建一个别名，但是它们本质上是一样的。

#### 方案 2

直接把 `onScopeDispose` 改名成 `onCleanup`。这样的名字更通用，因为它同时可以用在 `EffectScope`, `watch`/`watchEffect` 和 `setup` 中（由于 `setup()` 还为组件创建了一个作用域，因此当没有创建显式效果作用域时，它与 `onUnmounted()` 等效。）。考虑到兼容性，可以保留原有的 `onScopeDispose` 作为 `onCleanup` 的别名并标记为将被弃用。

这个方式类似于 **Solid** 中的 [onCleanup](https://www.solidjs.com/docs/latest/api#oncleanup)

### 破坏性

在 Watch API 的 `CallBack` 中包裹 `EffectScope` 可能会带来一些破坏性，因为原来的嵌套 `watch` 在组件被卸载后不会自己停止，需要用户手动管理，对于那些依赖这种特性的项目而言，这会是一个破坏性更新。但是我认为嵌套使用的 `watch` 不会被清理，而是每次父 `watch` re-run 都会创建一个新的 `watch` 是更反直觉的事情。

## Code

下面是实际尝试的代码（[在 Playground 中查看](https://play.vuejs.org/#eNq1VEuP0zAQ/iuDL8lKIRXa26qtBEsl4ACIReJiCaXutM3i2JYfaaUq/52JnT6XLXDYQ1V75ptvvnnEO/bWmLINyO7Y2AlbGw8OfTBTrurGaOthBxaXBWwqL9ZQOfgZT4Nhtlyi8EdzuheQ/h+ENliAVvHwvnZGO4QOllY3kFHWjCuuhFbOEyjF3EusVDAwuQg7IpOSCeROByuIX8xvYDIdFByseVvothCJLgJ2XAEkDtczE4fCzanW/CZCUkweQaXz2pTzWi3S/SZCkssGleeRWsxTunPNPbaj35nyoWUTijmqTsZ8yPzyYq/rbNyK0tHY8+wDSqnhh7Zy8SqLkNTlxETAsq1kuNLuQd6Qmei1xFLqVZ6lOQ6ArICWNqVNii+W4fnoC+A5y1N89JN7X+7fey+Ctaj6cR1q/ZeyhiEfixt4/q+8geVpkWdsz8Wd4FK941H6wunbpovHxsjKI90Axus3090uDr7rxiO6RWutTPDQvm70AuWEM/JzBiNyjkcn8axgnpZMLetV+ei0oscktpAzoRtTS7RfjK9JJmd3qbm9r6LN2nyKNm9phfZ2sUbx6w/2R7ftbZx9tejQtsjZwecru0Kf3LOHz7il88FJ6oMk9BXnN6QWhl5jgr0LakGyT3BR7cf4JNZq9d3Nth6V2xfVC+2RXcRzRm/b/ZXSj3Jvy9sYRxNi3W8hy+Jb)）：

```javascript
import { ref, watch as _watch, watchEffect as _watchEffect, EffectScope, onScopeDispose } from 'vue'

const onEffectCleanup = onScopeDispose

const watch = (source, cb) => _watch(source, (v,ov,cleanup) => {
  const scope = new EffectScope()
  cleanup(scope.stop.bind(scope))
  scope.run(() => cb(v,ov,onScopeDispose))
})

const watchEffect = cb => _watchEffect(cleanup => {
  const scope = new EffectScope()
  cleanup(scope.stop.bind(scope))
  scope.run(() => cb(onScopeDispose))
})

const msg = ref('Hello World!')

watch(() => msg.value, (v,ov,cleanup) => {
  cleanup(() => console.log('watch cleanup', v, ov))
  onEffectCleanup(() => console.log('watch onEffectCleanup', v, ov))
  console.log('watch', v,ov)
})

watchEffect(cleanup => {
  const current = msg.value
  cleanup(() => console.log('watchEffect cleanup', current))
  onEffectCleanup(() => console.log('watchEffect onEffectCleanup', current))
  console.log('watchEffect', current)
})
```
