---
tags:
  - 规范/Open-Graph-Protocol
  - 开发/标记语言/HTML
  - 开发/后端/爬虫
  - 开发/后端
  - 开发/数据/爬虫
  - 开发/后端/边缘计算/Serverless
  - 开发/后端/边缘计算/Cloudflare-Workers
---
# 使用 Cloudflare Workers 实现一个链接预览服务

最近有一些想要抓取链接预览数据的需求，先是在 Golang 里面写了两次[^1]，但是又有前端项目需要，但是前端去拉的话容易遇到跨域、UA 判定、外链封锁等等的问题，所以想了想，既然 Cloudflare Workers 在 Runtime 中提供了 [HTMLRewriter](https://developers.cloudflare.com/workers/runtime-apis/html-rewriter/) API 和 [Cache](https://developers.cloudflare.com/workers/runtime-apis/cache/) API，也许可以单独用 Cloudflare Workers 写一个云端的边缘计算服务端来帮忙做代理和 HTML 解析和数据抓取。

[^1]: 在 [insights-bot](https://github.com/nekomeowww/insights-bot) 的 [`linkprev`](https://github.com/nekomeowww/insights-bot/tree/v0.21.1/pkg/linkprev) 包中的 [`liveprev.go`](https://github.com/nekomeowww/insights-bot/blob/v0.21.1/pkg/linkprev/linkprev.go) 中有第一份实现，
