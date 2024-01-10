---
title: 10 h5 和 css3
---

## 1. HTML5 的新特性

HTML5 的新增特性主要是针对于以前的不足，增加了一些新的标签、新的表单和新的表单属性等。

这些新特性都有兼容性问题，基本是 IE9+ 以上版本的浏览器才支持，如果不考虑兼容性问题，可以大量使用这些新特性。

### 1.1 HTML5 新增的语义化标签

以前布局，我们基本用 div 来做。div 对于搜索引擎来说，是没有语义的。

```html
<div class=“header”> </div> 
<div class=“nav”> </div> 
<div class=“content”> </div> 
<div class=“footer”> </div>
```
* \<header>:头部标签
* \<nav>:导航标签
*  \<article>:内容标签
* \<section>:定义文档某个区域 
* \<aside>:侧边栏标签
* \<footer>:尾部标签

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202104/h520210418162420.png)

**注意:**

* 这种语义化标准主要是针对搜索引擎的
* 这些新标签页面中可以使用多次
* 在 IE9 中，需要把这些元素转换为块级元素
* 其实，我们移动端更喜欢使用这些标签

### 1.2 HTML5 新增的多媒体标签

 新增的多媒体标签主要包含两个:

**1. 音频:\<audio> **

**2. 视频:\<video>**

使用它们可以很方便的在页面中嵌入音频和视频，而不再去使用 flash 和其他浏览器插件。

HTML5 在不使用插件的情况下，也可以原生的支持视频格式文件的播放，当然，支持的格式是有限的。

* 1. 视频\<video>

当前 \<video> 元素支持三种视频格式: 尽量使用 mp4格式

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202104/h520210418164436.png)

**语法**

```
<video src="文件地址" controls="controls"></video>
```

```
<video controls="controls" width="300">
    <source src="move.ogg" type="video/ogg">
    <source src="move.mp4" type="video/mp4">
    您的浏览器暂不支持
    标签播放视频
</video>
```

* 1. 视频\<video>——常见属性

![ ](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202104/20210418163542.png)

* 2. 音频\<audio>

当前 \<audio> 元素支持三种音频格式:

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202104/h520210418164410.png)

```
<audio src="文件地址" controls="controls"></audio>
```

```html
< audio controls="controls" >
<source src="happy.mp3" type="audio/mpeg">
<source src="happy.ogg" type="audio/ogg">
您的浏览器暂不支持
<audio> 标签。
</audio>
```

*  谷歌浏览器把音频和视频自动播放禁止了

* 3. 多媒体标签总结

* 频标签和视频标签使用方式基本一致
* 浏览器支持情况不同
* 谷歌浏览器把音频和视频自动播放禁止了
* 我们可以给视频标签添加 muted 属性来静音播放视频，音频不可以(可以通过JavaScript解决) 
* 视频标签是重点，我们经常设置自动播放，不使用 controls 控件，循环和设置大小属性

### 1.3 HTML5 新增的 input 类型

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202104/h5input20210418164827.png)

### 1.4 HTML5 新增的表单属性

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202104/20210418165239.png)

可以通过以下设置方式修改placeholder里面的字体颜色:

```css
input::placeholder { 
  	color: pink;
}
```

## 2. CSS3 的新特性

* 新增的CSS3特性有兼容性问题，ie9+才支持 
* 移动端支持优于PC端
* 不断改进中
* 应用相对广泛

###  2.2 属性选择器 

**CSS3 新增选择器**

CSS3 给我们新增了选择器，可以更加便捷，更加自由的选择目标元素。

CSS3 给我们新增了选择器，可以更加便捷，更加自由的选择目标元素。 

1. 属性选择器

2. 结构伪类选择器

3. 伪元素选择器

属性选择器可以根据元素特定属性的来选择元素。 这样就可以不用借助于类或者id选择器。

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202104/css320210418165822.png)

**注意:类选择器、属性选择器、伪类选择器，权重为 10。**

### 2.3 结构伪类选择器

结构伪类选择器主要根据**文档结构**来选择器元素， 常用于根据父级选择器里面的子元素

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202104/css320210418165947.png)

**注意:类选择器、属性选择器、伪类选择器，权重为 10。**

nth-child(n) 选择某个父元素的一个或多个特定的子元素(重点)

*  n可以是数字，关键字和公式
* n 如果是数字，就是选择第 n 个子元素， 里面数字从1开始...
* n 可以是关键字:even 偶数，odd 奇数
* n 可以是公式:常见的公式如下 ( 如果n是公式，则从0开始计算，但是第 0 个元素或者超出了元素的个数会被忽略 )

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202104/css320210418170110.png)

区别

**1. nth-child 对父元素里面所有孩子排序选择(序号是固定的) 先找到第n个孩子，然后看看是否和E匹配**
**2. nth-of-type 对父元素里面指定子元素进行排序选择。 先去匹配E ，然后再根据E 找第n个孩子**

**小结**

* 结构伪类选择器一般用于选择父级里面的第几个孩子
* nth-child 对父元素里面所有孩子排序选择(序号是固定的) 先找到第n个孩子，然后看看是否和E匹配  
* nth-of-type 对父元素里面指定子元素进行排序选择。 先去匹配E ，然后再根据E 找第n个孩子
* 关于 nth-child(n) 我们要知道 n 是从 0 开始计算的，要记住常用的公式
*  如果是无序列表，我们肯定用 nth-child 更多
*  类选择器、属性选择器、伪类选择器，权重为 10。

### 2.4 伪元素选择器(重点)

伪元素选择器可以帮助我们利用CSS创建新标签元素，而不需要HTML标签，从而简化HTML结构。

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202104/css320210418181220.png)

**注意:**

* before 和 after 创建一个元素，但是属于行内元素
*  新创建的这个元素在文档树中是找不到的，所以我们称为伪元素
*  语法: element::before {}
*  before 和 after 必须有 content 属性
*  before 在父元素内容的前面创建元素，after 在父元素内容的后面插入元素 
*  伪元素选择器和标签选择器一样，权重为 1

### 2.5 CSS3 盒子模型

CSS3 中可以通过 box-sizing 来指定盒模型，有2个值:即可指定为 content-box、border-box，这样我们计算盒子大小的方式就发生了改变。

可以分成两种情况:

1. box-sizing: content-box 盒子大小为 width + padding + border (以前默认的)

2. box-sizing: border-box 盒子大小为 width

如果盒子模型我们改为了box-sizing: border-box ， 那padding和border就不会撑大盒子了(前提padding和border不会超过width宽度)

```html
<style>
    div {
        width: 200px;
        height: 200px;
        background-color: pink;
        border: 20px solid red;
        padding: 15px;
        box-sizing: content-box;

    }

    p {
        width: 200px;
        height: 200px;
        background-color: pink;
        border: 20px solid red;
        padding: 15px;
        box-sizing: content-box;
        box-sizing: border-box;
    }

</style>
<body>


<div>
</div>

<p>
</p>

</body>
```

<img src="https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202104/css3div20210418190110.png" style="zoom:50%;" />

### 2.6 CSS3 其他特性(了解)

* 1. 图片变模糊

CSS3滤镜filter:

filter CSS属性将模糊或颜色偏移等图形效果应用于元素。

```
filter: 函数(); 例如: filter: blur(5px); blur模糊处理 数值越大越模糊
```

* 2. 计算盒子宽度 width: calc 函数

CSS3 calc 函数:

calc() 此CSS函数让你在声明CSS属性值时执行一些计算。

```
width: calc(100% - 80px);
```

括号里面可以使用 + - * / 来进行计算。

```html
<style>
    .father {
        width: 300px;
        height: 200px;
        background-color: pink;
    }

    .son {
        width: calc(100% - 30px);
        height: calc(100% - 30px);
        background-color: red;
    }

</style>
<body>

<!--    子盒子永远比父盒子小10像素-->
<div class="father">
    <div class="son">

    </div>
</div>

</body>
```

CSS3 还增加了一些 动画 2D 3D 等新特性

### 2.7 CSS3 过渡(重点)

过渡(transition)是CSS3中具有颠覆性的特征之一，我们可以在不使用 Flash 动画或JavaScript 的情况下，当元素从一种样式变换为另一种样式时为元素添加效果。

过渡动画: 是从一个状态 渐渐的过渡到另外一个状态

可以让我们页面更好看，更动感十足，虽然 低版本浏览器不支持(ie9以下版本) 但是不会影响页面布局。

**我们现在经常和 :hover 一起 搭配使用。**

```
transition: 要过渡的属性 花费时间 运动曲线 何时开始;
```

1. 属性 : 想要变化的 css 属性， 宽度高度 背景颜色 内外边距都可以 。如果想要所有的属性都变化过渡， 写一个all 就可以。
2. 花费时间: 单位是 秒(必须写单位) 比如 0.5s
3. 运动曲线: 默认是 ease (可以省略)
4. 何时开始 :单位是 秒(必须写单位)可以设置延迟触发时间 默认是 0s (可以省略)

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202104/csstransition20210418201922.png)

**谁做过渡给谁加**

```css
        div {
            width: 200px;
            height: 200px;
            background-color: pink;
            /*transition: width 1s ease 3s,background-color 2s ;*/
            
            transition: all 0.5s;  // 所有的属性都变
        }

        div:hover {
            width: 300px;
            background-color: red;
        }
```



​		进度条

```html
<style>
    .bar {
        width:  150px;
        height: 15px;
        border: 1px solid red;
        border-radius: 7px;
        padding: 1px;

    }
    .bar_in {
        width: 50%;
        height: 100%;
        background-color: red;
        transition: width 3s ;
    }

    .bar_in:hover {
        width: 100%;
    }

</style>
<body>

<div class="bar">
    <div class="bar_in"></div>
</div>

</body>
```

## 狭义的HTML5 CSS3

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202104/h520210418203642.png)

1. 广义的 HTML5 是 HTML5 本身 + CSS3 + JavaScript 。
2. 这个集合有时称为 HTML5 和朋友，通常缩写为 HTML5 。
3. 虽然 HTML5 的一些特性仍然不被某些浏览器支持，但是它是一种发展趋势。
4. HTML5 MDN 介绍:

[https://developer.mozilla.org/zh-CN/docs/Web/Guide/HTML/HTML](https://developer.mozilla.org/zh-CN/docs/Web/Guide/HTML/HTML)

