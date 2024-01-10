---
title: 第 3 节 Node.js 简介
---

# 第 3 节 Node.js 简介

- Node.js 是一个能够在服务器端运行 JavaScript 的开放源代码、跨平台 JavaScript 运行环境。
- Node 采用 Google 开发的 V8 引擎运行 js 代码，使用 **事件驱动、非阻塞和异步 I/O 模型** 等技术来提高性能，
可优化应用程序的传输量和规模。
- Node 大部分基本模块都用 `JavaScript` 编写。在 Node 出现之前，JS 通常作为客户端程序设计语言使用，
以 `JS` 写出的程序常在用户的浏览器上运行。
- 目前，Node已被IBM、Microsoft、Yahoo!、Walmart、Groupon、SAP、LinkedIn、Rakuten、PayPal、Voxer 和 GoDaddy等企业采用。

### 瑞安·达尔(Ryan Dahl)

- Ryan Dahl并非科班出身的开发者，在2004年的时候他还在纽约的罗彻斯特大学数学系读博士。
- 2006年，也许是厌倦了读博的无聊，他产生了『世界那么大我想去看看』的念头，做出了退学的决定，然后一个人来到智利的 `Valparaiso` 小镇。
- 从那起，Ryan Dahl不知道是否因为生活的关系，他开始学习网站开发了，走上了码农的道路。
- 那时候Ruby on Railsa很火，他也不例外的学习了它。
- 从那时候开始，Ryan Dahl的生适方式就是接项目，然后去客户的地方工作，在他眼中，拿工资和上班其实就是去那里旅行。
- Ryan Dahl经过两年的工作后，成为了高性能Web服务器的专家，从接开发应用到变成专门帮客户解决性能问题的专家。
- 期间他开始写一些开源项目帮助客户解决Wb服务器的高并发性能问题，他尝试了很多种语言，但是最终都失败了。
- 在他快绝望的时候，V8引擎来了。V8满足他关于高性能Web服务器的想象。于是在2009年2月它开始着手编写Node.js。

![](https://user-images.githubusercontent.com/92929085/183227270-3e0a3548-0e9a-46f5-b5af-470aa0afc3ea.png)

I/O 影响了服务器的性能。

Node.js 创建之初的目的是用 `JavaScript` 开发高性能 Web 服务器。

### Node的历史

| 时间    |  事件   |
| ---    | ---    |
|2009年  | 瑞安·达尔(Ryan Dahl)在GitHub.上发布node的最初版本 |
|2010年1月 | Node的包管理器npm诞生                         |
|2010年底  | Joyent公司赞助Node的开发，瑞安·达尔加入旗下，全职负责Node |
|2011年7月  | Node在微软的帮助下发布了windows版本             |
|2011年11月 | Node超越Ruby on Rails,称为GitHub.上关注度最高的项目 |
|2012年1月  |瑞安.达尔离开Node项目 |
|2014年12月 | Fedor Indutny在2014年12月制作了分支版本，并起名"io.js” |
|2015年初 |Node.js基金会成立(IBM、Intel、微软、Joyent) |
|2015年9月 | Node.js和io.js合并，Node4.0发布 |
2016年
Node6.0发布
2017年
Node8.0发布

Node.js 的奇数版为开发版，偶数版为稳定版。

Node的用途
- Web服务API,比如REST
- 实时多人游戏
- 后端的Web服务，例如跨域、服务器端的请求
- 基于Web的应用
- 多客户端的通信，如即时通信
