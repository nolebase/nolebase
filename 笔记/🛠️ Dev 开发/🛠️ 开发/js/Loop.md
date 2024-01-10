---
title: 循环 Loop
author: 刘俊 Romance
date: 2023-01-27
---

> 《JavaScript 权威指南》  P99

JavaScript 有 5 种循环语句： `while` , `do...while` , `for` , `for/of` （及其变体 `for/await` ） 和 `for/in` 。

接下来分别介绍这 5 种循环。循环的一个常见用途是迭代数组元素，后续 [数组 Array](🛠️%20Dev%20开发/🛠️%20开发/js/Array.md) 有详细介绍数组类的特殊循环方法。

## while

`while` 语句是 `JavaScript` 的基本循环语句，具有以下语法：

```js
while (expression) {
  statement
}
```

当表达式 `statement` 为真值时，解释器会重复执行 `statement` 语句。

以下是一个通过 `while` 循环打印数值 `0` 到 `9` 的例子：

```js
let count = 0;
while (count < 10) {
  console.log(count)
  count++;
}
```

## do...while

`do...while` 循环和 `while` 类似，区别是 表达式语句在循环底部。这意味着循环体至少会执行一次。

```js
do {
  statement
} while (expression);
```

用的较少。`do...while` 必须以分号终止，而 `while` 循环在循环体使用花括号时，无需分号。以下是案例：

```js{7-9}
const printArray = (arr) => {
  let len = arr.length;
  let i = 0;
  if (len === 0 ){
    console.log("Empty Array");
  } else {
    do {
      console.log(a[i])
    } while (++i < len);
  }
}
```

## for

for 语句提供了更方便的循环结构。

```js
for ( initialization ; validation ; increment) {
  statement;
}
```

`initialization` 、 `validation` 和 `increment` 分别负责初始化、校验测试和递增，是循环变量的三个重要操作。对比一下与之等价的 `while` 循环：

```js
initialization;
while (validation) {
  statement;
  increment;
}
```

<br />
和上一节一样，我们可以用 `for` 实现从 `0` 到 `9` 打印数值.

```js
for (let count = 0; count < 10; count ++) {
  console.log(count);
}
```

<br />
在复杂的 `for` 循环中，逗号操作符可以把多个表达式进行组合：

```js
let sum = 0;
for (let i = 0, j = 0; i < 10; i++, j--){
  sum += i * j;
}
```

<br />
更进一步，以下代码使用 `for` 循环遍历了一个链表数据结构，返回列表中最后一个对象（即无 `next` 属性）:

```js
const getTail = () => {
  for (; o.next; o = 0.next) /*空循环体*/  // o.next 为真时做下一步遍历
  return o;
}
```

## for...in

`for...in` 循环的是任意对象。循环变量是对象的属性名称 `key`。

```js{2-4}
let object = {key: value};
for (key in object) {
  statement;
}
```

比如，要打印一个对象的属性 `key` 和值 `value`：

```js
let obj = {a: 1, b:2, c: 3};
for (key in obj) {
  console.log(`对象的键是${ key }，value是${ obj[key] }`)
}
/* =>
对象的键是a，value是1
对象的键是b，value是2
对象的键是c，value是3
*/
```

特别的，数组是一种特殊的对象，而索引 `index` 是数组对象的属性，因此可以用 `for...in` 循环来枚举。

```js
let arr = ['平', '安', '喜', '乐'];
for (index in arr) {
  console.log(`数组中索引${ index }对应的值是${ arr[index] }`);
}
/* =>
数组中索引0对应的值是平
数组中索引1对应的值是安
数组中索引2对应的值是喜
数组中索引3对应的值是乐
*/
```

## for...of

ES6 定义了一种全新的循环语句：`for...of`，专门用于可迭代对象（第12章，待更新）。可迭代对象包含数组、字符串、集合和映射。

下面的例子演示了如何迭代一个数值数组，并计算所有数值之和：

```js
let data = [1, 2, 3, 4, 5];
let sum = 0;
for (let item of data) {
  sum += item;
}
// => sum: 15
```

### for...of 与 字符串

统计字符的出现频率：

```js
let frequency = {};
for (let letter of "mississippi" ) {
  if (frequency[letter]) {
    frequency[letter] ++;
  } else {
    frequency[letter] = 1;
  }
}
// => frequency: {m: 1, i: 4, s: 4, p: 2}
```

### for...of 与 Set & Map

打印 **一遍** 文本字符串中出现过的所有单词：

```js
let text = "Na na na na na na na na Batman!";
let wordSet = new Set(text.split(" "));
let unique = [];
for (let word of wordSet){
  unique.push(word);
}
// => unique: ['Na', 'na', 'Batman!']
```

### for...of 与 对象

```js
let obj = {a: 1, b:2, c: 3};
for (let [key, value] of Object.entries(obj)) {
  console.log(`对象的键是${ key }，value是${ value }`)
}
/* =>
对象的键是a，value是1
对象的键是b，value是2
对象的键是c，value是3
*/
```

另有 Object.keys() , Object.values() 也可以做循环。

### for...of 与 异步迭代: for...await

```js
const printStream = async (stream) => {
  for await (let chunk of stream) {
    console.log(chunk);
  }
}
```
