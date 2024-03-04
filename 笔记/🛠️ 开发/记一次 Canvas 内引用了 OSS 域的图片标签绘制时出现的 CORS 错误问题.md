---
tags:
  - 开发/前端
  - 计算机/网络/跨域
  - 计算机/网络/跨域/CORS
  - 开发/标记语言/HTML
  - 开发/标记语言/HTML/Canvas
  - 基础设施/存储/对象存储/阿里云/OSS
  - 基础设施/云服务商/阿里云/Aliyun
---
# 记一次 Canvas 内引用了 OSS 域的图片标签绘制时出现的 CORS 错误问题

##### 文档版本

| 编辑者 | 版本 | 变更日期 | 变更说明 |
| ----- | --- | ------- | ------- |
| Neko | v1.0.0 | 2022-09-02 | 创建 |

### 文档兼容性

无

## 起因

小音和我说她使用的 `html2canvas` 引用的图片会随机丢失，有时候能稳定复现，有时候又会正常，但是总是有图片会丢失。

调查浏览器的开发者工具的控制台的时候发现是图片相关的响应未正确按照 CORS 期望的设定返回 `Access-Control-Allow-Origin: *` 头部，触发了 CORS 策略错误导致。
而如果不使用 CORS 策略（即打开 html2canvas 配置选项中的 `useCORS: true`  选项）请求图片的话，会导致 canvas 变成不安全的 canvas，或者说是被污染的 canvas（参见：[启用了 CORS 的图片 - HTML（超文本标记语言） | MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/CORS_enabled_image)），在这样的情况下，将不可使用 canvas 上下文 context 调用下列函数：

- `toDataURL()`
- `toBlob()`
- `getImageData()`

这影响了我们需求的开发和实现。

## 解决过程

### 检查 CORS

我先去检查了 OSS 的设置，发现 OSS 已经在 UAT 环境下配置好了 CORS 策略，并且允许了所有域访问、使用所有方法、包含所有 Header。

于是我又通过命令行直接检查了相关资源的 OPTIONS 请求结果：

```shell
curl -H "Origin: https://localhost:3333" -H 'Access-Control-Request-Method: GET' -X OPTIONS 'https://oss.domain/image_key.jpg' -v
```

发现服务器确实有好好返回期望的 `Access-Control-Allow-Origin: *` 头部

```shell
< HTTP/1.1 200 OK
< Server: AliyunOSS
< Date: Fri, 02 Sep 2022 08:57:21 GMT
< Content-Length: 0
< Connection: keep-alive
< x-oss-request-id: 6311C571DC44E0353601CA74
< Access-Control-Allow-Origin: *
< Access-Control-Allow-Methods: GET, POST, PUT, DELETE, HEAD
< Access-Control-Max-Age: 0
< x-oss-server-time: 0
```

所以能排除部分 OSS 的问题了。

### 走弯路

在网络上搜索相关资料的时候发现大多数人都提到了一个之前我们开发时忽略的 `<img>` 属性 `crossorigin`（参考资料：[HTMLImageElement.crossOrigin - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/crossOrigin#value)）。

由于我一开始没有正确理解 html2canvas 的工作原理，导致在这里我期望能够通过给 DOM 树中的 `<img>` 标签添加 `crossorigin="anonymous"` 属性配置来解决问题，但实际上问题根源不在这里，添加了属性配置也无济于事。
实际的情况是，由 `<img>` 标签参与的 DOM 树需要预先渲染一遍到浏览器中，然后再被 html2canvas 库读取到内部，再去使用独属于 `<canvas>` 标签上下文的处理逻辑来处理图片，此时此刻图片又会再次被通过 XHR 请求读取一次，而就像先前提到的 MDN 文档中所描述的：`<canvas>` 标签的安全要求远比 `<img>` 高得多，如果此时此刻出现了 CORS 错误，那么 canvas 的图片将会丢失，无法被渲染出来。对应的，也会影响到 `toDataURL()` 的调用。

所以我们不断去删除属性，开关浏览器开发者工具中网络选项卡的「停用缓存」选项来尝试稳定复现该问题，甚至一度怀疑是 Chrome 的缓存策略写的有 Bug 导致的。不过我们还是想的太简单，这个问题不仅在 Chrome 上能够出现，在首次打开开发环境网站的 Safari 中也有出现，观察请求序列和记录的时候能发现，部分的图片资源请求有时候会有 `Access-Control-Allow-Origin: *` 头存在，有时候又会没有，这个问题在图片资源来源为内存缓存、网络、磁盘缓存的请求中都能找到，而且结果经常反复闪烁，有时候有有时候无，但是如果一旦打开「停用缓存」选项，这个问题又会消失。

这个问题一度陷入无法解决的僵局之中。

我后来又找到两篇内容讲述了类似的遭遇，分别是：

- [javascript - HTML2Canvas with CORS in S3 and CloudFront - Stack Overflow](https://stackoverflow.com/questions/29105249/html2canvas-with-cors-in-s3-and-cloudfront)

- [javascript - How to avoid CORS error when drawing image onto canvas? - Stack Overflow](https://stackoverflow.com/questions/46257444/how-to-avoid-cors-error-when-drawing-image-onto-canvas)

他们都或多或少提到了：

> It works well whether `crossorigin="anonymous"` or not, but sometimes it works, sometimes not either.

亦或是

> If I add the `crossOrigin="anonymous"` I get the CORS error. If I leave that out, the images display but then the `html2canvas` plugin throws a CORS error as well when trying to generate the "screenshot".

这些情况都太过相似，我甚至一度以为就是 OSS 的服务端缓存实现问题导致了这个问题。
而他们的解决方案都是：**在请求资源 URL 中添加一段随机字符串作为 query 参数进行传递**。如果从已经解决了问题的我们的视角来看，这样的方法也确实能够解决缓存问题，只不过是从请求的资源 URL 上下手罢了，但是不太优雅，也许我们应该再探究探究问题的原因所在。

小音在这个时候提了一个问题：

**如果是 CDN 或者是服务端请求导致的缓存滞后或是延迟问题，为什么同一个资源有时候有 CORS 错误，有时候无 CORS 错误呢？**

这个问题其实我也不太清楚，也就是在这个时候我才坚定下来这是浏览器侧的缓存错误导致的问题，可是，如何修复呢？

### 偶然的一瞥

先前的问题还是没有解决，于是我去继续寻找其他问题的答案。有另一个问题是小音询问我的：**`<img>` 标签能够加 crossorigin 属性来强制 CORS，那 CSS 里面的图片怎么办？**。说实话我也不知道这个问题的答案，于是在网络上搜索。也就是在这个时候，我在 [cross domain - Using CORS headers with CSS background-image - Stack Overflow](https://stackoverflow.com/questions/21638606/using-cors-headers-with-css-background-image) StackOverflow 问答上见到了一句评论：

> After doing some research I have determined that the real problem is that Amazon S3 doesn't set the "Vary: Origin" header even if it is configured to support CORS. If anyone knows how to get S3 to do that, that would also be a good answer.
> – [Thayne](https://stackoverflow.com/users/2543666/thayne "6,381 reputation") [Feb 11, 2014 at 16:17](https://stackoverflow.com/questions/21638606/using-cors-headers-with-css-background-image#comment32821554_21638606)

意思是说：

> 在做了一些研究之后，我确定真正的问题是即使将 Amazon S3 配置为支持 CORS 的情况下，Amazon S3 依然没有**自动设置 "Vary:Origin "头**。如果有人知道如何让S3做到这一点，那也将是一个很好的答案。

咦，这个 `Vary: Origin` 看起来非常眼熟，之前在 OSS 的跨域配置中看到过，但是从未仔细了解过具体的含义。但是我们能在另一个回答中能找到些许线索：

> Yes. If a request may contain a `Access-Control-Allow-Origin` with different values, then the CDN should always respond with `Vary: Origin`, even for responses without an `Access-Control-Allow-Origin` header. Your analysis is correct: if the header isn't always present, it would be possible to fill the cache with incorrect values.
> – [monsur](https://stackoverflow.com/users/107250/monsur)[answered Aug 15, 2014 at 16:02](https://stackoverflow.com/a/25329887)

其含义是：

> 是的，如果一个请求可能包含有不同值的 `Access-Control-Allow-Origin`，即使请求没有包含 `Access-Control-Allow-Origin` 头的响应，那么 CDN 应该总是包含返回 `Vary:Origin` 头部，你的分析是正确的：如果头信息不总是存在，就有可能用不正确的值填充缓存。

此时此刻我们去寻找 MDN 关于 `Vary` 头部的文档 [Vary - HTTP | MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Vary)，就能看到：

> **`Vary`** 是一个 HTTP 响应头部信息，它决定了对于未来的一个请求头，应该用一个缓存的回复 (response) 还是向源服务器请求一个新的回复。

这句话可能不太能说明问题，我们继续看 MDN 提供的下面的例子：

> 哪种情况下使用 `Vary`？对于 `User-Agent` 头部信息，例如你提供给移动端的内容是不同的，可用防止你客户端误使用了用于桌面端的缓存。 并可帮助 Google 和其他搜索引擎来发现你的移动端版本的页面，同时告知他们不需要 [Cloaking](https://en.wikipedia.org/wiki/Cloaking)。
>
> 即此时需要设置为 `Vary: User-Agent`
>
> —— 来源 [动态服务](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Vary#%E5%8A%A8%E6%80%81%E6%9C%8D%E5%8A%A1 "Permalink to 动态服务")

也就是说如果我们需要根据 User-Agent 的不同指挥浏览器去读写缓存，那么我们就使用 `Vary: User-Agent` 头来实现。

此刻我们再去看看阿里云 OSS 的跨域设置选项当中的最后一项下面的注释：**返回 Vary: Origin**

![](assets/canvas-referenced-oss-cross-origin-image-as-source-img-element-caused-cors-error-record-screenshot-01.png)

关键的信息是：**如果浏览器同时存在 CORS 和非 CORS 请求，请启用该选项否则会出现跨域问题。**

综上所述，对于在跨域场景下的 GET 请求而言，我们能知道由于 CORS 策略所产生的的 OPTIONS 预检请求相比非 CORS 策略限制的的 GET 请求多了 `Origin: <请求来源域名>`  头部，那么先前在 [cross domain - Using CORS headers with CSS background-image - Stack Overflow](https://stackoverflow.com/questions/21638606/using-cors-headers-with-css-background-image) StackOverflow 问答中看到的评论所提到的 `Vary: Origin` 头部的作用就可以理解为：

> 根据不同的 Origin 值采用不同的缓存。

而 CORS 是会指定 Origin 头的，非 CORS 不会，那么此刻这两种看似相似的请求就能够被浏览器区分了，浏览器将能以此够决断对于未来的一个请求头，应该用一个缓存的响应还是向源服务器请求一个新的响应。此处的答案就是：**它能知道应该采用 CORS 的响应而不是非 CORS 的响应**。

如果理论正确，浏览器中的缓存错乱问题就能被解决了。（找答案找的歪打正着了属于是）

## 修复

在阿里云 OSS 的 Bucket 后台中选择「权限设置」-「跨域设置」-「跨域设置」-「编辑」-「勾选 **返回 Vary: Origin**」。

勾选后重新刷新浏览器缓存，再次尝试复现先前的错误，能够发现问题已经被解决了。
