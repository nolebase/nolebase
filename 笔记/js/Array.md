---
title: 数组 Array
author: 刘俊 Romance
---

## 数组迭代器方法

> 《JavaScript 权威指南》 P152

### forEach()

`forEach()` 方法在调用函数时，会给它传 3 个参数：数组元素的值、数组元素的索引和数组本身。

```js
let data = [1, 2, 3, 4, 5];

data.forEach((value, index, array) => {
  // value: 1 index: 0 array: [1, 2, 3, 4, 5]
  a[i] = v + 1
})
// data: [2, 3, 4, 5, 6]
```

如果只关心数组元素的值，可以把函数写成只接收一个参数：

```js
let data = [1, 2, 3, 4, 5], sum = 0;

data.forEach(value => { sum += value })
// sum: 15
```

forEach() 没有 `break`，不能提前终止迭代。

### map()

`map()` 方法把调用它的数组的每个元素分别传给回调函数，并依次返回回调函数的返回值，将返回值构成数组。

`map()` 返回一个新数组，不改变调用它的数组，且和长度相同，不改变数组的稀疏程度。

例如：

```js
let a = [1, 2, 3];

let b = a.map(x => x*x)
// => [1, 4, 9] 这个函数接收 x， 返回 x 的平方
```

`map()` 和 `forEach()` 函数被调用的方式相同，但 `map()` 函数应该有返回值。

### filter() - 筛选

`filter()` 方法的回调函数是一个断言函数（返回 `true` 或 `false`）。这个函数如同 `map()` 和 `forEach()` 一样被调用。如果函数返回 `true` （或返回值等价于 `true`），那么传给这个函数的元素是最终返回元素的成员。
`filter()` 的回调函数的第一个参数是值，第二个参数是索引。

```js
let data = [5, 4, 3, 2, 1]

let below3 = data.filter(value => value < 3 )
// => below3: [2, 1] 筛选出小于 3 的值

let evenArr = data.filter((_, index) => index % 2 === 0)
// => evenArr: [ 5, 3, 1 ] 筛选出索引是偶数的值
```

### find() / findIndex() - 查找

`find()` 和 `findIndex()` 的回调函数是断言函数，他们会在断言函数找到第一个元素时停止迭代，与此同时 `find()` 返回匹配元素的值， `findIndex()` 返回匹配元素的索引。

如果没有找到匹配元素， `find()` 返回 `undefined`， `findIndex()` 返回 `-1`。

```js
let data = [1, 2, 3, 4, 5]

let result1 = data.findIndex(x => x === 3) // => 3      值的索引值是 2
let result2 = data.findIndex(x => x < 0) //  => -1      未找到，因此返回 -1

let result3 = data.find(x => x % 3 === 0) // => 3       3 的倍数
let result4 = data.find(x => x % 6 === 0) // => undefined   6 的倍数
```

### reduce() - 归并/注入

```js
array.reduce(
  (accumulatedValue, currentValue, index, array) => expression, startValue)
```

`reduce()` 接收两个参数，第一个参数是回调函数，任务是把两个值归并成一个值并返回。第二个参数 `startValue` 是传给归并函数的初始值。

而回调函数的第一个参数 accumulatedValue 是到目前为止归并函数的返回结果，第一次调用时，把 `startValue` ，即 `reduce()` 的第二个参数传入。
第二到四个参数依次是值、索引和数组。

```js
let data = [1, 2, 3, 4, 5]
let sum = data.reduce((acc, value) => acc + value, 0)      // => 15   所有值之和
let product = data.reduce((acc, value) => acc * value, 1)  // => 120  所有值之积
let max = data.reduce((acc, value) => acc > value)         // => 5    最大值
```

`reduce()` 的第二个参数 `startValue` 可以省略。reduce() 会使用数组的第一个元素作为初始值，但当数组是空数组时，会报 `TypeError` 错误。

补充：`reduceRight()` 和 `reduce()` 类似，是从高索引想低索引、从右向左遍历数组。

## 数组和字符串间转换

### 数组 => 字符串

`join()` 方法可以把数组的所有元素转换为字符串，并且可以指定一个可选的字符串参数，用于分割结果字符串中的元素。不指定默认用逗号 `,`。

```js
let data = [1, 2, 3]
let str1 = data.join()       // => "1,2,3"
let str2 = data.join(" ")    // => "1 2 3"
let str3 = data.join("")     // => "123"
```

`toString()` 方法可以把数组转为字符串。输出中不包含方括号或者数组值的定界符。

```js
let str1 = [1, 2, 3].toString()         // => "1,2,3"
let str2 = ["a", "b", "c"].join(" ")    // => "a,b,c"
let str3 = [1, [2, "c"].join("")        // => "1,2,c"
```

### 字符串 => 数组

`String.split()` 这部分在字符串中介绍，[链接](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/split)
