---
title: 04 免费图床
---
## 前言
小伙伴门在写博客的时候，用的是什么写的呢？我这边主要用的是vuepress 一个vue框架写的，当然了，里面也是主makdown语法写的，写的时候总是需要用到 一些图片，以前主要是把这些图片放到了项目的相对路径，这样的话只有运行项目或者部署到线上才能看到图片的效果，不是太方便，而且，图片也会越来越多，项目也显得很臃肿，资源比较乱，也不利于文章的迁移，所以想找一个图床来解决，就在这里记录以下具体的过程和一些坑吧

### 用到的主要技术
**PicGo+github+jsdelivr**

* PicGo 上传图片的工具
* github 存放图片的地址
* jsdelivr cnd 映射

### github

* 首先有一个账号，然后新建一个用于存储图片的仓库，如 image ，要是一个公开仓库
* 然后配置一个（个人访问令牌） token https://github.com/settings/tokens

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2021/0320210325202620githubtoken.png)

​	配置权限

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2021/0320210325203100githubtoken01.png)

### PicGo

下载地址：[https://github.com/Molunerfinn/PicGo/releases ](https://github.com/Molunerfinn/PicGo/releases)选择自己需要的版本

* 配置

  <img src="https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2021/0320210325203752piago.png" style="zoom:50%;" />

* 默认上传的就是本地的图片名，可以在设置中开启重命名或者以时间命名，还可以二者同时开启

### jsdelivr 说明

主要用到为我们提供的免费映射地址，比较快

官网： [https://www.jsdelivr.com/](https://www.jsdelivr.com/)

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2021/0320210325204307jsdelivr.png)

我们主要用到第一个，

https://cdn.jsdelivr.net/gh/user/repo@version/file

https://cdn.jsdelivr.net/gh/[github用户名]/仓库名@[分支，main] 我们配置到这就可以了，后面是各个文件的详细地址

