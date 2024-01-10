---
title: 弹性盒子 FlexBox
author: (Author) wbamberg, (Translator) 刘俊
---

当元素表现为 flex 框时，它们沿着两个轴来布局：

- 主轴（main axis）：沿着 flex 元素放置的方向延伸的轴（比如页面上的横向的行、纵向的列）. 该轴的开始和结束被称为 `main start` 和 `main end`.
- 交叉轴（cross axis）：垂直于 flex 元素放置方向的轴. 该轴的开始和结束被称为 `cross start` 和 `cross end`.
- 设置了 `display: flex` 的父元素是 **flex 容器** `flex container`.
- 在 flex 容器中表现为弹性的盒子的元素被称之为 flex 项 `flex item`.

![flex](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox/flex_terms.png)

以下是一个简单的案例：

```html
<section>
  <header>
    <h1>Sample flexbox example</h1>
  </header>

  <article>
    <h2>First article</h2>
    <p>Tacos actually microdosing, pour-over semiotics banjo chicharrones retro fanny pack portland everyday carry vinyl typewriter. Tacos PBR&B pork belly, everyday carry ennui pickled sriracha normcore hashtag polaroid single-origin coffee cold-pressed. PBR&B tattooed trust fund twee, leggings salvia iPhone photo booth health goth gastropub hammock.</p>
  </article>

  <article>
    <h2>Second article</h2>
    <p>Tacos actually microdosing, pour-over semiotics banjo chicharrones retro fanny pack portland everyday carry vinyl typewriter. Tacos PBR&B pork belly, everyday carry ennui pickled sriracha normcore hashtag polaroid single-origin coffee cold-pressed. PBR&B tattooed trust fund twee, leggings salvia iPhone photo booth health goth gastropub hammock.</p>
  </article>

  <article>
    <h2>Third article</h2>
    <p>Tacos actually microdosing, pour-over semiotics banjo chicharrones retro fanny pack portland everyday carry vinyl typewriter. Tacos PBR&B pork belly, everyday carry ennui pickled sriracha normcore hashtag polaroid single-origin coffee cold-pressed. PBR&B tattooed trust fund twee, leggings salvia iPhone photo booth health goth gastropub hammock.</p>
    <p>Cray food truck brunch, XOXO +1 keffiyeh pickled chambray waistcoat ennui. Organic small batch paleo 8-bit. Intelligentsia umami wayfarers pickled, asymmetrical kombucha letterpress kitsch leggings cold-pressed squid chartreuse put a bird on it. Listicle pickled man bun cornhole heirloom art party.</p>
  </article>
</section>
```

效果图是这样的：
![效果图](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox/bih741v.png)

这时，我们就要设置弹性盒子了。我们需要给父元素的 `display` 赋值：

```css
section {
  display:flex
}
```

在本例中，我们想要设置 `<article>` 元素，因此我们给 `<section>`（变成了 flex 容器）设置 `display` 为 `flex`.

![结果](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox/flexbox-example2.png)

就这样，一个简单的声明就给了我们所需要的一切。真是非常的不可思议！！我们的多列布局具有大小相等的列，并且列的高度都是一样。

## 行/列方向

### flex-direction

弹性盒子提供了 flex-direction 这样一个属性，它可以指定主轴的方向（弹性盒子子类放置的地方）——它默认值是 row，这使得它们在按你浏览器的默认语言方向排成一排（在英语和中文浏览器中是从左到右）。

尝试将以下声明添加到 `<section>` 元素的 css 规则里：

```css
flex-direction: column;
```

你会看到，这会将那些元素设置为列布局，就像我们添加这些 CSS 之前。在继续之前，请从示例中删除此规则。

备注： 你还可以使用 row-reverse 和 column-reverse 值反向排列 flex 项。用这些值试试看吧！

## 换行

### flex-wrap

当你在布局中使用定宽或者定高的时候，可能会出现问题即处于容器中的弹性盒子子元素会溢出，破坏了布局。

如这个[例子](https://github.com/mdn/learning-area/blob/master/css/css-layout/flexbox/flexbox-wrap0.html)：

![flexbox-example3.png](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox/flexbox-example3.png)

在这里我们看到，子代确实超出了它们的容器。解决此问题的一种方法是将 `flex-wrap: wrap` 添加到 `section` 的 CSS 规则中；同时，把 `flex: 200px;` 添加到 `<article>` 规则中：

```css
/* FlexBox */
section {
  display: flex;
  /* flex-direction: row; 默认*/
  flex-wrap: wrap;
}

article {
  flex: 200px;
}
```

现在尝试一下吧.你会看到布局比原来好多了：

![flexbox-example4.png](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox/flexbox-example4.png)

我们现在有多个行。每行都安装了尽可能多的 flex 项。任何溢出都会向下移动到下一行。在 article 上设置的 flex：200px 声明意味着每个声明将至少为 200px 宽。我们稍后会更详细地讨论这个属性。你可能还注意到，最后一行上的最后几个项每个都变得更宽，以便把整个行填满。

但是这里我们可以做得更多。首先，改变 flex-direction 属性值为 row-reverse——你会看到仍然有多行布局，但是每一行元素排列的方向和原来是相反的了。

## 缩写

### flex-flow

我们可以把 `flex-direction` 和 `flex-wrap` 的缩写为 `flex-flow`。比如，你可以将

```css{4-5}
/* FlexBox Container */
section {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
/* Flex Item */
article {
  flex: 200px;
}
```

缩写为：

```css{4}
/* FlexBox Container */
section {
  display: flex;
  flex-flow: row wrap;
}
/* Flex Item */
article {
  flex: 200px;
}
```

## flex 项的动态尺寸

现在让我们回到第一个例子，看看是如何控制 flex 项占用空间的比例的。打开你本地的 弹性盒子 0.html，或者拷贝 弹性盒子 1.html 作为新的开始（查看线上）。

第一步，将以下规则添加到 CSS 的底部：

```css{4}
/* FlexBox Container */
section {
  display: flex;
  flex-flow: row wrap;
}
/* Flex Item  */
article {
 flex: 1;
}
```

这是一个无单位的比例值，表示每个 flex 项沿主轴的可用空间大小。本例中，我们设置 `<article>` 元素的 flex 值为 1，这表示每个元素占用空间都是相等的，占用的空间是在设置 padding 和 margin 之后剩余的空间。因为它是一个比例，这意味着将每个 flex 项的设置为 400000 的效果和 1 的时候是完全一样的。

现在在上一个规则下添加：

```css
/* Flex Item  */
article {
 flex: 1;
}

article:nth-of-type(3) {
  flex: 2;
}
```

现在当你刷新，你会看到第三个 `<article>` 元素占用了两倍的可用宽度和剩下的一样——现在总共有四个比例单位可用。前两个 flex 项各有一个，因此它们占用每个可用空间的 1/4。第三个有两个单位，所以它占用 2/4 或者说是 1/2 的可用空间。

你还可以指定 flex 的最小值。尝试修改现有的 article 规则：

```css
article {
  flex: 1 200px;
}

article:nth-of-type(3) {
  flex: 2 200px;
}
```

这表示“每个 flex 项将首先给出 200px 的可用空间，然后，剩余的可用空间将根据分配的比例共享”。尝试刷新，你会看到分配空间的差别。

![flexbox-example1.png](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox/flexbox-example1.png)
弹性盒子的真正价值可以体现在它的灵活性/响应性，如果你调整浏览器窗口的大小，或者增加一个 `<article>` 元素，这时的布局仍旧是好的。

## flex：缩写与全写

flex 是一个可以指定最多三个不同值的缩写属性：

- 第一个就是上面所讨论过的无单位比例。可以单独指定全写 flex-grow 属性的值。
- 第二个无单位比例——flex-shrink——一般用于溢出容器的 flex 项。这指定了从每个 flex 项中取出多少溢出量，以阻止它们溢出它们的容器。这是一个相当高级的弹性盒子功能，我们不会在本文中进一步说明。
- 第三个是上面讨论的最小值。可以单独指定全写 flex-basis 属性的值。

我们建议不要使用全写属性，除非你真的需要（比如要去覆盖之前写的）。使用全写会多写很多的代码，它们也可能有点让人困惑。

## 水平和垂直对齐

还可以使用弹性盒子的功能让 flex 项沿主轴或交叉轴对齐。让我们一起看一下新例子：flex-align0.html

```html
<div>
  <button>Smile</button>
  <button>Laugh</button>
  <button>Wink</button>
  <button>Shrug</button>
  <button>Blush</button>
</div>
```

我们将会有一个整洁，灵活的按钮/工具栏。此时，你看到了一个水平菜单栏，其中一些按钮卡在左上角，就像下面这样：

![](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox/flexbox-example5.png)

首先，拷贝一份到本地。

然后，将下面的 CSS 添加到例子的底部：

```css
div {
  display: flex;
  /* 交叉轴居中 */
  align-items: center;
  justify-content: space-around;
}
```

![](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox/flexbox_center_space-around.png)

刷新一下页面，你就会看到这些按钮很好的垂直水平居中了。我们是通过下面所说的两个新的属性做到的。

### align-items

`align-items` 控制 `flex` 项在交叉轴上的位置。

默认的值是 `stretch`，它会让所有的弹性项目沿着交叉轴的方向拉伸，从而填充整个父容器。如果父容器在交叉轴方向上没有固定宽度（即高度），则所有弹性项目会保持高度一致，和最高的那个项目一样高。我们第一个例子便是如此（参见下图）。

![结果](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox/flexbox-example2.png)

在上面规则中我们使用的 `center` 值会使这些项保持其原有的高度，但是会在交叉轴居中。这就是那些按钮垂直居中的原因。
你也可以设置诸如 `flex-start` 或 `flex-end` 这样使 `flex` 项在交叉轴的开始或结束处对齐所有的值。查看 [align-items](https://developer.mozilla.org/zh-CN/docs/Web/CSS/align-items) 了解更多。

你可以用 `align-self` 属性覆盖 `align-items` 的行为。比如，你可以这样：

```css
button:first-child {
  align-self: flex-end;
}
```

![带有 Smile、Laugh、Wink、Shrug & Blush 标签的五个按钮排在一个弹性容器中。除第一个项外，所有 flex 项都通过将对齐项属性设置为中心，位于十字轴的中心或垂直居中。第一项与交叉轴末端的弹性容器底部齐平，对齐自属性设置 flex 端。flex 项沿着容器的主轴或宽度均匀间隔。](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox/flexbox_first-child_flex-end.png)

### justify-content

[`justify-content`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/justify-content) 控制 `flex` 项在主轴上的位置。

默认值是 `flex-start`，所有弹性项都位于主轴的起始处。你也可以用 `flex-end` 来让弹性项目来到末尾。
`center` 在 `justify-content` 也可用，用于让弹性项目在主轴居中。

而我们上面用到的值 `space-around` 会使所有的浮动项目沿着主轴均匀地分布，在任意一端都会留有一点空间。

还有一个值是 `space-between`，它和 `space-around` 相似，但它不会在两端留下空间。

## flex 项排序

弹性盒子也有可以改变 flex 项的布局位置的功能，而不会影响到源顺序（即 dom 树里元素的顺序）。这也是传统布局方式很难做到的一点。

代码也很简单，将下面的 CSS 添加到示例代码下面。

```css
button:first-child {
  order: 1;
}
```

刷新下，然后你会看到“Smile”按钮移动到了主轴的末尾。下面我们谈下它实现的一些细节：

所有 flex 项默认的 order 值是 0。
order 值大的 flex 项比 order 值小的在显示顺序中更靠后。
相同 order 值的 flex 项按源顺序显示。所以假如你有四个元素，其 order 值分别是 2，1，1 和 0，那么它们的显示顺序就分别是第四，第二，第三，和第一。
第三个元素显示在第二个后面是因为它们的 order 值一样，且第三个元素在源顺序中排在第二个后面。

你也可以给 order 设置负值使它们比值为 0 的元素排得更前面。比如，你可以设置“Blush”按钮排在主轴的最前面：

```css
button:last-child {
  order: -1;
}
```

## flex 嵌套

弹性盒子也能创建一些颇为复杂的布局。设置一个元素为 `flex` 项，那么他同样成为一个 `flex` 容器，它的**直接子节点**也是弹性盒子。看一下复杂弹性盒子：[complex-flexbox.html](https://github.com/mdn/learning-area/blob/master/css/css-layout/flexbox/complex-flexbox.html)（[在线浏览](https://mdn.github.io/learning-area/css/css-layout/flexbox/complex-flexbox.html)）。

![flexbox-example7.png](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox/flexbox-example7.png)

```html
<body>
    <header>
      <h1>Complex flexbox example</h1>
    </header>

    <section>
      <article>
        <h2>First article</h2>
        <p>Tacos actually microdosing, pour-over semiotics banjo chicharrones retro fanny pack portland everyday carry vinyl typewriter. Tacos PBR&B pork belly, everyday carry ennui pickled sriracha normcore hashtag polaroid single-origin coffee cold-pressed. PBR&B tattooed trust fund twee, leggings salvia iPhone photo booth health goth gastropub hammock.</p>
      </article>

      <article>
        <h2>Second article</h2>
        <p>Tacos actually microdosing, pour-over semiotics banjo chicharrones retro fanny pack portland everyday carry vinyl typewriter. Tacos PBR&B pork belly, everyday carry ennui pickled sriracha normcore hashtag polaroid single-origin coffee cold-pressed. PBR&B tattooed trust fund twee, leggings salvia iPhone photo booth health goth gastropub hammock.</p>
      </article>

      <article>
        <div>
          <button>Smile</button>
          <button>Laugh</button>
          <button>Wink</button>
          <button>Shrug</button>
          <button>Blush</button>
        </div>
        <div>
          <p>Tacos actually microdosing, pour-over semiotics banjo chicharrones retro fanny pack portland everyday carry vinyl typewriter. Tacos PBR&B pork belly, everyday carry ennui pickled sriracha normcore hashtag polaroid single-origin coffee cold-pressed. PBR&B tattooed trust fund twee, leggings salvia iPhone photo booth health goth gastropub hammock.</p>
        </div>
        <div>
          <p>Cray food truck brunch, XOXO +1 keffiyeh pickled chambray waistcoat ennui. Organic small batch paleo 8-bit. Intelligentsia umami wayfarers pickled, asymmetrical kombucha letterpress kitsch leggings cold-pressed squid chartreuse put a bird on it. Listicle pickled man bun cornhole heirloom art party.</p>
        </div>
      </article>
    </section>
  </body>
```

这个例子的 HTML 是相当简单的。我们用一个 `<section>` 元素包含了三个 `<article>` 元素。第三个 `<article>` 元素包含了三个 `<div>`：

```
section - article
          article
          article - div - button
                    div   button
                    div   button
                          button
                          button
```

现在让我们看一下布局用到的代码。

```css
section {
  display: flex;
}

article {
  flex: 1 200px;
}

article:nth-of-type(3) {
  flex: 3 200px;
  display: flex;
  flex-flow: column;
}

article:nth-of-type(3) div:first-child {
  flex: 1 100px;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: space-around;
}

button {
  flex: 1 auto;
  margin: 5px;
  font-size: 18px;
  line-height: 1.5;
}
```

首先，我们设置 `<section>` 的子节点布局为弹性盒子。

```css
section {
  display: flex;
}
```

接下来我们给 `<article>` 元素设置 `flex` 值。特别注意这里的第二条 CSS 规则：我们设置第三个 `<article>` 元素的子节点的布局同样为 `flex`，但是属性值为列布局。

```css
article {
  flex: 1 200px;
}

article:nth-of-type(3) {
  flex: 3 200px;
  display: flex;
  flex-flow: column;
}
```

接下来，我们选择了第一个 `<div>`。首先使用 `flex: 1 100px;` 简单给它一个最小的高度 `100px`，然后设置它的子节点（`<button>` 元素）为 flex 项。在这里我们将它们放在一个包装行（wrap row）中，使它们居中对齐，就像我们在前面看到的单个按钮示例中做的那样。

```css
article:nth-of-type(3) div:first-child {
  flex: 1 100px;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: space-around;
}
```

最后，我们给按钮设置大小，有意思的是我们给它一个值为 1 的 flex 属性。如果你调整浏览器窗口宽度，你会看到这是一个非常有趣的效果。按钮将尽可能占用最多的空间，尽可能多的堆在同一条线上，但是当它们不再适合在同一条线上，他们中的一些会到下一行去。

```css
button {
  flex: 1;
  margin: 5px;
  font-size: 18px;
  line-height: 1.5;
}
```

## 拓展研究

- [CSS 弹性盒子技巧](https://css-tricks.com/snippets/css/a-guide-to-flexbox)——一篇以视觉吸引人的方式解释弹性盒子所有内容的文章
- [弹性盒子青蛙游戏](https://flexboxfroggy.com/)——学习和更好地了解弹性盒子基础知识的教育游戏
- [FlexBox 测试](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox_skills)

## 参考链接

- [MDN - CSS 布局 - FlexBox](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/CSS_layout/Flexbox)
