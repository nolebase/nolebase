---
title: 函数 Function
author: 刘俊
date: 2023-01-28
---

## 1. 函数的相关定义

- 函数是一个 JavaScript 代码块，定义之后，可以被执行或调用任意多次.
- 函数的定义可以包含一组标识符，称为参数或形参 (parameter).
- 函数的调用会为这些形参提供值，称为实参 (argument).
- 函数会使用实参的值计算自己的返回值，这个返回值称为函数调用表达式的值.
- 每次函数调用，还有调用上下文 (invocation context), 也就是 `this` 关键字的值.

---

- 把函数赋值给一个对象的属性，可以称函数是对象的方法.
- 函数是在通过一个对象被调用，这个对象就是函数的调用上下文，也就是 `this`.

---

- 用来初始化一个新对象的函数称为构造函数 (constructor).

## 2. 定义函数

函数声明由 `function` 关键字、命名函数的标识符、一对圆括号（存放函数的参数名）和一对花括号（存放 JavaScript 语句，即函数体）组成。

```js
function (parameters) {
  statement;
}
```

### 2.1 函数表达式

```js
// 这个函数表达式定义一个对参数求平方的函数。这里我们把它赋值给一个变量
const square = function(x) { return x*x; }

// 函数表达式可以含有函数名。比如在递归时有用
const f = function fact(x) {if (x <= 1) return 1; else return x*fact(x - 1); }

// 函数表达式可以作为其他函数的参数
[3, 2, 1].sort(fucntion(a, b) { return a - b; })

// 函数表达式也可以定义完立即调用
let tensquared = (fucntion(x) {return x*x})(10);
```

对定义为表达式的函数来说，函数名的写与不写是可选的.函数声明都会声明一个变量，然后把函数对象赋值给这个变量；而函数表达式不声明变量，把新定义的函数赋值给常量还是变量取决于你。为了方便多次使用，最佳办法是使用 `const` 把函数表达式说赋值给常量，防止意外赋值。

### 2.2 箭头函数

```js
const sum = (x, y) => { return x + y; }
```

如果函数体只有 `return` 语句，大括号和 `return` 可以省略。

```js
const sum = (x, y) => x + y;
```

如果函数只有一个参数，包裹参数的小括号可以省略.

```js
const cubic = x => x*x*x;
```

对于没有参数的箭头函数，必须把圆括号写出来。

```js
const constantfunc = x => 666;
```

::: warning
注意：如果函数的返回体是一个 return 语句，但返回的表达式是对象，要简写的话，必须把返回的对象放在一对小括号中。以避免解释器无法判断。

```js{3}
const func1 = x => { return {value: 1} }    // 正确. 返回一个对象

const func2 = x => ({value: 1})             // 正确. 返回一个对象

const func3 = x => { value: 1 }             // 错误. 什么也不返回

const func4 = x => { key: 1, value: 2}      // 错误. 语法错误
```

:::

箭头函数的简洁语法让其在实际开发中非常常用。尤其是在调用 map() , filter() , reduce() 等[数组 Array](./Array)方法时。

```js

```

补充一点，在 React 迭代展示数组时，箭头函数的妙用也可谓家喻户晓。来一个 [React新文档 - 渲染列表](https://beta.reactjs.org/learn#rendering-lists) 的新案例：

```jsx
export default const ShoppingList = () => {
  const products = [
    { title: 'Cabbage', isFruit: false, id: 1 },
    { title: 'Garlic', isFruit: false, id: 2 },
    { title: 'Apple', isFruit: true, id: 3 },
  ];

  return (
    <ul>
      { products.map(product => <li key={product.id}>{ product.title }</li>) }
    </ul>
  );
}
```

箭头函数有两个重要特点：

1. **从定义自己的环境继承 `this` 关键字的值**.而不像其他函数那样定义自己的调用上下文.
2. **没有 `prototype` 属性**. 这意味着箭头函数不能作为新的构造函数（第9.2节，待完善）.

2 的示例代码：
```js
const a = () => 1;
console.log(a.prototype)  // => undefined

function b() {
    return 1
}
console.log(b.prototype) // => {constructor: ƒ}
```

### 2.3 嵌套函数

```js
function hypotenuse(a, b) {
  function square(x) {return x*x; }
  return Math.sqrt(square(a) + square(b))
}
```

未完待续...