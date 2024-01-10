---
title: 项目总结
---

## 1 网站 favicon 图标

favicon.ico 一般用于作为缩略的网站标志，它显示在浏览器的地址栏或者标签上。

目前主要的浏览器都支持 favicon.ico 图标。

* 一、制作favicon图标
  * 把品优购图标切成 png 图片。
  * 把 png 图片转换为 ico 图标，这需要借助于第三方转换网站，例如比特虫:[http://www.bitbug.net/](http://www.bitbug.net/)

* 二、favicon图标放到网站根目录下
* 三、 HTML页面引入favicon图标
  * \1. 在html 页面里面的 \<head> \</head>元素之间引入代码。

```html
<link rel="shortcut icon" href="favicon.ico" type="image/x-icon"/>
```

## 1.7 网站TDK三大标签SEO优化

SEO(Search Engine Optimization)汉译为搜索引擎优化，是一种利用搜索引擎的规则提高网站在有关搜索引擎内自然排名的方式。

SEO 的目的是对网站进行深度的优化，从而帮助网站获取免费的流量，进而在搜索引擎上提升网站的排名，提高网站的知名度。

页面必须有三个标签用来符合 SEO 优化。

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202104/webseo20210419200616.png)

**1. title 网站标题**

title 具有不可替代性，是我们内页的第一个重要标签，是搜索引擎了解网页的入口和对网页主题归属的最佳判断点。

建议:网站名(产品名)- 网站的介绍 (尽量不要超过30个汉字)

例如:

	* 京东(JD.COM)-综合网购首选-正品低价、品质保障、配送及时、轻松购物!
	* 小米商城 - 小米5s、红米Note 4、小米MIX、小米笔记本官方网站

**2. description 网站说明**

我们提倡，description 作为网站的总体业务和主题概括，多采用“我们是...”、“我们提供...”、“×××网作为...”、“电话:010...”之类语句。

例如:

```
<meta name="description" content="京东JD.COM-专业的综合网上购物商城,销售家电、数码通讯、电脑、 家居百货、服装服饰、母婴、图书、食品等数万个品牌优质商品.便捷、诚信的服务，为您提供愉悦的网上购物 体验!" />
```

* \3. keywords 关键字

  **keywords 是页面关键词，是搜索引擎的关注点之一。**

  keywords 最好限制为 6~8 个关键词，关键词之间用英文逗号隔开，采用 关键词1,关键词2 的形式。

```
<meta name= "keywords" content="网上购物,网上商城,手机,笔记本,电脑,MP3,CD,VCD,DV,相机,数码,配 件,手表,存储卡,京东" />
```



### 2.首页制作

网站的首页一般都是使用 index 命名，比如 index.html 或者 index.php 。

我们开始制作首页的头部和底部的时候，根据模块化开发，样式要写到common.css里面。

### 2.1 常用模块类名命名

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202104/webname20210419201020.png)

### 2.2 快捷导航 shortcut 制作

* 通栏的盒子命名为 shortcut ，是快捷导航的意思。 注意这里的行高，可以继承给里面的子盒子
*  里面包含版心的盒子
*  版心盒子里面包含 1 号左侧盒子左浮动
*  版心盒子里面包含 2 号右侧盒子右浮动
*  需要用到字体图标

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202104/webtitle20210419201210.png)

## 3. LOGO SEO 优化

* logo 里面首先放一个 h1 标签，目的是为了提权，告诉搜索引擎，这个地方很重要。
* h1 里面再放一个链接，可以返回首页的，把 logo 的背景图片给链接即可。
* 为了搜索引擎收录我们，我们链接里面要放文字(网站名称)，但是文字不要显示出来。
  *  方法1:text-indent 移到盒子外面(text-indent: -9999px) ，然后 overflow:hidden ，淘宝的做法。
  * 方法2:直接给font-size:0; 就看不到文字了，京东的做法。
* 最后给链接一个 title 属性，这样鼠标放到 logo 上就可以看到提示文字了。

### Tab栏原理-布局需求

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202104/webtable20210422205306.png)

