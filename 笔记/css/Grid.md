---
title: 网格 Grid
author: 刘俊 Romance
---

网格布局是一个二维布局系统。它能让你把内容按照行与列的格式进行排版。网格布局具有很多特点，能让你非常轻松地构建复杂布局。

## 什么是网格布局？

网格是由一系列水平及垂直的线构成的一种布局模式。根据网格，我们能够将设计元素进行排列，帮助我们设计一系列具有固定位置以及宽度的元素的页面，使我们的网站页面更加统一。

一个网格通常具有许多的**列**（column）与**行**（row），以及行与行、列与列之间的间隙，这个间隙一般被称为**沟槽**（gutter）。

![](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Grids/grid.png)

在这篇文章中，我们会从这开始，通过对原始的布局做一些改变，来一步一步了解网格是如何工作的。

## 定义网格

下图是一个容器，容器中有一些子项。默认情况下，子项按照正常布局流自顶而下排布。

```html
<div class="container">
  <div class="item one">One</div>
  <div class="item two">Two</div>
  <div class="item three">Three</div>
  <div class="item four">Four</div>
  <div class="item five">Five</div>
  <div class="item six">Six</div>
</div>
```

![图片](https://user-images.githubusercontent.com/92929085/216758689-c288f8f6-1dd4-4db8-bb1f-74a61808fade.png)

首先，将容器的 `display` 属性设置为 `grid` 来定义一个网络。

```css{2}
.container {
  display: grid;
}
```

我们通过在元素上声明 `display：grid` 或 `display：inline-grid` 来创建一个网格容器。我们这样做，能让这个元素的**所有直系子元素**成为网格项目。比如上面 `.container` 所在的元素为一个网格容器，其直系子元素将成为网格项目。

与弹性盒子不同的是，在定义网格后，网页并不会马上发生变化。因为 `display: grid` 的声明只创建了一个只有一列的网格，所以你的子项还是会像正常布局流那样从上而下一个接一个的排布。为了让我们的容器看起来更像一个网格，我们要给刚定义的网格加一些列。比如我们加三个宽度为 `200px` 的列。当然，这里可以用任何长度单位，包括百分比。

```css
.container {
  display: grid;
  grid-template-columns: 200px 200px 200px;
}
```

在规则里加入你的第二个声明。刷新页面后，你会看到子项们排进了新定义的网格中。

网格轨道：grid-template-columns 和 grid-template-rows 属性来定义网格中的行和列。容器内部的水平区域称为行，垂直区域称为列。上图中 One、Two、Three 组成了一行，One、Four 则是一列。

!()[https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/26/173895918ee0ecb6~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp]

## grid-template-columns 属性和 grid-template-rows 属性

grid-template-columns 属性设置列宽，grid-template-rows 属性设置行高，这两个属性在 Grid 布局中尤为重要，它们的值是有多种多样的，而且它们的设置是比较相似的，下面针对 grid-template-columns 属性进行讲解

```css
.wrapper {
  display: grid;
  /*  声明了三列，宽度分别为 200px 100px 200px */
  grid-template-columns: 200px 100px 200px;
  grid-gap: 5px;
  /*  声明了两行，行高分别为 50px 50px  */
  grid-template-rows: 50px 50px;
}
```

repeat() 函数：可以简化重复的值。该函数接受两个参数，第一个参数是重复的次数，第二个参数是所要重复的值。比如上面行高都是一样的，我们可以这么去实现，实际效果是一模一样的

```css
.wrapper-1 {
  display: grid;
  grid-template-columns: 200px 100px 200px;
  grid-gap: 5px;
  /*  2行，而且行高都为 50px  */
  grid-template-rows: repeat(2, 50px);
}
```

auto-fill 关键字：表示自动填充，让一行（或者一列）中尽可能的容纳更多的单元格。grid-template-columns: repeat(auto-fill, 200px) 表示列宽是 200 px，但列的数量是不固定的，只要浏览器能够容纳得下，就可以放置元素，代码以及效果如下图所示：

```css
.wrapper-2 {
  display: grid;
  grid-template-columns: repeat(auto-fill, 200px);
  grid-gap: 5px;
  grid-auto-rows: 50px;
}
```

## 使用 fr 单位的灵活网格

除了长度和百分比，我们也可以用 `fr` 这个单位来灵活地定义网格的行与列的大小。这个单位表示了可用空间的一个比例。例如，创建 3 个 `1fr` 的列：

```css
.container {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
}
```

<iframe class="sample-code-frame" title="使用 fr 单位的灵活网格 sample" id="frame_使用_fr_单位的灵活网格" src="https://yari-demos.prod.mdn.mozit.cloud/zh-CN/docs/Learn/CSS/CSS_layout/Grids/_sample_.%E4%BD%BF%E7%94%A8_fr_%E5%8D%95%E4%BD%8D%E7%9A%84%E7%81%B5%E6%B4%BB%E7%BD%91%E6%A0%BC.html" loading="lazy" width="100%" height="400"></iframe>

这个定义里，第一列被分配了 `2fr` 可用空间，余下的两列各被分配了 `1fr` 的可用空间，这会使得第一列的宽度是第二第三列的两倍。另外，fr可以与一般的长度单位混合使用，比如 `grid-template-columns: 300px 2fr 1fr` ，那么第一列宽度是300px，剩下的两列会根据除去300px后的可用空间按比例分配。

> **备注**： fr单位分配的是**可用空间**而非所有空间，所以如果某一格包含的内容变多了，那么整个可用空间就会减少，可用空间是不包括那些已经确定被占用的空间的。

## 网格间隙

使用 `grid-column-gap` 属性来定义列间隙；使用 `grid-row-gap` 来定义行间隙；使用 `grid-gap` 可以同时设定两者。

```css{4}
.container {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 20px;
}
```

间隙距离可以用任何长度单位包括百分比来表示，但不能使用 `fr` 单位。

<iframe class="sample-code-frame" title="网格间隙 sample" id="frame_网格间隙" src="https://yari-demos.prod.mdn.mozit.cloud/zh-CN/docs/Learn/CSS/CSS_layout/Grids/_sample_.%E7%BD%91%E6%A0%BC%E9%97%B4%E9%9A%99.html" loading="lazy" width="100%" height="400"></iframe>

> 备注： gap属性（`column-gap`、 `row-gap` 和 `gap`）曾经有一个 `grid-` 前缀，不过后来的标准进行了修改，目的是让他们能够在不同的布局方法中都能起作用。尽管现在这个前缀不会影响语义，但为了代码的健壮性，你可以把两个属性都写上。
>
>```css
>.container {
>  display: grid;
>  grid-template-columns: 2fr 1fr 1fr;
>  grid-gap: 20px;
>  gap: 20px;
>}
>```

## 重复构建行/列

你可以使用repeat()函数来重复构建具有宽度配置的某些列。举个例子，如果要创建多个等宽轨道，可以用下面的方法。

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
}
```

和之前一样，你仍然得到了 3 个 `1fr` 的列。第一个传入 repeat 函数的值定义了后续列宽的配置要重复多少次，而第二个值（1fr）表示需要重复的构建配置，这个配置可以具有多个长度设定。例如repeat(2, 2fr 1fr)，如果你仍然不明白，可以实际测试一下效果，这相当于填入了2fr 1fr 2fr 1fr。

## 显式网格与隐式网格

到目前为止，我们定义过了列，但还没有管过行。但在这之前，我们要来理解一下显式网格和隐式网格。显式网格是我们用grid-template-columns 或 grid-template-rows 属性创建的。而隐式网格则是当有内容被放到网格外时才会生成的。显式网格与隐式网格的关系与弹性盒子的 main 和 cross 轴的关系有些类似。

隐式网格中生成的行/列大小是参数默认是auto，大小会根据放入的内容自动调整。当然，你也可以使用grid-auto-rows和grid-auto-columns属性手动设定隐式网格的大小。下面的例子将grid-auto-rows设为了100px，然后你可以看到那些隐式网格中的行（因为这个例子里没有设定grid-template-rows，因此，所有行都位于隐式网格内）现在都是 100 像素高了。

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 100px;
  gap: 20px;
}
```

### minmax() 函数

100 像素高的行/列有时可能会不够用，因为时常会有比 100 像素高的内容加进去。所以，我们希望可以将其设定为至少 100 像素，而且可以跟随内容来自动拓展尺寸保证能容纳所有内容。显而易见，你很难知道网页上某个元素的尺寸在不同情况下会变成多少，一些额外的内容或者更大的字号就会导致许多能做到像素级精准的设计出现问题。所以，我们有了minmax函数。

minmax 函数为一个行/列的尺寸设置了取值范围。比如设定为 minmax(100px, auto)，那么尺寸就至少为 100 像素，并且如果内容尺寸大于 100 像素则会根据内容自动调整。在这里试一下把 grid-auto-rows 属性设置为minmax函数。

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(100px, auto);
  gap: 20px;
}
```

如果所有网格内的内容均小于 100 像素，那么看起来不会有变化，但如果在某一项中放入很长的内容或者图片，你可以看到这个格子所在的哪一行的高度变成能刚好容纳内容的高度了。注意我们修改的是 grid-auto-rows，因此只会作用于隐式网格。当然，这一项属性也可以应用于显式网格，更多内容可以参考 minmax 页面。

### 自动使用多列填充

现在来试试把学到的关于网格的一切，包括 repeat 与 minmax 函数，组合起来，来实现一个非常有用的功能。某些情况下，我们需要让网格自动创建很多列来填满整个容器。通过设置grid-template-columns属性，我们可以实现这个效果，不过这一次我们会用到repeat函数中的一个关键字auto-fill来替代确定的重复次数。而函数的第二个参数，我们使用minmax函数来设定一个行/列的最小值，以及最大值1fr。

在你的文件中试试看，你也许可以用到以下的代码。

```css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-rows: minmax(100px, auto);
  gap: 20px;
}
```

你应该能看到形成了一个包含了许多至少 200 像素宽的列的网格，将容器填满。随着容器宽度的改变，网格会自动根据容器宽度进行调整，每一列的宽度总是大于 200 像素，并且容器总会被列填满。

## 基于线的元素放置

在定义完了网格之后，我们要把元素放入网格中。我们的网格有许多分隔线，第一条线的起始点与文档书写模式相关。在英文中，第一条列分隔线（即网格边缘线）在网格的最左边而第一条行分隔线在网格的最上面。而对于阿拉伯语，第一条列分隔线在网格的最右边，因为阿拉伯文是从右往左书写的。

我们根据这些分隔线来放置元素，通过以下属性来指定从那条线开始到哪条线结束。

    grid-column-start (en-US)
    grid-column-end (en-US)
    grid-row-start (en-US)
    grid-row-end (en-US)

这些属性的值均为分隔线序号，你也可以用以下缩写形式来同时指定开始与结束的线。

    grid-column
    grid-row

注意开始与结束的线的序号要使用/符号分开。

下载这个文件（或者查看在线预览）。文件中已经定义了一个网格以及一篇简单的文章位于网格之外。你可以看到元素已经被自动放置到了我们创建的网格中。

接下来，尝试用定义网格线的方法将所有元素放置到网格中。将以下规则加入到你的 css 的末尾：


```css
header {
  grid-column: 1 / 3;
  grid-row: 1;
}

article {
  grid-column: 2;
  grid-row: 2;
}

aside {
  grid-column: 1;
  grid-row: 2;
}

footer {
  grid-column: 1 / 3;
  grid-row: 3;
}
```

> **备注：** 你也可以用 `-1` 来定位到最后一条列分隔线或是行分隔线，并且可以用负数来指定倒数的某一条分隔线。但是这只能用于显式网格，对于 [隐式网格](/zh-CN/docs/Glossary/Grid)-1不一定能定位到最后一条分隔线。

## grid-auto-flow

grid-auto-flow 属性控制着自动布局算法怎样运作，精确指定在网格中被自动布局的元素怎样排列。默认的放置顺序是"先行后列"，即先填满第一行，再开始放入第二行，即下图英文数字的顺序 one,two,three...。这个顺序由 grid-auto-flow 属性决定，默认值是 row。
.wrapper {
  display: grid;
  grid-template-columns: 100px 200px 100px;
  grid-auto-flow: row;
  grid-gap: 5px;
  grid-auto-rows: 50px;
}

- start：对齐单元格的起始边缘
- end：对齐单元格的结束边缘
- center：单元格内部居中
- stretch：拉伸，占满单元格的整个宽度（默认值）


## grid-column-start 属性、grid-column-end 属性、grid-row-start 属性以及grid-row-end 属性

可以指定网格项目所在的四个边框，分别定位在哪根网格线，从而指定项目的位置

grid-column-start 属性：左边框所在的垂直网格线
grid-column-end 属性：右边框所在的垂直网格线
grid-row-start 属性：上边框所在的水平网格线
grid-row-end 属性：下边框所在的水平网格线

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/26/173895928bc7e88e~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

```css
.wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  grid-auto-rows: minmax(100px, auto);
}
.one {
  grid-column-start: 1;
  grid-column-end: 2;
  background: #19CAAD;
}
.two { 
  grid-column-start: 2;
  grid-column-end: 4;
  grid-row-start: 1;
  grid-row-end: 2;
  /*   如果有重叠，就使用 z-index */
  z-index: 1;
  background: #8CC7B5;
}
.three {
  grid-column-start: 3;
  grid-column-end: 4;
  grid-row-start: 1;
  grid-row-end: 4;
  background: #D1BA74;
}
.four {
  grid-column-start: 1;
  grid-column-end: 2;
  grid-row-start: 2;
  grid-row-end: 5;
  background: #BEE7E9;
}
.five {
  grid-column-start: 2;
  grid-column-end: 2;
  grid-row-start: 2;
  grid-row-end: 5;
  background: #E6CEAC;
}
.six {
  grid-column: 3;
  grid-row: 4;
  background: #ECAD9E;
}
```

justify-self 属性、align-self 属性以及 place-self 属性
justify-self 属性/ align-self 属性/ place-self 属性演示地址
justify-self 属性设置单元格内容的水平位置（左中右），跟 justify-items 属性的用法完全一致，但只作用于单个项目
align-self 属性设置单元格内容的垂直位置（上中下），跟align-items属性的用法完全一致，也是只作用于单个项目
两者很相像，这里只拿 justify-self 属性演示，align-self 属性同理，只是作用于垂直方向。place-self 是设置 align-self 和 justify-self 的简写形式，这里也不重复介绍。

```css
.item {
  justify-self: start | end | center | stretch;
  align-self: start | end | center | stretch;
}

.item {
  justify-self: start;
}
.item-1 {
  justify-self: end;
}
.item-2 {
  justify-self: center;
}
.item-3 {
  justify-self: stretch;
}
```

## Grid 实战——实现响应式布局 的解决方案

### fr 实现等分响应式
fr 等分单位，可以将容器的可用空间分成想要的多个等分空间。利用这个特性，我们能够轻易实现一个等分响应式。grid-template-columns: 1fr 1fr 1fr 表示容器分为三等分
.wrapper {
  margin: 50px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px 20px;
  grid-auto-rows: 50px;
}

## repeat + auto-fit——固定列宽，改变列数量
等分布局并不只有 Grid 布局才有，像 flex 布局也能轻松实现，接下来看看更高级的响应式
上面例子的始终都是三列的，但是需求往往希望我们的网格能够固定列宽，并根据容器的宽度来改变列的数量。这个时候，我们可以用到上面提到 repeat() 函数以及 auto-fit 关键字。grid-template-columns: repeat(auto-fit, 200px) 表示固定列宽为 200px，数量是自适应的，只要容纳得下，就会往上排列，代码以及效果实现如下：

```css
.wrapper {
  margin: 50px;
  display: grid;
  grid-template-columns: repeat(auto-fit, 200px);
  grid-gap: 10px 20px;
  grid-auto-rows: 50px;
}
```
repeat+auto-fit+minmax 去掉右侧空白
上面看到的效果中，右侧通常会留下空白，这是我们不希望看到的。如果列的宽度也能在某个范围内自适应就好了。minmax() 函数就帮助我们做到了这点。将 grid-template-columns: repeat(auto-fit, 200px) 改成 grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) 表示列宽至少 200px，如果还有空余则一起等分。代码以及效果如下所示：

```css
.wrapper {
  margin: 50px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 10px 20px;
  grid-auto-rows: 50px;
}
```


repeat+auto-fit+minmax-span-dense 解决空缺问题
似乎一切进行得很顺利，但是某天 UI 来说，每个网格元素的长度可能不相同，这也简单，通过 span 关键字进行设置网格项目的跨度，grid-column-start: span 3，表示这个网格项目跨度为 3。具体的代码与效果如下所示：
.item-3 {
  grid-column-start: span 3;
}


不对，怎么右侧又有空白了？原来是有一些长度太长了，放不下，这个时候就到我们的 dense 关键字出场了。grid-auto-flow: row dense 表示尽可能填充，而不留空白，代码以及效果如下所示：
.wrapper, .wrapper-1 {
  margin: 50px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 10px 20px;
  grid-auto-rows: 50px;
}

.wrapper-1 {
  grid-auto-flow: row dense;
}



## Positioning with grid-template-areas

Remove the line-based positioning from the last example (or re-download the file to have a fresh starting point) and add the following CSS.

```css
.container {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar content"
    "footer footer";
  grid-template-columns: 1fr 3fr;
  gap: 20px;
}

header {
  grid-area: header;
}

article {
  grid-area: content;
}

aside {
  grid-area: sidebar;
}

footer {
  grid-area: footer;
}
```

Reload the page and you will see that your items have been placed just as before without us needing to use any line numbers!


The rules for `grid-template-areas` are as follows:

- You need to have every cell of the grid filled.
- To span across two cells, repeat the name.
- To leave a cell empty, use a `.` (period).
- Areas must be rectangular — for example, you can't have an L-shaped area.
- Areas can't be repeated in different locations.

You can play around with our layout, changing the footer to only sit underneath the article and the sidebar to span all the way down. This is a very nice way to describe a layout because it's clear just from looking at the CSS to know exactly what's happening.

## Grid frameworks in CSS Grid

Grid "frameworks" tend to be based around 12 or 16-column grids. With CSS Grid, you don't need any third party tool to give you such a framework — it's already there in the spec.

[Download the starting point file](https://github.com/mdn/learning-area/blob/main/css/css-layout/grids/11-grid-system-starting-point.html). This has a container with a 12-column grid defined and the same markup we used in the previous two examples. We can now use line-based placement to place our content on the 12-column grid.

```css
header {
  grid-column: 1 / 13;
  grid-row: 1;
}

article {
  grid-column: 4 / 13;
  grid-row: 2;
}

aside {
  grid-column: 1 / 4;
  grid-row: 2;
}

footer {
  grid-column: 1 / 13;
  grid-row: 3;
}
```


If you use the [Firefox Grid Inspector](https://firefox-source-docs.mozilla.org/devtools-user/page_inspector/how_to/examine_grid_layouts/index.html) to overlay the grid lines on your design, you can see how our 12-column grid works.


## Test your skills!

You've reached the end of this article, but can you remember the most important information? You can find some further tests to verify that you've retained this information before you move on — see [Test your skills: Grid](/en-US/docs/Learn/CSS/CSS_layout/Grid_skills).

## Summary

In this overview, we've toured the main features of CSS Grid Layout. You should be able to start using it in your designs. To dig further into the specification, read our guides on Grid Layout, which can be found below.

## 扩展阅读

- [CSS Grid guides](/en-US/docs/Web/CSS/CSS_Grid_Layout#guides)
- [CSS Grid Inspector: Examine grid layouts](https://firefox-source-docs.mozilla.org/devtools-user/page_inspector/how_to/examine_grid_layouts/index.html)
- [CSS-Tricks Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/) — an article explaining everything about Grid in a visually appealing way
- [Grid Garden](https://cssgridgarden.com/) — an educational game to learn and better understand the basics of Grid


[css-tricks](https://css-tricks.com/snippets/css/complete-guide-grid)

[CSS Grid 网格布局教程 - 阮一峰](https://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html)

https://juejin.cn/post/6854573220306255880
