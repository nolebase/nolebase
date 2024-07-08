---
tags:
  - 开发/前端
  - 开发/前端/WebGL
  - 开发/前端/图形学
  - 开发/前端/动画
  - 艺术/模型/Live2D
  - 开发/前端/WebGL/pixi
  - 开发/前端/Vue
  - 开发/语言/TypeScript
  - 命令行/npm
  - 命令行/pnpm
---
# 通过 Pixi.js 渲染器集成 Live2D 模型到 Vue 应用中

[guansss/pixi-live2d-display](https://github.com/guansss/pixi-live2d-display) 看起来是一个比较好的封装，它内部是通过 `git submodule` 的形式集成的 Cubism SDK 到运行时的[^1]。

> - [guansss/pixi-live2d-display](https://github.com/guansss/pixi-live2d-display) 是通过 fork 的 [Live2D/CubismWebFramework](https://github.com/Live2D/CubismWebFramework?tab=readme-ov-file) 的一个 Repo [guansss/CubismWebFramework](https://github.com/guansss/CubismWebFramework/tree/4bbfb54d6787daec3a7911c6550b5d39dcb3a263) 。
> - Cubism SDK 的 [README 中提及](https://github.com/Live2D/CubismWebFramework/blob/ac5eb9e42981a0198942d4fb886a033dc3a4eb27/README.md?plain=1#L26)，SDK 的文档在 [SDK Compatibility with Cubism 5 Features | SDK Manual | Live2D Manuals & Tutorials](https://docs.live2d.com/en/cubism-sdk-manual/compatibility-with-cubism-5/)

集成 `pixi-live2d-display` 其实非常简单，我们在项目中安装一下就好了：

```shell
pnpm i pixi-live2d-display
```

除此以外我们也要添加 `pixi.js` 的核心包，我这里选择用 `@pixi/<组件>` 的形式安装[^2]：

```shell
pnpm i @pixi/app @pixi/extensions @pixi/interaction @pixi/ticker
```

如果希望指定兼容版本（比如 `pixi-live2d-display` 在 2024 年 6 月 6 日的时候还在要求的 `pixi.js@6` 的兼容性）的话，可以用

```
pnpm i @pixi/app@6 @pixi/extensions@6 @pixi/interaction@6 @pixi/ticker@6
```

按照文档，要在项目中集成 [guansss/pixi-live2d-display](https://github.com/guansss/pixi-live2d-display) 的话还需要 Cubism Core SDK：

> Before using the plugin, you'll need to include the Cubism runtime library, aka Cubism Core.
> 
> For Cubism 4, you need `live2dcubismcore.min.js` that can be extracted from the [Cubism 4 SDK](https://www.live2d.com/download/cubism-sdk/download-web/), or be referred by a [direct link](https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js) (_however the direct link is quite unreliable, don't use it in production!_).

我们可以到 [Live2D Cubism SDK for Web ダウンロード | Live2D Cubism](https://www.live2d.com/sdk/download/web/) 下载。

> 其他平台（Unity，Java 等）SDK 可以到 [Live2D Cubism SDK | Live2D Cubism](https://www.live2d.com/en/sdk/about/) 索引找到。

![[integrate-live2d-into-vue-app-screenshot-2.png]]

下载之后会获得这样的目录：

![[integrate-live2d-into-vue-app-screenshot-3.png]]

我们可以在项目中的 `public` 目录下面创建一个 `assets/js/CubismSdkForWeb-5-r.1` 的目录，然后把解压缩出来的 `CubismSdkForWeb-5-r.1/Core` 目录下面的内容复制到创建的 `public/assets/js/CubismSdkForWeb-5-r.1/Core` 目录中，就像是这样：

![[integrate-live2d-into-vue-app-screenshot-4.png]]

接下来我们在 Web 应用的入口 `index.html` 中添加对 Cubism Core 的引用：

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <title>Vitesse Lite</title>
    <meta name="description" content="Opinionated Vite Starter Template" />
    <script src="./assets/js/CubismSdkForWeb-5-r.1/Core/live2dcubismcore.min.js"></script><!-- !code ++ -->
  </head>
  <body class="font-sans dark:text-white dark:bg-hex-121212">
    <div id="app"></div>
    <noscript>
      <div>Please enable JavaScript to use this application.</div>
    </noscript>
    <script>
      ;(function () {
        const prefersDark =
          window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
        const setting = localStorage.getItem('color-schema') || 'auto'
        if (setting === 'dark' || (prefersDark && setting !== 'light'))
          document.documentElement.classList.toggle('dark', true)
      })()
    </script>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

事实上 Live2D 的[官方网站](https://www.live2d.com/zh-CHS/learn/sample/)上就可以下载很多测试用的模型，包括 Neuro Sama 最早使用的可以免费商业使用的模型「桃濑日和」：

![[integrate-live2d-into-vue-app-screenshot-1.png]]

我们可以在 `public` 目录下创建一组嵌套的 `assets/live2d/models` 目录，在从网站上下载模型之后我们把下载后的压缩包解压出来放到 `public/live2d/models` 目录下就可以在代码中直接引用了：

```vue
<script setup lang="ts" generic="T extends any, O extends any">
import { onMounted, ref } from 'vue'
import { Application } from '@pixi/app'
import { extensions } from '@pixi/extensions'
import { Ticker, TickerPlugin } from '@pixi/ticker'
import { Live2DModel } from 'pixi-live2d-display/cubism4'

defineOptions({
  name: 'IndexPage',
})

const containerRef = ref<HTMLDivElement>()

onMounted(async () => {
  if (!containerRef.value)
    return

  // https://guansss.github.io/pixi-live2d-display/#package-importing
  Live2DModel.registerTicker(Ticker)
  extensions.add(TickerPlugin)

  const app = new Application({
    width: 1200,
    height: 1200,
    backgroundAlpha: 0,
  })

  containerRef.value.appendChild(app.view)

  const model = await Live2DModel.from('live2d/models/hiyori_free_zh/runtime/hiyori_free_t08.model3.json')
  app.stage.addChild(model as any)

  model.x = 600
  model.y = 600
  model.rotation = Math.PI
  model.skew.x = Math.PI
  model.scale.set(0.3, 0.3)
  model.anchor.set(0.5, 0.5)

  model.on('hit', (hitAreas) => {
    if (hitAreas.includes('body'))
      model.motion('tap_body')
  })
})
</script>

<template>
  <div>
    <span>Hello</span>
    <div ref="containerRef" h-full w-full />
  </div>
</template>
```

然后我们在 Vue 应用的入点中直接写下这样的代码就可以看到「桃濑日和」的模型加载出来了。

其他的集成方法可以参考 [Live2D/CubismWebSamples](https://github.com/Live2D/CubismWebSamples) 中的代码示例。

[^1]: 参见代码 https://github.com/guansss/pixi-live2d-display/blob/31317b37d5e22955a44d5b11f37f421e94a11269/src/Live2DModel.ts#L1-L2 和 https://github.com/guansss/pixi-live2d-display/blob/31317b37d5e22955a44d5b11f37f421e94a11269/src/cubism4/check-runtime.ts#L1C22-L5 
[^2]: [@pixi/app - npm](https://www.npmjs.com/package/@pixi/app)