---
title: 14 jquer 事件
---

## **1. jQuery** **事件注册**

**单个事件注册**

**语法：**

```js
element.事件(function(){})       

$(“div”).click(function(){  事件处理程序 })       

```

其他事件和原生基本一致。

比如mouseover、mouseout、blur、focus、change、keydown、keyup、resize、scroll 等

## **2. jQuery** **事件处理**

### **2.1** **事件处理** **on()** **绑定事件**

on() 方法在匹配元素上绑定一个或多个事件的事件处理函数

**语法：**

```js
element.on(events,[selector],fn)       
```

1. events:一个或多个用空格分隔的事件类型，如"click"或"keydown" 。

2. selector: 元素的子元素选择器 。

3. fn:回调函数 即绑定在元素身上的侦听函数。 

**on()** **方法优势**1：

可以绑定多个事件，多个处理事件处理程序。 

```js
 $(“div”).on({
  mouseover: function(){}, 
  mouseout: function(){},
  click: function(){}	
});    
```

如果事件处理程序相同 

```js
 $(“div”).on(“mouseover mouseout”, function() {
   $(this).toggleClass(“current”);
  }); 
```

```js
element.on(events,[selector],fn)    
```

1. events:一个或多个用空格分隔的事件类型，如"click"或"keydown" 。

2. selector: 元素的子元素选择器 。

3. fn:回调函数 即绑定在元素身上的侦听函数。 

**on()** **方法优势**2：

可以事件委派操作 。事件委派的定义就是，把原来加给子元素身上的事件绑定在父元素身上，就是把事件委派给父元素。

```js
$('ul').on('click', 'li', function() {
    alert('hello world!');
});       
```

在此之前有bind(), live() delegate()等方法来处理事件绑定或者事件委派，最新版本的请用on替代他们。z

**on()** **方法优势**:

动态创建的元素，click() 没有办法绑定事件， on() 可以给动态生成的元素绑定事件 

```js
 $(“div").on("click",”p”, function(){
     alert("俺可以给动态生成的元素绑定事件")
 });       
```

```js
 $("div").append($("<p>我是动态创建的p</p>"));
```

### **2.2** **事件处理** **off()** **解绑事件**

off() 方法可以移除通过 on() 方法添加的事件处理程序。

```js
$("p").off() // 解绑p元素所有事件处理程序

$("p").off( "click")  // 解绑p元素上面的点击事件 后面的 foo 是侦听函数名

$("ul").off("click", "li");   // 解绑事件委托
```

如果有的事件只想触发一次， 可以使用 one() 来绑定事件。

### **2.3** **自动触发事件** **trigger()** 

有些事件希望自动触发, 比如轮播图自动播放功能跟点击右侧按钮一致。可以利用定时器自动触发右侧按钮点击事件，不必鼠标点击触发。

```js
element.click()  // 第一种简写形式
```

```js
element.trigger("type") // 第二种自动触发模式
```

```js
$("p").on("click", function () {
  alert("hi~");
}); 

$("p").trigger("click"); // 此时自动触发点击事件，不需要鼠标点击
```

```js
element.triggerHandler(type)  // 第三种自动触发模式
```

triggerHandler模式不会触发元素的默认行为，这是和前面两种的区别。

## **3. jQuery** **事件对象**

事件被触发，就会有事件对象的产生。

```js
element.on(events,[selector],function(event) {})       
```

阻止默认行为：event.preventDefault()  或者 return false 

阻止冒泡： event.stopPropagation()    





## **1. jQuery** **对象拷贝**

如果想要把某个对象拷贝（合并） 给另外一个对象使用，此时可以使用 $.extend() 方法

```js
$.extend([deep], target, object1, [objectN])    
```

1. deep: 如果设为true 为深拷贝， 默认为false 浅拷贝 

2. target: 要拷贝的目标对象

3. object1:待拷贝到第一个对象的对象。

4. objectN:待拷贝到第N个对象的对象。

5. 浅拷贝是把被拷贝的对象复杂数据类型中的地址拷贝给目标对象，修改目标对象会影响被拷贝对象。

6. 深拷贝，前面加true， 完全克隆(拷贝的对象,而不是地址)，修改目标对象不会影响被拷贝对象。

## **2. jQuery** **多库共存**

jQuery使用$作为标示符，随着jQuery的流行,其他 js 库也会用这$作为标识符， 这样一起使用会引起冲突。

需要一个解决方案，让jQuery 和其他的js库不存在冲突，可以同时存在，这就叫做多库共存。

**jQuery** **解决方案：**

1. 把里面的 $ 符号 统一改为 jQuery。 比如 jQuery(''div'')

2. jQuery 变量规定新的名称：$.noConflict()    var xx = $.noConflict();

### **3. jQuery** **插件**

jQuery 功能比较有限，想要更复杂的特效效果，可以借助于 jQuery 插件完成。 

注意: 这些插件也是依赖于jQuery来完成的，所以必须要先引入jQuery文件，因此也称为 jQuery 插件。

**jQuery** **插件常用的网站：**

1. jQuery 插件库 [http://www.jq22.com/](http://www.jq22.com/   )   

2. jQuery 之家  [http://www.htmleaf.com/](http://www.htmleaf.com/  )  

**jQuery** **插件使用步骤：**

1. 引入相关文件。（jQuery 文件 和 插件文件）   

2. 复制相关html、css、js (调用插件)。

**jQuery** **插件演示：**

1. 瀑布流

2. 图片懒加载（图片使用延迟加载在可提高网页下载速度。它也能帮助减轻服务器负载）

 当我们页面滑动到可视区域，再显示图片。

 我们使用jquery 插件库 EasyLazyload。 注意，此时的js引入文件和js调用必须写到 DOM元素（图片）最后面

3. 全屏滚动（fullpage.js）

   gitHub： [https://github.com/alvarotrigo/fullPage.js](https://github.com/alvarotrigo/fullPage.js)

   中文翻译网站： [http://www.dowebok.com/demo/2014/77/](http://www.dowebok.com/demo/2014/77/)

**bootstrap JS** **插件：**

bootstrap 框架也是依赖于 jQuery 开发的，因此里面的 js插件使用 ，也必须引入jQuery 文件。

