---
title: 11 pc网页特效
---

## 1. 元素偏移量 offset 系列

### **1.1 offset** **概述** 

offset 翻译过来就是偏移量， 我们使用 offset 系列相关属性可以动态的得到该元素的位置（偏移）、大小等。

-  获得元素距离带有定位父元素的位置
-  获得元素自身的大小（宽度高度）
- 注意： 返回的数值都不带单位

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202104/webapi20210505174504.png)

### **1.2 offset** **与** **style** **区别** 

**offset**

- - offset 可以得到任意样式表中的样式值
  - offset 系列获得的数值是没有单位的
  - offsetWidth 包含padding+border+width
  - offsetWidth 等属性是只读属性，只能获取不能赋值
  - 所以，我们想要获取元素大小位置，用offset更合适

**style**

- - style 只能得到行内样式表中的样式值
  - style.width 获得的是带有单位的字符串
  - style.width 获得不包含padding和border 的值
  - style.width 是可读写属性，可以获取也可以赋值
  - 所以，我们想要给元素更改值，则需要用style改变

**案例：获取鼠标在盒子内的坐标**

1. 1. 我们在盒子内点击，想要得到鼠标距离盒子左右的距离。
   2. 首先得到鼠标在页面中的坐标（e.pageX, e.pageY）
   3. 其次得到盒子在页面中的距离 ( box.offsetLeft, box.offsetTop)
   4. 用鼠标距离页面的坐标减去盒子在页面中的距离，得到 鼠标在盒子内的坐标
   5. 如果想要移动一下鼠标，就要获取最新的坐标，使用鼠标移动事件 mousemove

```html
<style>

    .box {
        width: 200px;
        height: 200px;
        background-color: pink;
        margin-top: 200px;
        margin-left: 200px;
    }

</style>
<body>


    <div class="box"></div>
    <script>
        const box = document.querySelector('.box')
        box.addEventListener('mousemove',function (e) {
            var x =e.pageX;
            var  y = e.pageY;

            var x1 = e.pageX - this.offsetLeft;
            var y1 = y - this.offsetTop;
            this.innerHTML = 'x:'+x1+" y"+y1;
        })
    </script>
</body>
```

**案例：模态框拖拽**

弹出框，我们也称为模态框。

1. 点击弹出层， 会弹出模态框， 并且显示灰色半透明的遮挡层。
2. 点击关闭按钮，可以关闭模态框，并且同时关闭灰色半透明遮挡层。
3. 鼠标放到模态框最上面一行，可以按住鼠标拖拽模态框在页面中移动。
4. 鼠标松开，可以停止拖动模态框移动。



1. 1. 点击弹出层， 模态框和遮挡层就会显示出来 display:block;
   2. 点击关闭按钮，模态框和遮挡层就会隐藏起来 display:none;
   3. 在页面中拖拽的原理： 鼠标按下并且移动， 之后松开鼠标
   4. 触发事件是鼠标按下 mousedown， 鼠标移动mousemove 鼠标松开 mouseup
   5. 拖拽过程: 鼠标移动过程中，获得最新的值赋值给模态框的left和top值， 这样模态框可以跟着鼠标走了
   6. 鼠标按下触发的事件源是 最上面一行，就是 id 为 title 
   7. 鼠标的坐标 减去 鼠标在盒子内的坐标， 才是模态框真正的位置。
   8. 鼠标按下，我们要得到鼠标在盒子的坐标。
   9. 鼠标移动，就让模态框的坐标 设置为 ： 鼠标坐标 减去盒子坐标即可，注意移动事件写到按下事件里面。
   10. 鼠标松开，就停止拖拽，就是可以让鼠标移动事件解除  

**放大镜**

1. 1. 整个案例可以分为三个功能模块
   2. 鼠标经过小图片盒子， 黄色的遮挡层 和 大图片盒子显示，离开隐藏2个盒子功能
   3. 黄色的遮挡层跟随鼠标功能。 
   4. 移动黄色遮挡层，大图片跟随移动功能。

1. 1. **黄色的遮挡层跟随鼠标功能。**
   2. **把鼠标坐标给遮挡层不合适。因为遮挡层坐标以父盒子为准。**
   3. 首先是获得鼠标在盒子的坐标。 
   4. 之后把数值给遮挡层做为left 和top值。
   5. 此时用到鼠标移动事件，但是还是在小图片盒子内移动。
   6. 发现，遮挡层位置不对，需要再减去盒子自身高度和宽度的一半。
   7. 遮挡层不能超出小图片盒子范围。
   8. 如果小于零，就把坐标设置为0
   9. 如果大于遮挡层最大的移动距离，就把坐标设置为最大的移动距离
   10. 遮挡层的最大移动距离： 小图片盒子宽度 减去 遮挡层盒子宽度



![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202104/webapi20210505174659.png)

## **2.** **元素可视区** **client** **系列**

client 翻译过来就是客户端，我们使用 client 系列的相关属性来获取元素可视区的相关信息。通过 client 系列的相关属性可以动态的得到该元素的边框大小、元素大小等。

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202104/js20210505174820.png)

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202104/js20210506192713.png)

**淘宝** **flexible.js** **源码分析**

立即执行函数 (function() {})() 或者 (function(){}())

主要作用： 创建一个独立的作用域。 避免了命名冲突问题 

```js
    (function (a,b) {
        console.log(a,b)
    })(1,2);



    (function (a,b){
        console.log(a,b)
    }(1,2))
```

下面三种情况都会刷新页面都会触发 load 事件。

1. a标签的超链接
2. F5或者刷新按钮（强制刷新）
3. 前进后退按钮

但是 火狐中，有个特点，有个“往返缓存”，这个缓存中不仅保存着页面数据，还保存了DOM和JavaScript的状态；实际上是将整个页面都保存在了内存里。

所以此时后退按钮不能刷新页面。

此时可以使用 pageshow事件来触发。，这个事件在页面显示时触发，无论页面是否来自缓存。在重新加载页面中，pageshow会在load事件触发后触发；根据事件对象中的persisted来判断是否是缓存中的页面触发的pageshow事件，注意这个事件给window添加。

```js
(function flexible(window, document) {
    // 获取的html的根元素
    var docEl = document.documentElement
    // drp物理像素比
    var dpr = window.devicePixelRatio || 1

    // adjust body font size
    // 设置body的字体daxiao
    function setBodyFontSize() {
        if (document.body) {
            document.body.style.fontSize = (12 * dpr) + 'px'
        } else {
            document.addEventListener('DOMContentLoaded', setBodyFontSize)
        }
    }
    setBodyFontSize();

    // set 1rem = viewWidth / 10   设置html的字体大小
    function setRemUnit() {
        var rem = docEl.clientWidth / 10
        docEl.style.fontSize = rem + 'px'
    }

    setRemUnit()

    // reset rem unit on page resize  页面尺寸发生变化，重新设置rem的大小
    window.addEventListener('resize', setRemUnit)
    // pageshow 重新加载事件
    window.addEventListener('pageshow', function(e) {
        if (e.persisted) {
            setRemUnit()
        }
    })

    // detect 0.5px supports  有些移动端的浏览器不支持0.5像素的写法
    if (dpr >= 2) {
        var fakeBody = document.createElement('body')
        var testElement = document.createElement('div')
        testElement.style.border = '.5px solid transparent'
        fakeBody.appendChild(testElement)
        docEl.appendChild(fakeBody)
        if (testElement.offsetHeight === 1) {
            docEl.classList.add('hairlines')
        }
        docEl.removeChild(fakeBody)
    }
}(window, document))
```



## **3.** **元素滚动** **scroll** **系列**

### **3.1** **元素** **scroll** **系列属性**

scroll 翻译过来就是滚动的，我们使用 scroll 系列的相关属性可以动态的得到该元素的大小、滚动距离等。

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202104/js20210506192819.png)

### **3.2** **页面被卷去的头部**

如果浏览器的高（或宽）度不足以显示整个页面时，会自动出现滚动条。当滚动条向下滚动时，页面上面被隐藏掉的高度，我们就称为页面被卷去的头部。滚动条在滚动时会触发 onscroll 事件。

### **3.3** **页面被卷去的头部兼容性解决方案**

需要注意的是，页面被卷去的头部，有兼容性问题，因此被卷去的头部通常有如下几种写法：

1. 声明了 DTD，使用 document.documentElement.scrollTop

2. 未声明 DTD，使用 document.body.scrollTop

3. 新方法 window.pageYOffset 和 window.pageXOffset，IE9 开始支持

```js
 function getScroll() {
    return {
      left: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft||0,
      top: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    };
 } 
使用的时候  getScroll().left
```

**仿淘宝固定右侧侧边栏**

1. 1. 需要用到页面滚动事件 scroll 因为是页面滚动，所以事件源是 document
   2. 滚动到某个位置，就是判断页面被卷去的上部值。
   3. 页面被卷去的头部：可以通过window.pageYOffset 获得 如果是被卷去的左侧 window.pageXOffset
   4. 注意，元素被卷去的头部是 element.scrollTop , 如果是页面被卷去的头部 则是 window.pageYOffset
   5. 其实这个值 可以通过盒子的 offsetTop 可以得到，如果大于等于这个值，就可以让盒子固定定位了

```html
   <style>
        .slider-bar {
            position: absolute;
            left: 50%;
            top: 300px;
            margin-left: 600px;
            width: 45px;
            height: 130px;
            background-color: pink;
        }

        .w {
            width: 1200px;
            margin: 10px auto;
        }

        .header {
            height: 150px;
            background-color: purple;
        }

        .banner {
            height: 250px;
            background-color: skyblue;
        }

        .main {
            height: 1000px;
            background-color: yellowgreen;
        }

        span {
            display: none;
            position: absolute;
            bottom: 0;
        }
    </style>
</head>

<body>
<div class="slider-bar">
    <span class="goBack">返回顶部</span>
</div>
<div class="header w">头部区域</div>
<div class="banner w">banner区域</div>
<div class="main w">主体部分</div>
<script>
    //1. 获取元素
    var sliderbar = document.querySelector('.slider-bar');
    var banner = document.querySelector('.banner');
    // banner.offestTop 就是被卷去头部的大小 一定要写到滚动的外面
    var bannerTop = banner.offsetTop
    // 当我们侧边栏固定定位之后应该变化的数值
    var sliderbarTop = sliderbar.offsetTop - bannerTop;
    // 获取main 主体元素
    var main = document.querySelector('.main');
    var goBack = document.querySelector('.goBack');
    var mainTop = main.offsetTop;
    // 2. 页面滚动事件 scroll
    document.addEventListener('scroll', function() {
        // console.log(11);
        // window.pageYOffset 页面被卷去的头部
        // console.log(window.pageYOffset);
        // 3 .当我们页面被卷去的头部大于等于了 172 此时 侧边栏就要改为固定定位
        if (window.pageYOffset >= bannerTop) {
            sliderbar.style.position = 'fixed';
            sliderbar.style.top = sliderbarTop + 'px';
        } else {
            sliderbar.style.position = 'absolute';
            sliderbar.style.top = '300px';
        }
        // 4. 当我们页面滚动到main盒子，就显示 goback模块
        if (window.pageYOffset >= mainTop) {
            goBack.style.display = 'block';
        } else {
            goBack.style.display = 'none';
        }

    })
</script>
</body>
```





## **三大系列总结**

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202104/js20210506193024.png)

他们主要用法：

1. offset系列 经常用于获得元素位置  offsetLeft offsetTop
2. client 经常用于获取元素大小 clientWidth clientHeight
3. scroll 经常用于获取滚动距离 scrollTop scrollLeft  
4. 注意页面滚动的距离通过 window.pageXOffset 获得

## **mouseenter** **和**mouseover **的区别**

**mouseenter** **鼠标事件**

- 当鼠标移动到元素上时就会触发 mouseenter 事件
-  类似 mouseover，它们两者之间的差别是
-  mouseover 鼠标经过自身盒子会触发，经过子盒子还会触发。 mouseenter 只会经过自身盒子触发
- 之所以这样，就是因为mouseenter不会冒泡
- 跟mouseenter搭配 鼠标离开 mouseleave 同样不会冒泡

## **4.** **动画函数封装**

### **4.1** **动画实现原理** 

**核心原理** ：通过定时器 setInterval() 不断移动盒子位置。

实现步骤：

1. 获得盒子当前位置

2. 让盒子在当前位置加上1个移动距离

3. 利用定时器不断重复这个操作

4. 加一个结束定时器的条件

5. 注意此元素需要添加定位，才能使用element.style.left

### **4.2** **动画函数简单封装** 

注意函数需要传递2个参数，动画对象和移动到的距离。

### **4.3** **动画函数给不同元素记录不同定时器** 

如果多个元素都使用这个动画函数，每次都要var 声明定时器。我们可以给不同的元素使用不同的定时器（自己专门用自己的定时器）。

核心原理：利用 JS 是一门动态语言，可以很方便的给当前对象添加属性。

```html
    <style>
        div {
            position: absolute;
            left: 0;
            width: 100px;
            height: 100px;
            background-color: pink;
        }
        
        span {
            position: absolute;
            left: 0;
            top: 200px;
            display: block;
            width: 150px;
            height: 150px;
            background-color: purple;
        }
    </style>
</head>

<body>
    <button>点击夏雨荷才走</button>
    <div></div>
    <span>夏雨荷</span>
    <script>
        // var obj = {};
        // obj.name = 'andy';
        // 简单动画函数封装obj目标对象 target 目标位置
        // 给不同的元素指定了不同的定时器
        function animate(obj, target) {
            // 当我们不断的点击按钮，这个元素的速度会越来越快，因为开启了太多的定时器
            // 解决方案就是 让我们元素只有一个定时器执行
            // 先清除以前的定时器，只保留当前的一个定时器执行
            clearInterval(obj.timer);
            obj.timer = setInterval(function() {
                if (obj.offsetLeft >= target) {
                    // 停止动画 本质是停止定时器
                    clearInterval(obj.timer);
                }
                obj.style.left = obj.offsetLeft + 1 + 'px';

            }, 30);
        }

        var div = document.querySelector('div');
        var span = document.querySelector('span');
        var btn = document.querySelector('button');
        // 调用函数
        animate(div, 300);
        btn.addEventListener('click', function() {
            animate(span, 200);
        })
    </script>
</body>
```



### **4.4** **缓动效果原理** 

缓动动画就是让元素运动速度有所变化，最常见的是让速度慢慢停下来

思路：

1. 让盒子每次移动的距离慢慢变小，速度就会慢慢落下来。

1. 核心算法： (目标值 - 现在的位置 )  /  10  做为每次移动的距离 步长
2. 停止的条件是： 让当前盒子位置等于目标位置就停止定时器  
3. 注意步长值需要取整  

```js
<body>
    <button>点击夏雨荷才走</button>
    <span>夏雨荷</span>
    <script>
        // 缓动动画函数封装obj目标对象 target 目标位置
        // 思路：
        // 1. 让盒子每次移动的距离慢慢变小， 速度就会慢慢落下来。
        // 2. 核心算法：(目标值 - 现在的位置) / 10 做为每次移动的距离 步长
        // 3. 停止的条件是： 让当前盒子位置等于目标位置就停止定时器
        function animate(obj, target) {
            // 先清除以前的定时器，只保留当前的一个定时器执行
            clearInterval(obj.timer);
            obj.timer = setInterval(function() {
                // 步长值写到定时器的里面
                var step = (target - obj.offsetLeft) / 10;
                if (obj.offsetLeft == target) {
                    // 停止动画 本质是停止定时器
                    clearInterval(obj.timer);
                }
                // 把每次加1 这个步长值改为一个慢慢变小的值  步长公式：(目标值 - 现在的位置) / 10
                obj.style.left = obj.offsetLeft + step + 'px';

            }, 15);
        }
        var span = document.querySelector('span');
        var btn = document.querySelector('button');

        btn.addEventListener('click', function() {
                // 调用函数
                animate(span, 500);
            })
            // 匀速动画 就是 盒子是当前的位置 +  固定的值 10 
            // 缓动动画就是  盒子当前的位置 + 变化的值(目标值 - 现在的位置) / 10）
    </script>
</body>
```



### **4.5** **动画函数多个目标值之间移动** 

可以让动画函数从 800 移动到 500。

当我们点击按钮时候，判断步长是正值还是负值

1. 如果是正值，则步长 往大了取整
2. 如果是负值，则步长 向小了取整

```html
<body>
    <button class="btn500">点击夏雨荷到500</button>
    <button class="btn800">点击夏雨荷到800</button>
    <span>夏雨荷</span>
    <script>
        // 缓动动画函数封装obj目标对象 target 目标位置
        // 思路：
        // 1. 让盒子每次移动的距离慢慢变小， 速度就会慢慢落下来。
        // 2. 核心算法：(目标值 - 现在的位置) / 10 做为每次移动的距离 步长
        // 3. 停止的条件是： 让当前盒子位置等于目标位置就停止定时器
        function animate(obj, target) {
            // 先清除以前的定时器，只保留当前的一个定时器执行
            clearInterval(obj.timer);
            obj.timer = setInterval(function() {
                // 步长值写到定时器的里面
                // 把我们步长值改为整数 不要出现小数的问题
                // var step = Math.ceil((target - obj.offsetLeft) / 10);
                var step = (target - obj.offsetLeft) / 10;
                step = step > 0 ? Math.ceil(step) : Math.floor(step);
                if (obj.offsetLeft == target) {
                    // 停止动画 本质是停止定时器
                    clearInterval(obj.timer);
                }
                // 把每次加1 这个步长值改为一个慢慢变小的值  步长公式：(目标值 - 现在的位置) / 10
                obj.style.left = obj.offsetLeft + step + 'px';

            }, 15);
        }
        var span = document.querySelector('span');
        var btn500 = document.querySelector('.btn500');
        var btn800 = document.querySelector('.btn800');

        btn500.addEventListener('click', function() {
            // 调用函数
            animate(span, 500);
        })
        btn800.addEventListener('click', function() {
                // 调用函数
                animate(span, 800);
            })
            // 匀速动画 就是 盒子是当前的位置 +  固定的值 10 
            // 缓动动画就是  盒子当前的位置 + 变化的值(目标值 - 现在的位置) / 10）
    </script>
</body>
```



### **4.6** **动画函数添加回调函数** 

**回调函数原理**：函数可以作为一个参数。将这个函数作为参数传到另一个函数里面，当那个函数执行完之后，再执行传进去的这个函数，这个过程就叫做回调。

回调函数写的位置：定时器结束的位置。

```html

<body>
  <button class="btn500">点击夏雨荷到500</button>
  <button class="btn800">点击夏雨荷到800</button>
  <span>夏雨荷</span>
  <script>
    // 缓动动画函数封装obj目标对象 target 目标位置
    // 思路：
    // 1. 让盒子每次移动的距离慢慢变小， 速度就会慢慢落下来。
    // 2. 核心算法：(目标值 - 现在的位置) / 10 做为每次移动的距离 步长
    // 3. 停止的条件是： 让当前盒子位置等于目标位置就停止定时器
    function animate(obj, target, callback) {
      // console.log(callback);  callback = function() {}  调用的时候 callback()

      // 先清除以前的定时器，只保留当前的一个定时器执行
      clearInterval(obj.timer);
      obj.timer = setInterval(function() {
        // 步长值写到定时器的里面
        // 把我们步长值改为整数 不要出现小数的问题
        // var step = Math.ceil((target - obj.offsetLeft) / 10);
        var step = (target - obj.offsetLeft) / 10;
        step = step > 0 ? Math.ceil(step) : Math.floor(step);
        if (obj.offsetLeft == target) {
          // 停止动画 本质是停止定时器
          clearInterval(obj.timer);
          // 回调函数写到定时器结束里面
          if (callback) {
            // 调用函数
            callback();
          }
        }
        // 把每次加1 这个步长值改为一个慢慢变小的值  步长公式：(目标值 - 现在的位置) / 10
        obj.style.left = obj.offsetLeft + step + 'px';

      }, 15);
    }
    var span = document.querySelector('span');
    var btn500 = document.querySelector('.btn500');
    var btn800 = document.querySelector('.btn800');

    btn500.addEventListener('click', function() {
      // 调用函数
      animate(span, 500);
    })
    btn800.addEventListener('click', function() {
      // 调用函数
      animate(span, 800, function() {
        // alert('你好吗');
        span.style.backgroundColor = 'red';
      });
    })
    // 匀速动画 就是 盒子是当前的位置 +  固定的值 10 
    // 缓动动画就是  盒子当前的位置 + 变化的值(目标值 - 现在的位置) / 10）
  </script>
</body>
```



### **4.7** **动画函数封装到单独****JS****文件里面**

因为以后经常使用这个动画函数，可以单独封装到一个JS文件里面，使用的时候引用这个JS文件即可。

1. 单独新建一个JS文件。
2. HTML文件引入 JS 文件。

### **5.** **常见网页特效案例**

**网页轮播图**

轮播图也称为焦点图，是网页中比较常见的网页特效。

功能需求：

1. 鼠标经过轮播图模块，左右按钮显示，离开隐藏左右按钮。
2. 点击右侧按钮一次，图片往左播放一张，以此类推， 左侧按钮同理。
3. 图片播放的同时，下面小圆圈模块跟随一起变化。
4. 点击小圆圈，可以播放相应图片。
5. 鼠标不经过轮播图， 轮播图也会自动播放图片。
6. 鼠标经过，轮播图模块， 自动播放停止。

**返回顶部**

滚动窗口至文档中的特定位置。

window.scroll(x, y) 

注意，里面的x和y 不跟单位，直接写数字

```js
goBack.addEventListener('click', function() {
  // 里面的x和y 不跟单位的 直接写数字即可
  // window.scroll(0, 0);
  // 因为是窗口滚动 所以对象是window
  animate(window, 0);
});

// 动画函数
function animate(obj, target, callback) {
  // console.log(callback);  callback = function() {}  调用的时候 callback()

  // 先清除以前的定时器，只保留当前的一个定时器执行
  clearInterval(obj.timer);
  obj.timer = setInterval(function() {
    // 步长值写到定时器的里面
    // 把我们步长值改为整数 不要出现小数的问题
    // var step = Math.ceil((target - obj.offsetLeft) / 10);
    var step = (target - window.pageYOffset) / 10;
    step = step > 0 ? Math.ceil(step) : Math.floor(step);
    if (window.pageYOffset == target) {
      // 停止动画 本质是停止定时器
      clearInterval(obj.timer);
      // 回调函数写到定时器结束里面
      // if (callback) {
      //     // 调用函数
      //     callback();
      // }
      callback && callback();
    }
    // 把每次加1 这个步长值改为一个慢慢变小的值  步长公式：(目标值 - 现在的位置) / 10
    // obj.style.left = window.pageYOffset + step + 'px';
    window.scroll(0, window.pageYOffset + step);
  }, 15);
}
```

**筋头云案例**

鼠标经过某个小li， 筋斗云跟这到当前小li位置

鼠标离开这个小li， 筋斗云复原为原来的位置

鼠标点击了某个小li， 筋斗云就会留在点击这个小li 的位置

```html
   <script src="animate.js"></script>


    <script>
        window.addEventListener('load',function () {
            // 1. 获取元素
            var cloud = document.querySelector('.cloud');
            var c_nav = document.querySelector('.c-nav');
            var lis = c_nav.querySelectorAll('li');
            // 2. 给所有的小li绑定事件
            // 这个current 做为筋斗云的起始位置
            var current = 0;
            for (var i = 0; i < lis.length; i++) {
                // (1) 鼠标经过把当前小li 的位置做为目标值
                lis[i].addEventListener('mouseenter', function() {
                    animate(cloud, this.offsetLeft);
                });
                // (2) 鼠标离开就回到起始的位置
                lis[i].addEventListener('mouseleave', function() {
                    animate(cloud, current);
                });
                // (3) 当我们鼠标点击，就把当前位置做为目标值
                lis[i].addEventListener('click', function() {
                    current = this.offsetLeft;
                });
            }
        })



    </script>
</head>

<body>
    <div id="c_nav" class="c-nav">
        <span class="cloud"></span>
        <ul>
            <li><a href="#">首页新闻</a></li>
            <li><a href="#">师资力量</a></li>
            <li><a href="#">活动策划</a></li>
            <li><a href="#">企业文化</a></li>
            <li><a href="#">招聘信息</a></li>
            <li><a href="#">公司简介</a></li>
            <li><a href="#">我是佩奇</a></li>
            <li><a href="#">啥是佩奇</a></li>
        </ul>
    </div>
</body>
```



animate.js

```js
function animate(obj, target, callback) {
    // console.log(callback);  callback = function() {}  调用的时候 callback()

    // 先清除以前的定时器，只保留当前的一个定时器执行
    clearInterval(obj.timer);
    obj.timer = setInterval(function() {
        // 步长值写到定时器的里面
        // 把我们步长值改为整数 不要出现小数的问题
        // var step = Math.ceil((target - obj.offsetLeft) / 10);
        var step = (target - obj.offsetLeft) / 10;
        step = step > 0 ? Math.ceil(step) : Math.floor(step);
        if (obj.offsetLeft == target) {
            // 停止动画 本质是停止定时器
            clearInterval(obj.timer);
            // 回调函数写到定时器结束里面
            // if (callback) {
            //     // 调用函数
            //     callback();
            // }
            callback && callback();
        }
        // 把每次加1 这个步长值改为一个慢慢变小的值  步长公式：(目标值 - 现在的位置) / 10
        obj.style.left = obj.offsetLeft + step + 'px';

    }, 15);
}
```

