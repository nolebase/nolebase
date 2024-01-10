---
title: 本地存储 LocalStorage
author: 刘俊 Romance
---

# 前端 LocalStorage 入门：基本用法、手写 React LocalStorage Hook 及面试题

`localStorage` 是存储在浏览器的一个存储对象。存储的数据将保存在浏览器会话中。是以是键值对 `key：value` 的形式存储。它可以长期保留，即使在页面被关闭，内容也不会被清除。因此我们可以把登陆信息、和用户个性化/偏好、页面配置和相关的一些个性化的信息存储在其中。

## 基础用法：增删改查

### 【增/改】存储数据：setItem

```js
localStorage.setItem("name", "Romance")
// localStorage =>  Storage {name: 'Romance', length: 1}
// or:
localStorage.name = "Ucely"
// localStorage => Storage {name: 'Ucely', length: 1}
```

### 【查单个】读取数据：getItem

```js{2}
localStorage.setItem("name", "Romance")
localStorage.getItem("name")
// => "Romance"

// or
// localStorage.name => "Romance"
```

### 【删单个】删除某个数据：removeItem

```js
localStorage.removeItem("name")
```

### 【删全部】删除全部数据：clear

```js
localStorage.clear()
```

### 【计算数据总数】localStorage存储变量的个数：length

```js
localStorage.length
// 0
localStorage.setItem("name", "Romance")
localStorage.length
// 1
```

### key	读取第i个数据的名字或称为键值(从0开始计数)

```js{2}
localStorage.setItem("name", "Romance")
localStorage.key(0) // 取第一条数据的key

// => "name"
```

### 【查全部】 获取所有存储的数据 valueOf

```js
localStorage.setItem("name", "Romance")
localStorage.valueOf()
// => Storage {name: 'Romance', length: 1}
```

### 【判断】 检查localStorage上是否保存了变量x hasOwnProperty

```js
localStorage.setItem("name", "Romance")
localStorage.hasOwnProperty("name")
// => true
localStorage.hasOwnProperty("age")
// => false
```

### JSON 转换

```js
// 讲JSON转为字符串放在变量里
const student = JSON.stringify(students)
localStorage.setItem("school_name", student)
console.log(localStorage.getItem(school_name))
console.log(JSON.parse(children))
```

## 进阶在 React 中使用 localStorage：hooks 封装

在 React 中，我们也可以使用 localStorage 进行状态的本地化存储。
[stackblitz 存储时间戳的在线案例](https://stackblitz.com/edit/reactlocalstorage)

用法：

```ts
const [storage, setStorage] = useLocalStorage('key', 'value');
```

```tsx
// useLocalStorage.tsx

import { useState, useEffect } from 'react';

interface IValue {
  [propName: string]: string;
}

/**
 * localStorage 持久化数据
 *
 * @param {*} key
 * @param {*} initVal 初始值，支持数组，对象
 * @return {*}
 */
const useLocalStorage = (
  key: string,
  initVal?: string | IValue | any[]
): any => {
  let preStr;
  try {
    let localStr = localStorage.getItem(key);
    if (localStr === undefined) {
      localStr = null; // 避免解析时报错，SyntaxError
    }
    preStr = JSON.parse(localStr as string); // 反序列化
  } catch (error) {
    console.error('useLocalStorage :>> ', error);
  }

  let [value, setValue] = useState(preStr || initVal);

  useEffect(() => {
    localStorage.setItem(String(key), JSON.stringify(value)); // 序列化
  }, [value]);

  return [value, setValue];
};

export default useLocalStorage;
```

## 优缺点分析

### 优点

- localStorage 拓展了 cookie 的 `4KB` 限制
- localStorage 可以将第一次请求的数据直接存储到本地，这个相当于一个 5M 大小的针对于前端页面的数据库，相比于 cookie 可以节约带宽

### 缺点

- 目前所有的浏览器中都会把localStorage的值类型限定为string类型，这个在对我们日常比较常见的JSON对象类型需要一些转换；
- localStorage在浏览器的隐私模式下面是不可读取的；
- localStorage本质上是对字符串的读取，如果存储内容多的话会消耗内存空间，会导致页面变卡；
- localStorage不能被爬虫抓取到；
- localStorage与sessionStorage的唯一一点区别就是localStorage属于永久性存储，而sessionStorage属于当会话结束的时候，sessionStorage中的键值对会被清空；
- localStorage的使用也是遵循同源策略的，所以不同的网站直接是不能共用相同的localStorage


## 相关理论知识/面试题大赏

### 对比 localStorage和sessionStorage

  两者的共同点在于：
  1、存储大小均为5M左右
  2、都有同源策略限制
  3、仅在客户端中保存，不参与和服务器的通信

  两者的不同点在于：
  1、生命周期 —— 数据可以存储多少时间

  - localStorage: 存储的数据是永久性的，除非用户人为删除否则会一直存在。
  - sessionStorage: 与存储数据的脚本所在的标签页的有效期是相同的。一旦窗口或者标签页被关闭，那么所有通过 sessionStorage 存储的数据也会被删除。

  2、作用域 —— 谁拥有数据的访问权

  - localStorage: 在同一个浏览器内，同源文档之间共享 localStorage 数据，可以互相读取、覆盖。
  - sessionStorage: 与 localStorage 一样需要同一浏览器同源文档这一条件。不仅如此，sessionStorage 的作用域还被限定在了窗口中，也就是说，只有同一浏览器、同一窗口的同源文档才能共享数据。
    
    为了更好的理解sessionStorage,我们来看个例子：

    例如你在浏览器中打开了两个相同地址的页面A、B,虽然这两个页面的源完全相同，但是他们还是不能共享数据，因为他们是不同窗口中的。但是如果是一个窗口中，有两个同源的iframe元素的话，这两个iframe的 sessionStorage 是可以互通的。

  ### Cookie

  基本概念
  Cookie是小甜饼的意思，主要有以下特点：
  1、顾名思义，Cookie 确实非常小，它的大小限制为4KB左右
  2、主要用途是保存登录信息和标记用户(比如购物车)等，不过随着localStorage的出现，现在购物车的工作Cookie承担的较少了
  3、一般由服务器生成，可设置失效时间。如果在浏览器端生成Cookie，默认是关闭浏览器后失效
  4、每次都会携带在HTTP头中，如果使用cookie保存过多数据会带来性能问题
  5、原生API不如storage友好，需要自己封装函数

  ### 用法(API)

    服务端向客户端发送的cookie(HTTP头,不带参数)：`Set-Cookie: <cookie-name>=<cookie-value>` (name可选)
    服务端向客户端发送的cookie(HTTP头，带参数)：`Set-Cookie: <cookie-name>=<cookie-value>;` (可选参数1);(可选参数2)
    客户端设置cookie：
    ```js
    document.cookie = "<cookie-name>=<cookie-value>;(可选参数1);(可选参数2)"
    ```

  ### 可选参数：
    `Expires=<date>`：cookie的最长有效时间，若不设置则cookie生命期与会话期相同
    `Max-Age=<non-zero-digit>`：cookie生成后失效的秒数
    `Domain=<domain-value>`：指定cookie可以送达的主机域名，若一级域名设置了则二级域名也能获取。
    `Path=<path-value>`：指定一个URL，例如指定path=/docs，则”/docs”、”/docs/Web/“、”/docs/Web/Http”均满足匹配条件
    Secure：必须在请求使用SSL或HTTPS协议的时候cookie才回被发送到服务器
    HttpOnly：客户端无法更改Cookie，客户端设置cookie时不能使用这个参数，一般是服务器端使用

  示例：
  ```js
  Set-Cookie: sessionid=aes7a8; HttpOnly; Path=/
  document.cookie = "KMKNKK=1234;Sercure"
  ```

  可选前缀：__Secure-：以__Secure-为前缀的cookie，必须与secure属性一同设置，同时必须应用于安全页面（即使用HTTPS）
  __Host-：以__Host-为前缀的cookie，必须与secure属性一同设置，同时必须应用于安全页面（即使用HTTPS）。必须不能设置domian属性（这样可以防止二级域名获取一级域名的cookie），path属性的值必须为”/“。
  前缀使用示例：
  ```js
  Set-Cookie: __Secure-ID=123; Secure; Domain=example.com
  Set-Cookie: __Host-ID=123; Secure; Path=/
  ```

  ```js
  document.cookie = "__Secure-KMKNKK=1234;Sercure"
  document.cookie = "__Host-KMKNKK=1234;Sercure;path=/"
  ```

 ### Session

  基本概念

  - Session是在无状态的HTTP协议下，服务端记录用户状态时用于标识具体用户的机制。它是在服务端保存的用来跟踪用户的状态的数据结构，可以保存在文件、数据库或者集群中。
  - 在浏览器关闭后这次的Session就消失了，下次打开就不再拥有这个Session。其实并不是Session消失了，而是Session ID变了，服务器端可能还是存着你上次的Session ID及其Session 信息，只是他们是无主状态，也许一段时间后会被删除。
  - 大多数的应用都是用Cookie来实现Session跟踪的，第一次创建Session的时候，服务端会在HTTP协议中告诉客户端，需要在Cookie里面记录一个SessionID，以后每次请求把这个会话ID发送到服务器

  与Cookie的关系与区别：

  1. Session是在服务端保存的一个数据结构，用来跟踪用户的状态，这个数据可以保存在集群、数据库、文件中，Cookie是客户端保存用户信息的一种机制，用来记录用户的一些信息，也是实现Session的一种方式。
  2. Cookie的安全性一般，他人可通过分析存放在本地的Cookie并进行Cookie欺骗。在安全性第一的前提下，选择Session更优。重要交互信息比如权限等就要放在Session中，一般的信息记录放Cookie就好了。
  3. 单个Cookie保存的数据不能超过4K，很多浏览器都限制一个站点最多保存20个Cookie。
  4. 当访问增多时，Session会较大地占用服务器的性能。考虑到减轻服务器性能方面，应当适时使用Cookie。
  5. Session的运行依赖Session ID，而Session ID是存在 Cookie 中的。也就是说，如果浏览器禁用了Cookie,Session也会失效（但是可以通过其它方式实现，比如在url中传递Session ID,即sid=xxxx）。

## 参考文献

> 杨西瓜：[html5的localStorage之【增、删、改、查】](https://blog.csdn.net/qq_33862644/article/details/78689577)
> 
> samwangdd： [React Hooks -- useLocalStorage](https://juejin.cn/post/7023013168951590919)
>
> MuffinFish34765：[细说localStorage, sessionStorage, Cookie, Session](https://juejin.cn/post/6844903587764502536)