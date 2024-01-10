---
title: 异步 Asynchronization
author: Ilya Kantor, 刘俊 Romance Meggy, etc.
---

## Promise 期约

Promise 是一个对象，表示异步操作的结果。它是一种为简化异步编程而设计的核心语言特征。

Promise 对象的构造器（constructor）语法如下：

```js
let promise = new Promise((resolve, reject) => {
  executor()
});
```

它的参数 `resolve` 和 `reject` 是由 `JavaScript` 自身提供的回调。我们的代码仅在 `executor` 的内部。

当 `executor()` 获得了结果，无论是早还是晚都没关系，它应该调用以下回调之一：

- resolve(value) —— 如果任务成功完成并带有结果 value。
- reject(error) —— 如果出现了 error，error 即为 error 对象。

由 `new Promise` 构造器返回的 promise 对象具有以下内部属性：

- state —— 最初是 `pending` ，然后在 `resolve` 被调用时变为 `fulfilled` ，或者在 `reject` 被调用时变为 `rejected`。
- result —— 最初是 `undefined` ，然后在 `resolve(value)` 被调用时变为 `value`，或者在 `reject(error)` 被调用时变为 `error`。

所以，executor 最终将 promise 移至以下状态之一：

<object type="image/svg+xml" data="https://zh.javascript.info/article/promise-basics/promise-resolve-reject.svg" class="image__image" data-use-theme="" width="512" height="246">
    <img src="https://zh.javascript.info/article/promise-basics/promise-resolve-reject.svg" alt="" width="512" height="246">
</object>

下面是一个 Promise 和 executor() ，该 executor() 具有包含时间（即 setTimeout）的“生产者代码”。这是一个成功完成任务的例子，一个“成功实现了的诺言”。

```js
let promise = new Promise(function(resolve, reject) {
  // 当 promise 被构造完成时，自动执行此函数

  // 1 秒后发出工作已经被完成的信号，并带有结果 "done"
  setTimeout(() => resolve("done"), 1000);
});
```

下面则是一个 executor 以 error 拒绝 promise 的示例：

```js
let promise = new Promise(function(resolve, reject) {
  // 1 秒后发出工作已经被完成的信号，并带有 error
  setTimeout(() => reject(new Error("Whoops!")), 1000);
});
```

**注意⚠️**

executor() 只能调用一个 resolve 或一个 reject。任何状态的更改都是最终的。所有其他的再对 resolve 和 reject 的调用都会被 **忽略** ：

```js
let promise = new Promise(function(resolve, reject) {
  resolve("done");

  reject(new Error("…")); // 被忽略
  setTimeout(() => resolve("…")); // 被忽略
});
```

一个被 executor 完成的工作只能有一个结果或一个 error。并且，resolve/reject 只需要一个参数（或不包含任何参数）。

### 消费者：then，catch

### then()

最重要最基础的一个就是 .then。

```js
promise.then(
  function(result) { /* handle a successful result */ },
  function(error) { /* handle an error */ }
);
```



## 例子

现在我们假设有一个 `getJSON()` 的函数，它能发送HTTP请求，并把HTTP响应体解析成JSON格式并返回一个 `Promise` 期约。我们先来看看怎么使用这个返回期约的辅助函数：

```js
getJSON("/api/user/profile").then(displayUserProfile).catch(handleProfileError);
```

对于一个承诺（Promise），人类会说承诺得到“信守”或“背弃”。而在 JavaScript 中，对应的术语是 `fullfill` （兑现）和 `reject` （拒绝）。分别表示调用成功或失败的情形。如果 Promise 既未兑现也未被拒绝，那他就是

