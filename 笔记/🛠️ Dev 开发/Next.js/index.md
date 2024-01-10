# 介绍

欢迎访问 Next.js 文档！

## 什么是 Next.js？

Next.js 是一个用于构建全栈网络应用的 React 框架。您可以使用 React 组件（Components）构建用户界面的同时，使用 Next.js 实现一些附加功能和优化。

在内部，Next.js 总结并自动配置了 React 所需的工具，如绑定器、编译器等。这样，您就可以专注于构建应用程序，而不必把时间花在配置上。

无论您是个人开发者还是大型团队的一员，Next.js 都能帮助您构建交互式、动态和快速的 React 应用程序。

## 主要功能

Next.js 的一些主要功能包括：

| 功能  | 介绍 |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [路由](https://nextjs.org/docs/app/building-your-application/routing) | 建立在服务器组件之上、基于文件系统的路由，支持（配置）布局、嵌套路由、（显示）加载状态、错误处理等功能。 |
| [渲染](https://nextjs.org/docs/app/building-your-application/rendering) | 使用客户端（Client-side）和服务端（Server-side）组件进行客户端和服务器端渲染。利用 Next.js 进一步优化服务器上的静态和动态渲染。在 Edge 和 Node.js 运行时进行流式处理。|
| [数据获取](https://nextjs.org/docs/app/building-your-application/data-fetching)       | 在服务器组件中使用 async/await 简化了数据获取，并为"请求记忆”（fetch memoization）、数据缓存和重新验证提供了一个扩展的 `fetch` API。|
| [样式](https://nextjs.org/docs/app/building-your-application/styling)                   | 支持您喜欢的样式设计方法，包括 CSS 模块（Modules）、Tailwind CSS 和 CSS-in-JS |
| [优化](https://nextjs.org/docs/app/building-your-application/optimizing)          | 图像、字体和脚本优化，改善应用程序的核心网络活力和用户体验。 |
| [TypeScript](https://nextjs.org/docs/app/building-your-application/configuring/typescript) | 改进了对 TypeScript 的支持，包括更好的类型检查和更高效的编译，以及自定义 TypeScript 插件和类型检查器。 |

## 如何使用这些文档

在屏幕左侧，你会看到文档导航栏。文档页面按从基础到高级的顺序排列，因此您可以在构建应用程序时逐步阅读。不过，你也可以按照任何顺序阅读，或者跳到适用于你的用例的页面。

在屏幕的右侧，你会看到一个目录，可以更方便地在页面的各个部分之间进行导航。如果需要快速查找页面，可以使用顶部的搜索栏或搜索快捷键（`Ctrl+K` 或`Cmd+K`）。

要开始使用，请查看 [安装](https://nextjs.org/docs/getting-started/installation) 指南。如果您是 React 新手，建议您阅读 [React 基础](https://nextjs.org/docs/getting-started/react-essentials) 页面。

## App 路由与 页面路由

Next.js 有两种不同的路由：App路由（App Router）和页面路由（Pages Router）。App 路由是一种较新的路由，允许您使用 React 的最新功能，如服务器组件（Server Components）和流（Streaming）。页面路由器是最初的 Next.js 路由器，它允许你构建服务器渲染的 React 应用程序，并继续支持较旧的 Next.js 应用。

在侧边栏顶部，你会看到一个下拉菜单，允许你在**App 路由**和**页面路由**功能之间切换。由于每个目录都有其独有的功能，因此跟踪选择了哪个选项卡非常重要。

页面顶部的面包屑也会显示你是在查看应用程序路由器文档还是页面路由器文档。

## 必备知识

虽然我们的文档旨在为初学者提供方便，但我们需要建立一个基线，以便文档能始终专注于 Next.js 功能。在引入新概念时，我们会确保提供相关文档的链接。

要充分利用我们的文档，建议您对 HTML、CSS 和 React 有基本的了解。如果您需要补习 React 技能，请查看我们的 [Next.js 基础课程](https://nextjs.org/learn/foundations/about-nextjs)，它将为您介绍基础知识。

## 辅助功能

在使用屏幕阅读器阅读文档时，我们建议使用 Firefox 和 NVDA，或 Safari 和 VoiceOver，以获得最佳的无障碍阅读效果。

## 加入我们的社区

如果您有任何关于 Next.js 的问题，欢迎随时通过 [GitHub 讨论区](https://github.com/vercel/next.js/discussions)、[Discord](https://discord.com/invite/bUG2bvbtHy)、[Twitter](https://twitter.com/nextjs) 和 [Reddit](https://www.reddit.com/r/nextjs) 向我们的社区提问。
