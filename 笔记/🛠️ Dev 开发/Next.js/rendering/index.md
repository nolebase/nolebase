---
title: Rendering
description: Learn the differences between Next.js rendering environments, strategies, and runtimes.
---

Rendering converts the code you write into user interfaces. This section will help you understand the differences between rendering environments, Client and Server Component rendering, static and dynamic rendering, and runtimes.

## 背景

Web应用渲染有两种环境：客户端和服务器端。
There are two environments where web applications can be rendered: the client and the server.

<Image
  alt="Client and Server Environments"
  srcLight="https://nextjs.org/docs/light/client-and-server-environments.png"
  srcDark="https://nextjs.org/docs/dark/client-and-server-environments.png"
  width="1600"
  height="672"
/>

- **客户端** 指的是用户设备上的浏览器，它向服务器发送请求，获取你的应用程序代码。然后，它将服务器的响应转化为用户可以与之交互的界面。
- **服务器** 指的是数据中心的计算机，它存储你的应用程序代码，接收客户端的请求，进行一些计算，然后发回适当的响应。

Before React 18, the primary way to render your application was entirely on the client. Next.js provided an easier way to break down your application into **pages** and render on the server.

Now, with Server and Client Components, **React renders on the client and the server**, meaning you can choose where to render your application code, per component.

By default, the App Router uses Server Components to improve performance, and you can opt into using Client Components when needed.

Learn more about rendering by exploring the sections below:
