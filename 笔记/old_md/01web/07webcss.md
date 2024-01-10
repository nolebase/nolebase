---
title: 07 css 浮动
---

### 1. 浮动(float)

### 1.1 传统网页布局的三种方式

网页布局的本质——用 CSS 来摆放盒子。 把盒子摆放到相应位置.

CSS 提供了三种传统布局方式(简单说,就是盒子如何进行排列顺序):

- 普通流(标准流)
- 浮动
- 定位

### 1.2 标准流(普通流/文档流)

**所谓的标准流: 就是标签按照规定好默认方式排列.**

1. 块级元素会独占一行，从上向下顺序排列。

   常用元素:div、hr、p、h1~h6、ul、ol、dl、form、table

2. 行内元素会按照顺序，从左到右顺序排列，碰到父元素边缘则自动换行。

   常用元素:span、a、i、em 等

以上都是标准流布局，**标准流是最基本的布局方式**

这三种布局方式都是用来摆放盒子的，盒子摆放到合适位置，布局自然就完成了。

**注意:实际开发中，一个页面基本都包含了这三种布局方式(后面移动端学习新的布局方式) 。**

### 1.3 为什么需要浮动?

1. 如何让多个块级盒子(div)水平排列成一行?
2. 如何实现两个盒子的左右对齐?

总结: 有很多的布局效果，标准流没有办法完成，此时就可以利用浮动完成布局。 因为浮动可以改变元素标签默认的排列方式.

浮动最典型的应用:可以让多个块级元素一行内排列显示。

网页布局第一准则:**多个块级元素纵向排列找标准流，多个块级元素横向排列找浮动。**

### 1.4 什么是浮动?

float 属性用于创建浮动框，将其移动到一边，直到左边缘或右边缘触及包含块或另一个浮动框的边缘。

```text
选择器 { float: 属性值; }
```

![img](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2021/04cssfloat20210408205532.png)

### 1.5 浮动特性(重难点)

1. 浮动元素会脱离标准流(脱标)
   - 脱离标准普通流的控制(浮) 移动到指定位置(动), (俗称脱标)
   - 浮动的盒子不再保留原先的位置
2. 浮动的元素会一行内显示并且元素顶部对齐
3. 浮动的元素会具有行内块元素的特性.

![img](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2021/04cssbox20210408210359.png)

1. 如果多个盒子都设置了浮动，则它们会按照属性值一行内显示并且顶端对齐排列。

   **注意：** 浮动的元素是互相贴靠在一起的（不会有缝隙），如果父级宽度装不下这些浮动的盒子， 多出的盒子会另起一行对齐。

2. 浮动元素会具有行内块元素特性。

任何元素都可以浮动。不管原先是什么模式的元素，添加浮动之后具有行内块元素相似的特性。

- 如果块级盒子没有设置宽度，默认宽度和父级一样宽，但是添加浮动后，它的大小根据内容来决定
- 浮动的盒子中间是没有缝隙的，是紧挨着一起的
- 行内元素同理

### 1.6 浮动元素经常和标准流父级搭配使用

为了约束浮动元素位置, 我们网页布局一般采取的策略是:

**先用标准流的父元素排列上下位置,之后内部子元素采取浮动排列左右位置. 符合网页布局第一准侧.**

![img](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2021/04cssfloat20210408212022.png)

![img](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2021/04cssfloat20210410145201.png)

```html
<style>
    .box {
        height: 615px;
        width: 1226px;
        background-color: blue;
        margin: 0 auto;
    }

    .left {
        float: left;
        width: 234px;
        height: 615px;
        background-color: burlywood;
    }

    .right {
        float: left;
        height: 615px;
        width: 992px;
        background-color: coral;
    }

    .right>div {
        width: 234px;
        height: 300px;
        background-color: crimson;
        float: left;
        margin-left: 14px;
        margin-bottom: 14px;
    }
</style>

<body>

    <div class="box">
        <div class="left">1</div>
        <div class="right">
            <div>1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
            <div>5</div>
            <div>6</div>
            <div>7</div>
            <div>7</div>
        </div>
    </div>

</body>
```

## 2. 常见网页布局

![img](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2021/04cssbj20210410145336.png)

![img](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2021/04cssbj20210410145357.png)

![img](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2021/04cssbj20210410145416.png)

```html
<style>
    * {
        margin: 0px;
        padding: 0px;
    }

    .top {
        height: 50px;
        background-color: gray;
    }

    .banner {
        background-color: green;
        height: 150px;
        width: 980px;
        margin: 0 auto;
    }

    li {
        list-style: none;
    }

    .box {
        width: 980px;
        margin: 0 auto;
        height: 300px;
        background-color: purple;
        list-style: none;
    }
    .box li {
        float: left;
        width: 237px;
        height: 300px;
        background-color: rebeccapurple;
        margin-right: 10px;
    }
    .box .lastli {
        margin-right: 0px;
    }
    .footer {
        height: 280px;
        background-color: saddlebrown;
    }
</style>

<body>
    <div class="top"> top</div>
    <div class="banner">banner</div>
    <div class="box">
        <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li class="lastli">4</li>
        </ul>
    </div>
    <div class="footer">
        <footer></footer>
    </div>

</body>
```

### 2.2 浮动布局注意点

**1. 浮动和标准流的父盒子搭配。**

**先用标准流的父元素排列上下位置, 之后内部子元素采取浮动排列左右位置**

**2. 一个元素浮动了，理论上其余的兄弟元素也要浮动。**

一个盒子里面有多个子盒子，如果其中一个盒子浮动了，那么其他兄弟也应该浮动，以防止引起问题。

**浮动的盒子只会影响浮动盒子后面的标准流,不会影响前面的标准流.**

**我们前面浮动元素有一个标准流的父元素, 他们有一个共同的特点,都是有高度的.**

**但是, 所有的父盒子都必须有高度吗?**

理想中的状态, 让子盒子撑开父亲. 有多少孩子,我父盒子就有多高.

**但是不给父盒子高度会有问题吗?.....**

## 3. 清除浮动

### 3.1 为什么需要清除浮动?

由于父级盒子很多情况下，不方便给高度，但是子盒子浮动又不占有位置，最后父级盒子高度为 0 时，就会影响下面的标准流盒子。

![img](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2021/04cssfloat20210410151949.png)

- 由于浮动元素不再占用原文档流的位置，所以它会对后面的元素排版产生影响

### 3.2 清除浮动本质

- 清除浮动的本质是清除浮动元素造成的影响
- 如果父盒子本身有高度，则不需要清除浮动
- **清除浮动之后，父级就会根据浮动的子盒子自动检测高度。父级有了高度，就不会影响下面的标准流了**

### 3.3 清除浮动

```text
选择器{clear:属性值;}
```

![img](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2021/04cssclearfloat20210410152921.png)

**我们实际工作中， 几乎只用 clear: both;**

**清除浮动的策略是: 闭合浮动.**

### 3.3 清除浮动方法

- **额外标签法也称为隔墙法，是 W3C 推荐的做法**
- 父级添加 overflow 属性
- 父级添加after伪元素
- 父级添加双伪元素

**额外标签法也称为隔墙法，是 W3C 推荐的做法。**

额外标签法会在浮动元素末尾添加一个空的标签。例如 \<div style="clear:both">\</div>，或者其他标签(如\<br />等)。

- 优点: 通俗易懂，书写方便
- 缺点: 添加许多无意义的标签，结构化较差

**注意: 要求这个新的空标签必须是块级元素。**

```html
<style>
    .box {
        width: 800px;
        border: 1px solid blue;
        margin: 0 auto;
    }

    .d1 {
        height: 200px;
        width: 200px;
        float: left;
        background-color: salmon;
    }

    .d2 {
        height: 200px;
        width: 200px;
        float: left;
        background-color: seagreen;
    }

    .fotter {
        height: 200px;
        background-color: blue;
    }
    .clear {
        clear: both;
    }
</style>

<body>
    <div class="box">
        <div class="d1">1</div>
        <div class="d2">2</div>
        <!-- 额外标签 -->
        <div class="clear"></div>
    </div>
    <div class="fotter">footer</div>
</body>
```

**父级添加 overflow**

可以给父级添加 overflow 属性，将其属性值设置为 hidden、 auto 或 scroll 。

- 代码简洁
- 无法显示溢出的部分

**:after 伪元素法**

**:after 方式是额外标签法的升级版。也是给父元素添加**

```css
.clearfix:after { 
	content: ""; 
  display: block; 
  height: 0;
	clear: both; 
  visibility: hidden;
}
.clearfix { /* IE6、7 专有 */
	*zoom: 1; 
}
```

- 优点:没有增加标签，结构更简单
- 缺点:照顾低版本浏览器
- 代表网站: 百度、淘宝网、网易等

**双伪元素清除浮动**

```css
.clearfix:before,.clearfix:after { 
  content:"";
	display:table;
}
.clearfix:after {
	clear:both;
}
.clearfix { 
  *zoom:1;
}
```

- 优点:代码更简洁
- 照顾低版本浏览器
- 代表网站:小米、腾讯等

### 3.4 清除浮动总结

 **为什么需要清除浮动?**

1 父级没高度。

2 子盒子浮动了。

3 影响下面布局了，我们就应该清除浮动了。

![img](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2021/04cssfloatclear20210410192231.png)

## CSS 属性书写顺序(重点)

1. 布局定位属性:display / position / float / clear / visibility / overflow(建议 display 第一个写，毕竟关系到模式)
2. 自身属性:width / height / margin / padding / border / background
3. 文本属性:color / font / text-decoration / text-align / vertical-align / white- space / break-word
4. 其他属性(CSS3):content / cursor / border-radius / box-shadow / text-shadow / background:linear-gradient ...

## 页面布局分析

为了提高网页制作的效率，布局时通常有以下的布局流程:

1. 必须确定页面的版心(可视区)，我们测量可得知。
2. 分析页面中的行模块，以及每个行模块中的列模块。其实页面布局，就是一行行罗列而成的。
3. 制作 HTML 结构。我们还是遵循，先有结构，后有样式的原则。结构永远最重要。
4. 开始运用盒子模型的原理，通过 DIV+CSS 布局来控制网页的各个模块。

## **5.6 头部制作**

**实际开发中，我们不会直接用链接a 而是用 li 包含链接(li+a)的做法。**

1. li+a 语义更清晰，一看这就是有条理的列表型内容。
2. 如果直接用a，搜索引擎容易辨别为有堆砌关键字嫌疑（故意堆砌关键字容易被搜索引擎有降权的风险），从而影响网站排名

**注意**

1. 让导航栏一行显示, 给 li 加浮动, 因为 li 是块级元素, 需要一行显示.
2. 这个nav导航栏可以不给宽度,将来可以继续添加其余文字
3. 因为导航栏里面文字不一样多,所以最好给链接 a 左右padding 撑开盒子,而不是指定宽度