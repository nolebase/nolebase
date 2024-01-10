---
title: 10 浏览器对象模型
---

## **1. BOM** **概述**

### **1.1** **什么是** **BOM** 

BOM（Browser Object Model）即**浏览器对象模型**，它提供了独立于内容而与浏览器窗口进行交互的对象，其核心对象是 window。

BOM 由一系列相关的对象构成，并且每个对象都提供了很多方法与属性。

BOM 缺乏标准，JavaScript 语法的标准化组织是 ECMA，DOM 的标准化组织是 W3C，BOM 最初是Netscape 浏览器标准的一部分。

**DOM**

- - 文档对象模型 
  - DOM 就是把「文档」当做一个「对象」来看待
  - DOM 的顶级对象是 document
  - DOM 主要学习的是操作页面元素
  - DOM 是 W3C 标准规范

**BOM**

- - 浏览器对象模型
  - 把「浏览器」当做一个「对象」来看待
  - BOM 的顶级对象是 window
  - BOM 学习的是浏览器窗口交互的一些对象
  - BOM 是浏览器厂商在各自浏览器上定义的，兼容性较差

### **1.2 BOM** **的构成**

BOM 比 DOM 更大，它包含 DOM。

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202104/js20210504154406.png)

**window** **对象是浏览器的顶级对象，**它具有双重角色。

1. 它是 JS 访问浏览器窗口的一个接口。
2. 它是一个全局对象。定义在全局作用域中的变量、函数都会变成 window 对象的属性和方法。

在调用的时候可以省略 window，前面学习的对话框都属于 window 对象方法，如 alert()、prompt() 等。

**注意：**window下的一个特殊属性 window.name

## **2. window** **对象的常见事件**

### **2.1** **窗口加载事件** 

```
window.onload = function(){}
或者 
window.addEventListener("load",function(){});
```

window.onload 是窗口 (页面）加载事件,当文档内容完全加载完成会触发该事件(包括图像、脚本文件、CSS 文件等), 就调用的处理函数。

**注意：**

1. 有了 window.onload 就可以把 JS 代码写到页面元素的上方，因为 onload 是等页面内容全部加载完毕，再去执行处理函数。

2. window.onload 传统注册事件方式 只能写一次，如果有多个，会以最后一个 window.onload 为准。

3. 如果使用 addEventListener 则没有限制

```
document.addEventListener('DOMContentLoaded',function(){})
```

DOMContentLoaded 事件触发时，仅当DOM加载完成，不包括样式表，图片，flash等等。

Ie9以上才支持

如果页面的图片很多的话, 从用户访问到onload触发可能需要较长的时间, 交互效果就不能实现，必然影响用户的体验，此时用 DOMContentLoaded 事件比较合适。

### **2.2** **调整窗口大小事件**

```js
 window.onresize = function(){}

 window.addEventListener("resize",function(){});

```

window.onresize 是调整窗口大小加载事件, 当触发时就调用的处理函数。

**注意：**

1. 只要窗口大小发生像素变化，就会触发这个事件。

2. 我们经常利用这个事件完成响应式布局。 window.innerWidth 当前屏幕的宽度



## **3.** **定时器**

### **3.1** **两种定时器**

window 对象给我们提供了 2 个非常好用的方法-定时器。

-  setTimeout() 
-  setInterval()  

### **3.2 setTimeout()** **定时器**

```
 window.setTimeout(调用函数, [延迟的毫秒数]);
```

setTimeout() 方法用于设置一个定时器，该定时器在定时器到期后执行调用函数。

**注意：**

1. window 可以省略。

2. 这个调用函数可以直接写函数，或者写函数名或者采取字符串‘函数名()'三种形式。第三种不推荐

3. 延迟的毫秒数省略默认是 0，如果写，必须是毫秒。

4. 因为定时器可能有很多，所以我们经常给定时器赋值一个标识符。

setTimeout() 这个调用函数我们也称为回调函数 callback

普通函数是按照代码顺序直接调用。

而这个函数，需要等待时间，时间到了才去调用这个函数，因此称为回调函数。

简单理解： 回调，就是回头调用的意思。上一件事干完，再回头再调用这个函数。

以前我们讲的  element.onclick = function(){}  或者 element.addEventListener(“click”, fn);  里面的 函数也是回调函数。

### **3.3** **停止** **setTimeout()** **定时器**

```
 window.clearTimeout(timeoutID)
```

clearTimeout()方法取消了先前通过调用 setTimeout() 建立的定时器。

**注意：**

1. window 可以省略。

2. 里面的参数就是定时器的标识符 。

### **3.4 setInterval()** **定时器**

```
 window.setInterval(回调函数, [间隔的毫秒数]);
```

setInterval() 方法重复调用一个函数，每隔这个时间，就去调用一次回调函数。

**注意：**

1. window 可以省略。

2. 这个调用函数可以直接写函数，或者写函数名或者采取字符串 '函数名()' 三种形式。

3. 间隔的毫秒数省略默认是 0，如果写，必须是毫秒，表示每隔多少毫秒就自动调用这个函数。

4. 因为定时器可能有很多，所以我们经常给定时器赋值一个标识符。

5. 第一次执行也是间隔毫秒数之后执行，之后每隔毫秒数就执行一次。

### **3.5** **停止** **setInterval()** **定时器**

```
 window.clearInterval(intervalID);
```

clearInterval()方法取消了先前通过调用 setInterval()建立的定时器。

**注意：**

1. window 可以省略。

2. 里面的参数就是定时器的标识符 。



**发短信2倒计时**

```html
<body>

phone <input typeof="number">
<button id="btn">发送短信</button>
<script>

    var btn = document.querySelector('button');

    var time = 10;
    var timer = null;
    btn.addEventListener('click', function () {
        btn.disabled = true;
        timer = setInterval(function () {
            if (time == 0) {
                clearInterval(timer)
                btn.disabled = false
                btn.innerHTML = '发送'
                time = 10  
            } else {
                btn.innerHTML = '还剩下' + time + '秒'
                time--
            }
        }, 1000)

    })
</script>
</body>
```



### **3.6 this**

this的指向在函数定义的时候是确定不了的，只有函数执行的时候才能确定this到底指向谁，一般情况下this的最终指向的是那个调用它的对象

现阶段，我们先了解一下几个this指向

1. 全局作用域或者普通函数中this指向全局对象window（**注意定时器里面的this指向window**）

2. 方法调用中谁调用this指向谁

3. 构造函数中this指向构造函数的实例

## **4. JS** **执行机制**

### **4.1 JS** **是单线程**

JavaScript 语言的一大特点就是单线程，也就是说，同一个时间只能做一件事。这是因为 Javascript 这门脚本语言诞生的使命所致——JavaScript 是为处理页面中用户的交互，以及操作 DOM 而诞生的。比如我们对某个 DOM 元素进行添加和删除操作，不能同时进行。 应该先进行添加，之后再删除。

单线程就意味着，所有任务需要排队，前一个任务结束，才会执行后一个任务。这样所导致的问题是： 如果 JS 执行的时间过长，这样就会造成页面的渲染不连贯，导致页面渲染加载阻塞的感觉。

### **4.1** **一个问题**

以下代码执行的结果是什么？

```js
 console.log(1);
 setTimeout(function () {
     console.log(3);
 }, 1000);
 console.log(2);
// 1 2 3 
```

那么以下代码执行的结果又是什么？

```js
 console.log(1);
 setTimeout(function () {
     console.log(3);
 }, 0)
 console.log(2);
```



### **4.2** **同步和异步**

为了解决这个问题，利用多核 CPU 的计算能力，HTML5 提出 Web Worker 标准，允许 JavaScript 脚本创建多个线程。于是，JS 中出现了同步和异步。

**同步**

前一个任务结束后再执行后一个任务，程序的执行顺序与任务的排列顺序是一致的、同步的。比如做饭的同步做法：我们要烧水煮饭，等水开了（10分钟之后），再去切菜，炒菜。

**异步**

你在做一件事情时，因为这件事情会花费很长时间，在做这件事的同时，你还可以去处理其他事情。比如做饭的异步做法，我们在烧水的同时，利用这10分钟，去切菜，炒菜。

**他们的本质区别：** **这条流水线上各个流程的执行顺序不同。**

### **4.3** **同步和异步**

**同步任务**

同步任务都在主线程上执行，形成一个**执行栈。**

**异步任务**

JS 的异步是通过回调函数实现的。

一般而言，异步任务有以下三种类型:

1、普通事件，如 click、resize 等

2、资源加载，如 load、error 等

3、定时器，包括 setInterval、setTimeout 等

异步任务相关回调函数添加到**任务队列**中（任务队列也称为消息队列）。

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202104/js20210504161838.png)

### **4.4 JS** **执行机制**

1. 先执行执行栈中的同步任务。

2. 异步任务（回调函数）放入任务队列中。

3. 一旦执行栈中的所有同步任务执行完毕，系统就会按次序读取任务队列中的异步任务，于是被读取的异步任务结束等待状态，进入执行栈，开始执行。

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202104/js20210504162023.png)

```js
 console.log(1);
 document.onclick = function() {
   console.log('click');
 }
 console.log(2);
 setTimeout(function() {
   console.log(3)
 }, 3000)
```

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202104/js20210504162132.png)

由于主线程不断的重复获得任务、执行任务、再获取任务、再执行，所以这种机制被称为事件循环（ event loop）。

## **5. location** **对象**

### **5.1** **什么是** **location** **对象**

window 对象给我们提供了一个 location 属性用于获取或设置窗体的 URL，并且可以用于解析 URL 。 因为这个属性返回的是一个对象，所以我们将这个属性也称为 location 对象。

### **5.2 URL**

统一资源定位符 (Uniform Resource Locator, URL) 是互联网上标准资源的地址。互联网上的每个文件都有一个唯一的 URL，它包含的信息指出文件的位置以及浏览器应该怎么处理它。

URL 的一般语法格式为：

```js
 protocol://host[:port]/path/[?query]#fragment

 http://www.itcast.cn/index.html?name=andy&age=18#link
```

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202104/js20210504162418.png)

### **5.3 location** **对象的属性**

重点记住： href 和 search

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202104/js20210504162523.png)

### **5.4 location** **对象的方法**

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202104/js20210504162900.png)

## **6. navigator** **对象**

navigator 对象包含有关浏览器的信息，它有很多属性，我们最常用的是 userAgent，该属性可以返回由客户机发送服务器的 user-agent 头部的值。

下面前端代码可以判断用户那个终端打开页面，实现跳转

```js
if((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
    window.location.href = "";     //手机
 } else {
    window.location.href = "";     //电脑
 }
```

## **7. history** **对象**

window 对象给我们提供了一个 history 对象，与浏览器历史记录进行交互。该对象包含用户（在浏览器窗口中）访问过的 URL。

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202104/js20210504163045.png)

history 对象一般在实际开发中比较少用，但是会在一些 OA 办公系统中见到。

