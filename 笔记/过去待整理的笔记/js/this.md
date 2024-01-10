# this

## this.location

非严格模式下，Foo()相当于 window.Foo()，函数的 this 指向调用它的对象，所以 this 指向 window，window.location 就是当前窗口的 Location 对象。

'use strict'条件下，会报 TypeError, 无'use strict'下，this 指向 window

以下代码执行后，console 的输出是？

```js
function Foo() {
  console.log(this.location);
}
Foo();
```

::: details
当前窗口的 Location 对象
:::
